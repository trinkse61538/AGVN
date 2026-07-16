const fs = require('fs');
const path = require('path');

const SHEET_ID = '1LFD5TFBzRImhyWDQGoNw8I4aVgaYDZ-H1iwktL5P5-Y';
const NEWS_SHEET_ID = '1H5CENOofHF7mZ_A-kq2nue1Y6eVeJBm6RS2RrMjb6Lc';
// Có thể để null. Hệ thống sẽ ưu tiên gid, sau đó tự dò tab theo header.
const PRODUCT_SHEET_GID = null;
const NEWS_SHEET_GID = null;

const PRODUCT_SHEET_NAMES = ['Products', 'Sản phẩm', 'San pham', '1', 'Sheet1'];
const NEWS_SHEET_NAMES = ['News', 'Tin tức', 'Tin tuc', '1', 'Sheet1'];

const PRODUCT_REQUIRED_FIELDS = {
  slug: ['Slug'],
  name: ['ProductName', 'Product Name', 'Tên sản phẩm', 'Ten san pham'],
};

const NEWS_REQUIRED_FIELDS = {
  slugOrTitle: ['Slug', 'Title', 'Tiêu đề', 'Tieu de'],
  title: ['Title', 'Tiêu đề', 'Tieu de'],
};

const GENERATED_IMAGE_DIR = path.join(__dirname, 'assets', 'generated-images');
const GENERATED_IMAGE_WEB_PREFIX = '/assets/generated-images';
const IMAGE_MANIFEST_PATH = path.join(GENERATED_IMAGE_DIR, 'manifest.json');
const TRANSPARENT_PLACEHOLDER =
  'data:image/svg+xml;charset=UTF-8,' +
  encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 9"></svg>');
const DEFAULT_NEWS_IMAGE = 'https://cdn.jsdelivr.net/gh/trinkse61538/AGVN@main/images/bonglua.png';

const FETCH_TIMEOUT_MS = 30000;
const FETCH_RETRIES = 3;

const IMAGE_EXTENSION_BY_TYPE = {
  'image/jpeg': 'jpg',
  'image/jpg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
  'image/gif': 'gif',
  'image/avif': 'avif',
  'image/svg+xml': 'svg',
  'image/bmp': 'bmp',
  'image/x-icon': 'ico',
  'image/vnd.microsoft.icon': 'ico',
};

const TAG_MAP = {
  kienthuc: { label: 'Kiến Thức', color: '#007A33' },
  kythuat: { label: 'Kỹ Thuật', color: '#FFB81C' },
  thanhcong: { label: 'Thành Công', color: '#FF4D4D' },
  sanpham: { label: 'Sản Phẩm', color: '#00A896' },
  hoatdong: { label: 'Hoạt Động', color: '#8DC63F' },
};

function ensureDirSync(dirPath) {
  if (!fs.existsSync(dirPath)) fs.mkdirSync(dirPath, { recursive: true });
}

function fileExists(filePath) {
  try {
    return fs.existsSync(filePath);
  } catch {
    return false;
  }
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function normalizeAmpersands(input) {
  return String(input || '').trim().replace(/&amp;/g, '&');
}

function toCdnUrl(url) {
  if (!url || typeof url !== 'string') return '';
  const cleanUrl = normalizeAmpersands(url);
  if (!cleanUrl) return '';

  try {
    const parsed = new URL(cleanUrl);
    const parts = parsed.pathname.split('/').filter(Boolean);

    if (parsed.hostname === 'raw.githubusercontent.com' && parts.length >= 4) {
      const [owner, repo, ref] = parts;
      return `https://cdn.jsdelivr.net/gh/${owner}/${repo}@${ref}/${parts.slice(3).join('/')}`;
    }

    if (parsed.hostname === 'github.com' && parts.length >= 5 && parts[2] === 'blob') {
      return `https://cdn.jsdelivr.net/gh/${parts[0]}/${parts[1]}@${parts[3]}/${parts.slice(4).join('/')}`;
    }

    return cleanUrl;
  } catch {
    return cleanUrl;
  }
}

function cdnizeHtml(input) {
  if (!input || typeof input !== 'string') return input || '';
  let output = input.replace(/https:\/\/raw\.githubusercontent\.com\/[^\s"'<>]+/g, toCdnUrl);
  output = output.replace(/https:\/\/github\.com\/[^\s"'<>]+\/blob\/[^\s"'<>]+/g, toCdnUrl);
  return output;
}

function escapeAttr(value) {
  return String(value || '')
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function extractSlug(fullUrl) {
  if (!fullUrl) return '';
  let cleanUrl = String(fullUrl).trim().replace(/\.html$/i, '');
  const parts = cleanUrl.split('/');
  return (parts[parts.length - 1] || '').replace(/[^a-zA-Z0-9-_]/g, '');
}

function sanitizeFilePart(value) {
  return String(value || '')
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/[^a-z0-9-_]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '') || 'image';
}

function toSlug(text) {
  if (!text) return '';
  return String(text)
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function estimateReadTime(content) {
  const cleanText = String(content || '').replace(/<[^>]*>/g, '');
  return String(Math.max(1, Math.round(cleanText.length / 500)));
}

function loadImageManifest() {
  ensureDirSync(GENERATED_IMAGE_DIR);
  if (!fileExists(IMAGE_MANIFEST_PATH)) return { items: {} };

  try {
    const parsed = JSON.parse(fs.readFileSync(IMAGE_MANIFEST_PATH, 'utf8'));
    return parsed && typeof parsed.items === 'object' ? parsed : { items: {} };
  } catch (error) {
    console.warn(`⚠️ Manifest ảnh bị lỗi, sẽ tạo lại: ${error.message}`);
    return { items: {} };
  }
}

function saveImageManifest(manifest) {
  ensureDirSync(GENERATED_IMAGE_DIR);
  fs.writeFileSync(IMAGE_MANIFEST_PATH, JSON.stringify(manifest, null, 2), 'utf8');
}

async function fetchWithTimeout(url, options = {}, timeoutMs = FETCH_TIMEOUT_MS) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(url, { ...options, signal: controller.signal });
  } finally {
    clearTimeout(timer);
  }
}

async function fetchTextWithRetry(url, label, options = {}) {
  let lastError;
  for (let attempt = 1; attempt <= FETCH_RETRIES; attempt += 1) {
    try {
      const response = await fetchWithTimeout(url, options);
      if (!response.ok) {
        const body = (await response.text()).slice(0, 300);
        throw new Error(`HTTP ${response.status}${body ? ` — ${body}` : ''}`);
      }
      return await response.text();
    } catch (error) {
      lastError = error;
      console.warn(`⚠️ ${label}: lần ${attempt}/${FETCH_RETRIES} thất bại — ${error.message}`);
      if (attempt < FETCH_RETRIES) await sleep(attempt * 2500);
    }
  }
  throw new Error(`${label} thất bại sau ${FETCH_RETRIES} lần: ${lastError?.message || 'Unknown error'}`);
}

function parseCsv(csvText) {
  const rows = [];
  let row = [];
  let value = '';
  let inQuotes = false;

  for (let i = 0; i < csvText.length; i += 1) {
    const char = csvText[i];
    const next = csvText[i + 1];

    if (char === '"') {
      if (inQuotes && next === '"') {
        value += '"';
        i += 1;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      row.push(value);
      value = '';
    } else if ((char === '\n' || char === '\r') && !inQuotes) {
      if (char === '\r' && next === '\n') i += 1;
      row.push(value);
      value = '';
      if (row.some((cell) => cell.trim() !== '')) rows.push(row);
      row = [];
    } else {
      value += char;
    }
  }

  if (value || row.length) {
    row.push(value);
    if (row.some((cell) => cell.trim() !== '')) rows.push(row);
  }

  if (rows.length < 2) return [];
  const headers = rows[0].map((header) => header.replace(/^\uFEFF/, '').trim());
  return rows.slice(1).map((cells) => {
    const item = {};
    headers.forEach((header, index) => {
      if (header) item[header] = String(cells[index] ?? '').trim();
    });
    return item;
  });
}

function normalizeHeader(value) {
  return String(value || '')
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/[^a-z0-9]+/g, '');
}

function getRowValue(row, aliases) {
  const normalizedMap = new Map(
    Object.entries(row || {}).map(([key, value]) => [normalizeHeader(key), value])
  );
  for (const alias of aliases) {
    const value = normalizedMap.get(normalizeHeader(alias));
    if (value !== undefined) return String(value ?? '').trim();
  }
  return '';
}

function validateSheetHeaders(rows, requiredFields) {
  if (!Array.isArray(rows) || rows.length === 0) {
    return { ok: false, missing: ['dữ liệu'] };
  }

  const headers = Object.keys(rows[0] || {}).map(normalizeHeader);
  const missing = [];
  for (const [field, aliases] of Object.entries(requiredFields)) {
    const found = aliases.some((alias) => headers.includes(normalizeHeader(alias)));
    if (!found) missing.push(`${field} (${aliases.join(' / ')})`);
  }
  return { ok: missing.length === 0, missing };
}

function decodeGoogleEscapedString(value) {
  try {
    return JSON.parse(`"${String(value).replace(/"/g, '\\"')}"`);
  } catch {
    return String(value || '');
  }
}

async function discoverSheetTabs(sheetId, label) {
  const url = `https://docs.google.com/spreadsheets/d/${sheetId}/edit`;
  try {
    const html = await fetchTextWithRetry(url, `${label}: đọc danh sách tab`, {
      headers: { 'User-Agent': 'Mozilla/5.0 AGVN Sheet Sync' },
    });

    const found = new Map();
    const patterns = [
      /"sheetId"\s*:\s*(\d+)[\s\S]{0,500}?"title"\s*:\s*"((?:\\.|[^"\\])*)"/g,
      /"title"\s*:\s*"((?:\\.|[^"\\])*)"[\s\S]{0,500}?"sheetId"\s*:\s*(\d+)/g,
      /\[\s*(\d+)\s*,\s*"((?:\\.|[^"\\])*)"\s*,/g,
    ];

    for (let patternIndex = 0; patternIndex < patterns.length; patternIndex += 1) {
      const regex = patterns[patternIndex];
      let match;
      while ((match = regex.exec(html)) !== null) {
        const gid = patternIndex === 1 ? match[2] : match[1];
        const rawName = patternIndex === 1 ? match[1] : match[2];
        const name = decodeGoogleEscapedString(rawName);
        if (gid && name && !found.has(gid)) found.set(gid, { gid, name });
      }
    }

    const tabs = [...found.values()];
    if (tabs.length) {
      console.log(`✅ ${label}: tìm thấy ${tabs.length} tab: ${tabs.map((t) => `${t.name} (gid=${t.gid})`).join(', ')}`);
    } else {
      console.warn(`⚠️ ${label}: không đọc được danh sách tab tự động; sẽ dùng danh sách dự phòng.`);
    }
    return tabs;
  } catch (error) {
    console.warn(`⚠️ ${label}: không thể dò danh sách tab — ${error.message}`);
    return [];
  }
}

async function fetchRowsFromSource({ sheetId, sheetName, gid, label }) {
  const sources = [];
  if (sheetName) {
    const encodedSheet = encodeURIComponent(sheetName);
    sources.push({
      name: `OpenSheet / ${sheetName}`,
      url: `https://opensheet.elk.sh/${sheetId}/${encodedSheet}`,
      parse: (text) => JSON.parse(text),
    });
    sources.push({
      name: `Google GViz / ${sheetName}`,
      url: `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:csv&sheet=${encodedSheet}`,
      parse: parseCsv,
    });
  }
  if (gid !== null && gid !== undefined && String(gid) !== '') {
    sources.push({
      name: `Google GViz / gid=${gid}`,
      url: `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:csv&gid=${encodeURIComponent(gid)}`,
      parse: parseCsv,
    });
  }

  const errors = [];
  for (const source of sources) {
    try {
      console.log(`↳ ${label}: thử ${source.name}...`);
      const text = await fetchTextWithRetry(source.url, `${label} qua ${source.name}`, {
        headers: { 'User-Agent': 'Mozilla/5.0 AGVN Sheet Sync' },
      });
      const rows = source.parse(text);
      if (!Array.isArray(rows)) throw new Error('Dữ liệu trả về không phải danh sách');
      return rows;
    } catch (error) {
      errors.push(`${source.name}: ${error.message}`);
    }
  }
  throw new Error(errors.join(' | '));
}

async function fetchSheetRowsAuto({
  sheetId,
  preferredGid,
  preferredNames,
  requiredFields,
  label,
}) {
  const candidates = [];
  const seen = new Set();
  const addCandidate = (candidate) => {
    const key = `${candidate.gid ?? ''}|${candidate.name ?? ''}`;
    if (!seen.has(key)) {
      seen.add(key);
      candidates.push(candidate);
    }
  };

  if (preferredGid !== null && preferredGid !== undefined && String(preferredGid) !== '') {
    addCandidate({ gid: String(preferredGid), name: null, reason: 'gid cấu hình' });
  }

  const discoveredTabs = await discoverSheetTabs(sheetId, label);
  for (const preferredName of preferredNames) {
    const exact = discoveredTabs.find(
      (tab) => normalizeHeader(tab.name) === normalizeHeader(preferredName)
    );
    if (exact) addCandidate({ ...exact, reason: 'tên ưu tiên' });
  }
  for (const tab of discoveredTabs) addCandidate({ ...tab, reason: 'tự dò' });
  for (const name of preferredNames) addCandidate({ name, gid: null, reason: 'tên dự phòng' });
  addCandidate({ gid: '0', name: null, reason: 'tab đầu tiên dự phòng' });

  const errors = [];
  for (const candidate of candidates) {
    try {
      const rows = await fetchRowsFromSource({
        sheetId,
        sheetName: candidate.name,
        gid: candidate.gid,
        label,
      });
      const validation = validateSheetHeaders(rows, requiredFields);
      if (!validation.ok) {
        throw new Error(`thiếu header bắt buộc: ${validation.missing.join(', ')}`);
      }
      console.log(
        `✅ ${label}: chọn tab ${candidate.name || '(không rõ tên)'}${candidate.gid !== null && candidate.gid !== undefined ? `, gid=${candidate.gid}` : ''}; ${rows.length} dòng.`
      );
      return rows;
    } catch (error) {
      errors.push(`${candidate.name || `gid=${candidate.gid}`}: ${error.message}`);
      console.warn(`⚠️ ${label}: bỏ qua ứng viên ${candidate.name || `gid=${candidate.gid}`} — ${error.message}`);
    }
  }

  throw new Error(`Không tìm được tab hợp lệ. ${errors.join(' | ')}`);
}

function extractGoogleDriveFileId(input) {
  const url = normalizeAmpersands(input);
  const patterns = [
    /drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)/i,
    /drive\.google\.com\/open\?.*?[?&]id=([a-zA-Z0-9_-]+)/i,
    /drive\.google\.com\/uc\?.*?[?&]id=([a-zA-Z0-9_-]+)/i,
    /drive\.google\.com\/thumbnail\?.*?[?&]id=([a-zA-Z0-9_-]+)/i,
    /[?&]id=([a-zA-Z0-9_-]+)/i,
  ];
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match?.[1]) return match[1];
  }
  return '';
}

function getExtensionFromUrl(url) {
  try {
    const pathname = decodeURIComponent(new URL(url).pathname || '').toLowerCase();
    const match = pathname.match(/\.([a-z0-9]{2,5})$/i);
    if (!match) return '';
    const ext = match[1].toLowerCase();
    return ['jpg', 'jpeg', 'png', 'webp', 'gif', 'avif', 'svg', 'bmp', 'ico'].includes(ext)
      ? ext.replace('jpeg', 'jpg')
      : '';
  } catch {
    return '';
  }
}

function guessExtension(contentType, url) {
  const cleanType = String(contentType || '').split(';')[0].trim().toLowerCase();
  return IMAGE_EXTENSION_BY_TYPE[cleanType] || getExtensionFromUrl(url) || '';
}

async function fetchImageBinary(url) {
  const response = await fetchWithTimeout(url, {
    redirect: 'follow',
    headers: {
      'User-Agent': 'Mozilla/5.0 AGVN Image Fetcher',
      Accept: 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
    },
  }, 45000);

  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  const contentType = String(response.headers.get('content-type') || '').toLowerCase();
  const buffer = Buffer.from(await response.arrayBuffer());
  return { buffer, contentType, finalUrl: response.url || url };
}

async function fetchImageFromAnySupportedSource(sourceUrl) {
  const normalized = toCdnUrl(sourceUrl);
  const driveId = extractGoogleDriveFileId(normalized);
  const candidates = driveId
    ? [
        `https://drive.google.com/uc?export=download&id=${driveId}`,
        `https://drive.google.com/uc?export=view&id=${driveId}`,
        `https://drive.google.com/thumbnail?id=${driveId}&sz=w2000`,
      ]
    : [normalized];

  const errors = [];
  for (const candidate of candidates) {
    try {
      const result = await fetchImageBinary(candidate);
      const cleanType = result.contentType.split(';')[0].trim().toLowerCase();
      const extension = guessExtension(cleanType, result.finalUrl || candidate);
      if (!cleanType.startsWith('image/') && !extension) {
        throw new Error(`URL không trả về ảnh (${cleanType || 'unknown'})`);
      }
      return { ...result, contentType: cleanType, extension };
    } catch (error) {
      errors.push(`${candidate} => ${error.message}`);
    }
  }
  throw new Error(errors.join(' | '));
}

async function ensureLocalImageAsset(sourceUrl, slug, kind, manifest) {
  const rawInput = normalizeAmpersands(sourceUrl);
  if (!rawInput) return '';
  if (rawInput.startsWith('data:image/')) return rawInput;
  if (rawInput.startsWith('/assets/generated-images/')) return rawInput;
  if (rawInput.startsWith('assets/generated-images/')) return `/${rawInput}`;

  const normalizedSourceUrl = toCdnUrl(rawInput);
  if (!/^https?:\/\//i.test(normalizedSourceUrl)) return normalizedSourceUrl;

  ensureDirSync(GENERATED_IMAGE_DIR);
  const safeKind = sanitizeFilePart(kind || 'image');
  const safeSlug = sanitizeFilePart(slug || 'image');
  const manifestKey = `${safeKind}:${safeSlug}`;
  const existing = manifest.items[manifestKey];

  if (
    existing?.sourceUrl === normalizedSourceUrl &&
    existing.localPath &&
    fileExists(path.join(__dirname, existing.localPath))
  ) {
    return existing.webPath;
  }

  const fetched = await fetchImageFromAnySupportedSource(normalizedSourceUrl);
  const extension = fetched.extension || 'jpg';
  const fileName = `${safeKind}-${safeSlug}.${extension}`;
  const relativeLocalPath = path.posix.join('assets', 'generated-images', fileName);
  const absoluteLocalPath = path.join(__dirname, relativeLocalPath);
  const webPath = `${GENERATED_IMAGE_WEB_PREFIX}/${fileName}`;

  if (existing?.localPath && existing.localPath !== relativeLocalPath) {
    const oldPath = path.join(__dirname, existing.localPath);
    if (fileExists(oldPath)) fs.unlinkSync(oldPath);
  }

  fs.writeFileSync(absoluteLocalPath, fetched.buffer);
  manifest.items[manifestKey] = {
    kind: safeKind,
    slug: safeSlug,
    sourceUrl: normalizedSourceUrl,
    webPath,
    localPath: relativeLocalPath,
    contentType: fetched.contentType || '',
    updatedAt: new Date().toISOString(),
  };
  return webPath;
}

async function buildProducts(manifest) {
  console.log('\n📦 Đang lấy dữ liệu sản phẩm từ Google Sheet...');
  const products = await fetchSheetRowsAuto({
    sheetId: SHEET_ID,
    preferredGid: PRODUCT_SHEET_GID,
    preferredNames: PRODUCT_SHEET_NAMES,
    requiredFields: PRODUCT_REQUIRED_FIELDS,
    label: 'Sản phẩm',
  });
  if (products.length === 0) {
    console.warn('⚠️ Sheet sản phẩm không có dữ liệu. Giữ nguyên các file hiện tại.');
    return 0;
  }

  const templatePath = path.join(__dirname, 'product_template.html');
  const outputDir = path.join(__dirname, 'san-pham');
  if (!fileExists(templatePath)) throw new Error('Không tìm thấy product_template.html');
  ensureDirSync(outputDir);

  const template = cdnizeHtml(fs.readFileSync(templatePath, 'utf8'));
  let generated = 0;

  for (const product of products) {
    const slug = extractSlug(getRowValue(product, ['Slug']));
    const name = getRowValue(product, ['ProductName', 'Product Name', 'Tên sản phẩm', 'Ten san pham']);
    const originalImg = getRowValue(product, ['ImageURL', 'Image URL', 'Hình ảnh', 'Hinh anh']);
    const tag = getRowValue(product, ['ProductTag', 'Product Tag', 'Danh mục', 'Danh muc']) || 'Nông Nghiệp';
    const description = getRowValue(product, ['Description', 'Mô tả', 'Mo ta']);
    if (!slug) continue;

    console.log(`→ Sản phẩm: ${name || 'Không tên'} (${slug})`);
    let image = '';
    try {
      image = await ensureLocalImageAsset(originalImg, slug, 'product', manifest);
    } catch (error) {
      console.warn(`  ⚠️ Không tải được ảnh ${slug}; dùng URL gốc. ${error.message}`);
      image = toCdnUrl(originalImg);
    }

    const html = template
      .replaceAll('{{ProductName}}', name)
      .replaceAll('{{ImageURL}}', image || TRANSPARENT_PLACEHOLDER)
      .replaceAll('{{ProductTag}}', tag)
      .replaceAll('{{Description}}', cdnizeHtml(description).replace(/\r?\n/g, '<br>'));

    fs.writeFileSync(path.join(outputDir, `${slug}.html`), html, 'utf8');
    generated += 1;
  }

  console.log(`✅ Đã tạo/cập nhật ${generated} trang sản phẩm.`);
  return generated;
}

async function buildNews(manifest) {
  console.log('\n📰 Đang lấy dữ liệu tin tức từ Google Sheet...');
  const articles = await fetchSheetRowsAuto({
    sheetId: NEWS_SHEET_ID,
    preferredGid: NEWS_SHEET_GID,
    preferredNames: NEWS_SHEET_NAMES,
    requiredFields: NEWS_REQUIRED_FIELDS,
    label: 'Tin tức',
  });
  if (articles.length === 0) {
    console.warn('⚠️ Sheet tin tức không có dữ liệu. Giữ nguyên các file hiện tại.');
    return 0;
  }

  const detailTemplatePath = path.join(__dirname, 'news_template.html');
  const listOutputPath = path.join(__dirname, 'tintuc.html');
  const dedicatedListTemplate = path.join(__dirname, 'tintuc_template.html');
  const listTemplatePath = fileExists(dedicatedListTemplate) ? dedicatedListTemplate : listOutputPath;
  const outputDir = path.join(__dirname, 'tin-tuc');

  if (!fileExists(detailTemplatePath)) throw new Error('Không tìm thấy news_template.html');
  if (!fileExists(listTemplatePath)) throw new Error('Không tìm thấy tintuc_template.html hoặc tintuc.html');
  ensureDirSync(outputDir);

  const detailTemplate = cdnizeHtml(fs.readFileSync(detailTemplatePath, 'utf8'));
  const articleData = [];

  for (const article of articles) {
    const date = getRowValue(article, ['Date', 'Ngày', 'Ngay']);
    const title = getRowValue(article, ['Title', 'Tiêu đề', 'Tieu de']);
    const excerpt = getRowValue(article, ['Excerpt', 'Mô tả ngắn', 'Mo ta ngan']);
    const imgUrl = getRowValue(article, ['ImageURL', 'Image URL', 'Hình ảnh', 'Hinh anh']);
    const tag = getRowValue(article, ['Tag', 'Danh mục', 'Danh muc']);
    const author = getRowValue(article, ['Author', 'Tác giả', 'Tac gia']);
    const content = getRowValue(article, ['Content', 'Nội dung', 'Noi dung']);
    const slug = extractSlug(getRowValue(article, ['Slug'])) || toSlug(title);
    if (!title || !slug) continue;

    const tagInfo = TAG_MAP[tag] || { label: tag || 'Tin Tức', color: '#666' };
    let finalImg = '';
    try {
      finalImg = await ensureLocalImageAsset(imgUrl || DEFAULT_NEWS_IMAGE, slug, 'news', manifest);
    } catch (error) {
      console.warn(`  ⚠️ Không tải được ảnh bài ${slug}; dùng URL gốc. ${error.message}`);
      finalImg = toCdnUrl(imgUrl || DEFAULT_NEWS_IMAGE);
    }

    const formattedContent = `<p>${cdnizeHtml(content)
      .replace(/\r?\n\r?\n/g, '</p><p>')
      .replace(/\r?\n/g, '<br>')}</p>`;
    const pageUrl = `https://agvngroup.com/tin-tuc/${slug}.html`;

    const detailHtml = detailTemplate
      .replaceAll('{{Title}}', title)
      .replaceAll('{{Date}}', date)
      .replaceAll('{{Author}}', author)
      .replaceAll('{{TagDisplay}}', tagInfo.label)
      .replaceAll('{{ImageURL}}', finalImg || TRANSPARENT_PLACEHOLDER)
      .replaceAll('{{Content}}', formattedContent)
      .replaceAll('{{ReadTime}}', estimateReadTime(content))
      .replaceAll('{{EncodedURL}}', encodeURIComponent(pageUrl));

    fs.writeFileSync(path.join(outputDir, `${slug}.html`), detailHtml, 'utf8');
    articleData.push({ date, title, excerpt, finalImg, tag, slug, author, tagInfo, encodedTitle: escapeAttr(title) });
    console.log(`  📄 tin-tuc/${slug}.html — ${title}`);
  }

  if (articleData.length === 0) {
    console.warn('⚠️ Không có bài viết hợp lệ. Giữ nguyên tintuc.html.');
    return 0;
  }

  const latest = articleData[articleData.length - 1];
  const latestHtml = `
            <div class="latest-card" data-aos="fade-up">
                <div class="latest-card-img">
                    <img src="${latest.finalImg || TRANSPARENT_PLACEHOLDER}" alt="${latest.encodedTitle}" loading="eager" fetchpriority="high" decoding="async">
                </div>
                <div class="latest-card-body">
                    <span class="latest-tag" style="background:${latest.tagInfo.color};">${latest.tagInfo.label}</span>
                    <h3 class="latest-title">${latest.title}</h3>
                    <p class="latest-excerpt">${latest.excerpt}</p>
                    <div class="latest-meta">
                        <span><i class="fa-regular fa-calendar"></i> ${latest.date}</span>
                        <span><i class="fa-regular fa-user"></i> ${latest.author}</span>
                    </div>
                    <a href="/tin-tuc/${latest.slug}.html" class="latest-readmore">Đọc thêm <i class="fa-solid fa-arrow-right"></i></a>
                </div>
            </div>`;

  const cardsHtml = articleData
    .slice(0, -1)
    .reverse()
    .map((a) => `
                    <article class="news-card" data-category="${escapeAttr(a.tag)}">
                        <div class="news-card-img">
                            <img src="${a.finalImg || TRANSPARENT_PLACEHOLDER}" alt="${a.encodedTitle}" loading="lazy" decoding="async">
                            <span class="news-card-date"><i class="fa-regular fa-calendar"></i> ${a.date}</span>
                            <span class="news-card-tag" style="background:${a.tagInfo.color};">${a.tagInfo.label}</span>
                        </div>
                        <div class="news-card-body">
                            <h3 class="news-card-title">${a.title}</h3>
                            <p class="news-card-excerpt">${a.excerpt}</p>
                            <div class="news-card-meta">
                                <span><i class="fa-regular fa-user"></i> ${a.author}</span>
                                <a href="/tin-tuc/${a.slug}.html" class="news-card-link">Đọc tiếp <i class="fa-solid fa-arrow-right"></i></a>
                            </div>
                        </div>
                    </article>`)
    .join('');

  let listTemplate = cdnizeHtml(fs.readFileSync(listTemplatePath, 'utf8'));
  if (!listTemplate.includes('{{LatestArticle}}') || !listTemplate.includes('{{NewsItems}}')) {
    throw new Error('Template danh sách tin tức thiếu {{LatestArticle}} hoặc {{NewsItems}}');
  }

  listTemplate = listTemplate
    .replace('{{LatestArticle}}', latestHtml)
    .replace('{{NewsItems}}', cardsHtml);
  fs.writeFileSync(listOutputPath, listTemplate, 'utf8');

  console.log(`✅ Đã tạo/cập nhật ${articleData.length} bài viết.`);
  console.log(`✅ Bài mới nhất: "${latest.title}" (dòng cuối sheet).`);
  return articleData.length;
}

async function main() {
  ensureDirSync(GENERATED_IMAGE_DIR);
  const manifest = loadImageManifest();
  const failures = [];

  try {
    await buildProducts(manifest);
  } catch (error) {
    failures.push(`Sản phẩm: ${error.message}`);
    console.error(`❌ Build sản phẩm thất bại: ${error.message}`);
  }

  try {
    await buildNews(manifest);
  } catch (error) {
    failures.push(`Tin tức: ${error.message}`);
    console.error(`❌ Build tin tức thất bại: ${error.message}`);
  }

  saveImageManifest(manifest);

  if (failures.length > 0) {
    console.error('\n❌ Đồng bộ chưa hoàn tất:');
    failures.forEach((failure) => console.error(`- ${failure}`));
    process.exitCode = 1;
    return;
  }

  console.log('\n🎉 Đồng bộ sản phẩm, tin tức và ảnh hoàn tất.');
}

main().catch((error) => {
  console.error('❌ Lỗi nghiêm trọng:', error);
  process.exitCode = 1;
});
