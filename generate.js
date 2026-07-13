const fs = require('fs');
const path = require('path');

// ================================================================
// PHẦN 1: SẢN PHẨM
// ================================================================

const SHEET_ID = '1LFD5TFBzRImhyWDQGoNw8I4aVgaYDZ-H1iwktL5P5-Y';
const API_URL = `https://opensheet.elk.sh/${SHEET_ID}/1`;

// ================================================================
// PHẦN 2: TIN TỨC
// ================================================================

const NEWS_SHEET_ID = '1H5CENOofHF7mZ_A-kq2nue1Y6eVeJBm6RS2RrMjb6Lc';
const NEWS_API_URL = `https://opensheet.elk.sh/${NEWS_SHEET_ID}/1`;

// ================================================================
// CẤU HÌNH ẢNH TỰ ĐỘNG TẢI VỀ REPO
// ================================================================

const GENERATED_IMAGE_DIR = path.join(__dirname, 'assets', 'generated-images');
const GENERATED_IMAGE_WEB_PREFIX = '/assets/generated-images';
const IMAGE_MANIFEST_PATH = path.join(GENERATED_IMAGE_DIR, 'manifest.json');

const TRANSPARENT_PLACEHOLDER =
  'data:image/svg+xml;charset=UTF-8,' +
  encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 9"></svg>');

const DEFAULT_NEWS_IMAGE = 'https://cdn.jsdelivr.net/gh/trinkse61538/AGVN@main/images/bonglua.png';

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
  'kienthuc':  { label: 'Kiến Thức',  color: '#007A33' },
  'kythuat':   { label: 'Kỹ Thuật',   color: '#FFB81C' },
  'thanhcong': { label: 'Thành Công', color: '#FF4D4D' },
  'sanpham':   { label: 'Sản Phẩm',   color: '#00A896' },
  'hoatdong':  { label: 'Hoạt Động',  color: '#8DC63F' },
};

function ensureDirSync(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

function fileExists(filePath) {
  try {
    return fs.existsSync(filePath);
  } catch {
    return false;
  }
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

    // raw.githubusercontent.com => jsDelivr
    if (parsed.hostname === 'raw.githubusercontent.com' && parts.length >= 4) {
      const owner = parts[0];
      const repo = parts[1];
      const ref = parts[2];
      const filePath = parts.slice(3).join('/');
      return `https://cdn.jsdelivr.net/gh/${owner}/${repo}@${ref}/${filePath}`;
    }

    // github.com/{owner}/{repo}/blob/{ref}/{path} => jsDelivr
    if (parsed.hostname === 'github.com' && parts.length >= 5 && parts[2] === 'blob') {
      const owner = parts[0];
      const repo = parts[1];
      const ref = parts[3];
      const filePath = parts.slice(4).join('/');
      return `https://cdn.jsdelivr.net/gh/${owner}/${repo}@${ref}/${filePath}`;
    }

    return cleanUrl;
  } catch {
    return cleanUrl;
  }
}

function cdnizeHtml(input) {
  if (!input || typeof input !== 'string') return input || '';

  let output = input.replace(/https:\/\/raw\.githubusercontent\.com\/[^\s"'<>]+/g, (match) => toCdnUrl(match));
  output = output.replace(/https:\/\/github\.com\/[^\s"'<>]+\/blob\/[^\s"'<>]+/g, (match) => toCdnUrl(match));
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

  let cleanUrl = String(fullUrl).trim();

  if (cleanUrl.toLowerCase().endsWith('.html')) {
    cleanUrl = cleanUrl.substring(0, cleanUrl.length - 5);
  }

  const parts = cleanUrl.split('/');
  let slug = parts[parts.length - 1] || '';
  slug = slug.replace(/[^a-zA-Z0-9-_]/g, '');
  return slug;
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
  if (!content) return '1';
  const cleanText = String(content).replace(/<[^>]*>/g, '');
  const charCount = cleanText.length;
  const minutes = Math.max(1, Math.round(charCount / 500));
  return String(minutes);
}

function loadImageManifest() {
  ensureDirSync(GENERATED_IMAGE_DIR);

  if (!fileExists(IMAGE_MANIFEST_PATH)) {
    return { items: {} };
  }

  try {
    const raw = fs.readFileSync(IMAGE_MANIFEST_PATH, 'utf8');
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object' || typeof parsed.items !== 'object') {
      return { items: {} };
    }
    return parsed;
  } catch {
    return { items: {} };
  }
}

function saveImageManifest(manifest) {
  ensureDirSync(GENERATED_IMAGE_DIR);
  fs.writeFileSync(IMAGE_MANIFEST_PATH, JSON.stringify(manifest, null, 2), 'utf8');
}

function extractGoogleDriveFileId(input) {
  const url = normalizeAmpersands(input);
  if (!url) return '';

  const patterns = [
    /drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)/i,
    /drive\.google\.com\/open\?.*?[?&]id=([a-zA-Z0-9_-]+)/i,
    /drive\.google\.com\/uc\?.*?[?&]id=([a-zA-Z0-9_-]+)/i,
    /drive\.google\.com\/thumbnail\?.*?[?&]id=([a-zA-Z0-9_-]+)/i,
    /[?&]id=([a-zA-Z0-9_-]+)/i,
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match && match[1]) return match[1];
  }

  return '';
}

function isLocalGeneratedImageUrl(input) {
  const value = String(input || '').trim();
  return value.startsWith('/assets/generated-images/') || value.startsWith('assets/generated-images/');
}

function normalizeLocalGeneratedImageUrl(input) {
  const value = String(input || '').trim();
  if (value.startsWith('/')) return value;
  return '/' + value.replace(/^\/+/, '');
}

function getExtensionFromUrl(url) {
  try {
    const parsed = new URL(url);
    const pathname = decodeURIComponent(parsed.pathname || '').toLowerCase();
    const match = pathname.match(/\.([a-z0-9]{2,5})$/i);
    if (!match) return '';
    const ext = match[1].toLowerCase();
    if (['jpg', 'jpeg', 'png', 'webp', 'gif', 'avif', 'svg', 'bmp', 'ico'].includes(ext)) {
      return ext === 'jpeg' ? 'jpg' : ext;
    }
    return '';
  } catch {
    return '';
  }
}

function guessExtension({ contentType = '', url = '' }) {
  const cleanType = String(contentType).split(';')[0].trim().toLowerCase();
  if (IMAGE_EXTENSION_BY_TYPE[cleanType]) {
    return IMAGE_EXTENSION_BY_TYPE[cleanType];
  }

  const extFromUrl = getExtensionFromUrl(url);
  if (extFromUrl) return extFromUrl;

  return '';
}

function buildGoogleDriveCandidateUrls(fileId) {
  return [
    `https://drive.google.com/uc?export=download&id=${fileId}`,
    `https://drive.google.com/uc?export=view&id=${fileId}`,
    `https://drive.google.com/thumbnail?id=${fileId}&sz=w2000`,
  ];
}

async function fetchImageBinary(url) {
  const response = await fetch(url, {
    redirect: 'follow',
    headers: {
      'User-Agent': 'Mozilla/5.0 AGVN Image Fetcher',
      'Accept': 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
    },
  });

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }

  const contentType = String(response.headers.get('content-type') || '').toLowerCase();
  const buffer = Buffer.from(await response.arrayBuffer());

  return {
    buffer,
    contentType,
    finalUrl: response.url || url,
  };
}

async function fetchImageFromAnySupportedSource(sourceUrl) {
  const normalized = toCdnUrl(sourceUrl);
  const driveFileId = extractGoogleDriveFileId(normalized);
  const candidates = driveFileId ? buildGoogleDriveCandidateUrls(driveFileId) : [normalized];

  const errors = [];

  for (const candidate of candidates) {
    try {
      const result = await fetchImageBinary(candidate);
      const cleanType = String(result.contentType || '').split(';')[0].trim().toLowerCase();
      const ext = guessExtension({ contentType: cleanType, url: result.finalUrl || candidate });
      const looksLikeImage = cleanType.startsWith('image/') || Boolean(ext);

      if (!looksLikeImage) {
        throw new Error(`URL không trả về ảnh. Content-Type: ${cleanType || 'unknown'}`);
      }

      return {
        ...result,
        contentType: cleanType,
        extension: ext,
        effectiveUrl: candidate,
      };
    } catch (error) {
      errors.push(`${candidate} => ${error.message}`);
    }
  }

  throw new Error(errors.join(' | '));
}

async function ensureLocalImageAsset(sourceUrl, slug, kind, manifest) {
  const rawInput = normalizeAmpersands(sourceUrl);

  if (!rawInput) return '';

  if (rawInput.startsWith('data:image/')) {
    return rawInput;
  }

  if (isLocalGeneratedImageUrl(rawInput)) {
    return normalizeLocalGeneratedImageUrl(rawInput);
  }

  const normalizedSourceUrl = toCdnUrl(rawInput);
  if (!/^https?:\/\//i.test(normalizedSourceUrl)) {
    return normalizedSourceUrl;
  }

  ensureDirSync(GENERATED_IMAGE_DIR);

  const safeKind = sanitizeFilePart(kind || 'image');
  const safeSlug = sanitizeFilePart(slug || 'image');
  const manifestKey = `${safeKind}:${safeSlug}`;
  const existing = manifest.items[manifestKey];

  if (
    existing &&
    existing.sourceUrl === normalizedSourceUrl &&
    existing.localPath &&
    fileExists(path.join(__dirname, existing.localPath))
  ) {
    return existing.webPath;
  }

  const fetched = await fetchImageFromAnySupportedSource(normalizedSourceUrl);
  const extension = fetched.extension || 'jpg';
  const fileBaseName = `${safeKind}-${safeSlug}`;
  const fileName = `${fileBaseName}.${extension}`;
  const relativeLocalPath = path.posix.join('assets', 'generated-images', fileName);
  const absoluteLocalPath = path.join(__dirname, relativeLocalPath);
  const webPath = `${GENERATED_IMAGE_WEB_PREFIX}/${fileName}`;

  // Xóa file cũ nếu đổi extension hoặc đổi tên
  if (existing && existing.localPath && existing.localPath !== relativeLocalPath) {
    const oldAbsolutePath = path.join(__dirname, existing.localPath);
    if (fileExists(oldAbsolutePath)) {
      fs.unlinkSync(oldAbsolutePath);
    }
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

// ================================================================
// BUILD PRODUCTS
// ================================================================

async function buildProducts(manifest) {
  try {
    console.log('📦 Đang lấy dữ liệu sản phẩm từ Google Sheet...');
    const response = await fetch(API_URL);

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Không thể kết nối API Opensheet: ${response.status} - ${errorText}`);
    }

    const products = await response.json();

    if (!Array.isArray(products) || products.length === 0) {
      console.log('⚠️ Không tìm thấy dòng dữ liệu sản phẩm nào hợp lệ từ Google Sheet.');
      return;
    }

    const templatePath = path.join(__dirname, 'product_template.html');
    const outputDir = path.join(__dirname, 'san-pham');

    ensureDirSync(outputDir);

    if (!fs.existsSync(templatePath)) {
      console.error('❌ Không tìm thấy file product_template.html ở thư mục gốc.');
      return;
    }

    const templateContent = cdnizeHtml(fs.readFileSync(templatePath, 'utf8'));

    for (const product of products) {
      const rawSlug = product['Slug'] || product['slug'];
      const finalSlug = extractSlug(rawSlug);
      const name = product['ProductName'] || product['productname'] || product['Product Name'];
      const originalImg = product['ImageURL'] || product['imageurl'] || product['Image URL'] || '';
      const tag = product['ProductTag'] || product['producttag'] || product['Product Tag'];
      const desc = product['Description'] || product['description'];

      if (!finalSlug) continue;

      console.log(`→ Đang xử lý sản phẩm: ${name || 'Không tên'} (${finalSlug})`);

      let img = '';
      try {
        img = await ensureLocalImageAsset(originalImg, finalSlug, 'product', manifest);
      } catch (error) {
        console.warn(`  ⚠️ Không tải được ảnh cho sản phẩm ${finalSlug}. Dùng URL gốc/CDN. Chi tiết: ${error.message}`);
        img = toCdnUrl(originalImg);
      }

      const formattedDescription = cdnizeHtml(desc || '').replace(/\r?\n/g, '<br>');

      const htmlContent = templateContent
        .replaceAll('{{ProductName}}', name || '')
        .replaceAll('{{ImageURL}}', img || TRANSPARENT_PLACEHOLDER)
        .replaceAll('{{ProductTag}}', tag || 'Nông Nghiệp')
        .replaceAll('{{Description}}', formattedDescription);

      const outputPath = path.join(outputDir, `${finalSlug}.html`);
      fs.writeFileSync(outputPath, htmlContent, 'utf8');
    }

    console.log('✅ Đã xử lý sản phẩm thành công.');
  } catch (error) {
    console.error('❌ Đã xảy ra lỗi trong quá trình build sản phẩm:', error);
    process.exit(1);
  }
}

// ================================================================
// BUILD NEWS
// ================================================================

async function buildNews(manifest) {
  if (NEWS_SHEET_ID === 'YOUR_NEWS_SHEET_ID_HERE') {
    console.log('⏩ Bỏ qua tin tức: chưa có NEWS_SHEET_ID.');
    return;
  }

  try {
    console.log('\n📰 Đang lấy dữ liệu tin tức từ Google Sheet...');
    const response = await fetch(NEWS_API_URL);

    if (!response.ok) {
      throw new Error(`Không thể kết nối API tin tức: ${response.status}`);
    }

    const articles = await response.json();
    if (!Array.isArray(articles) || articles.length === 0) {
      console.log('⚠️ Không tìm thấy tin tức từ sheet.');
      return;
    }

    const newsDetailTemplatePath = path.join(__dirname, 'news_template.html');
    const newsListTemplatePath = path.join(__dirname, 'tintuc.html');
    const newsListSourceTemplatePath = fs.existsSync(path.join(__dirname, 'tintuc_template.html'))
      ? path.join(__dirname, 'tintuc_template.html')
      : newsListTemplatePath;
    const newsOutputDir = path.join(__dirname, 'tin-tuc');

    ensureDirSync(newsOutputDir);

    if (!fs.existsSync(newsDetailTemplatePath)) {
      console.error('❌ Không tìm thấy news_template.html');
      return;
    }
    if (!fs.existsSync(newsListSourceTemplatePath)) {
      console.error('❌ Không tìm thấy tintuc.html hoặc tintuc_template.html');
      return;
    }

    const detailTemplate = cdnizeHtml(fs.readFileSync(newsDetailTemplatePath, 'utf8'));
    let articleData = [];

    for (const article of articles) {
      const date = (article['Date'] || '').trim();
      const title = (article['Title'] || '').trim();
      const excerpt = (article['Excerpt'] || '').trim();
      const imgUrl = (article['ImageURL'] || '').trim();
      const tag = (article['Tag'] || '').trim();
      const author = (article['Author'] || '').trim();
      const content = (article['Content'] || '').trim();

      const rawSlug = (article['Slug'] || article['slug'] || '').trim();
      const slug = extractSlug(rawSlug) || toSlug(title);

      if (!title || !slug) continue;

      const tagInfo = TAG_MAP[tag] || { label: tag || 'Tin Tức', color: '#666' };
      const readTime = estimateReadTime(content);
      const encodedTitle = escapeAttr(title);

      let finalImg = '';
      try {
        finalImg = await ensureLocalImageAsset(imgUrl || DEFAULT_NEWS_IMAGE, slug, 'news', manifest);
      } catch (error) {
        console.warn(`  ⚠️ Không tải được ảnh cho bài viết ${slug}. Dùng URL gốc/CDN. Chi tiết: ${error.message}`);
        finalImg = toCdnUrl(imgUrl || DEFAULT_NEWS_IMAGE);
      }

      let formattedContent = cdnizeHtml(content)
        .replace(/\r?\n\r?\n/g, '</p><p>')
        .replace(/\r?\n/g, '<br>');
      formattedContent = '<p>' + formattedContent + '</p>';

      const pageUrl = `https://agvngroup.com/tin-tuc/${slug}.html`;
      const encodedUrl = encodeURIComponent(pageUrl);

      const detailHtml = detailTemplate
        .replaceAll('{{Title}}', title)
        .replaceAll('{{Date}}', date)
        .replaceAll('{{Author}}', author)
        .replaceAll('{{TagDisplay}}', tagInfo.label)
        .replaceAll('{{ImageURL}}', finalImg || TRANSPARENT_PLACEHOLDER)
        .replaceAll('{{Content}}', formattedContent)
        .replaceAll('{{ReadTime}}', readTime)
        .replaceAll('{{EncodedURL}}', encodedUrl);

      const detailPath = path.join(newsOutputDir, `${slug}.html`);
      fs.writeFileSync(detailPath, detailHtml, 'utf8');
      console.log(`  📄 Đã tạo: tin-tuc/${slug}.html — ${title}`);

      articleData.push({ date, title, excerpt, finalImg, tag, slug, author, tagInfo, encodedTitle });
    }

    const totalArticles = articleData.length;
    if (totalArticles === 0) {
      console.log('⚠️ Không có bài viết hợp lệ để hiển thị.');
      return;
    }

    const latest = articleData[totalArticles - 1];
    const latestHtml = `
            <div class="latest-card" data-aos="fade-up">
                <div class="latest-card-img">
                    <img src="${latest.finalImg}" alt="${latest.encodedTitle}" loading="eager" fetchpriority="high" decoding="async">
                </div>
                <div class="latest-card-body">
                    <span class="latest-tag" style="background:${latest.tagInfo.color};">${latest.tagInfo.label}</span>
                    <h3 class="latest-title">${latest.title}</h3>
                    <p class="latest-excerpt">${latest.excerpt}</p>
                    <div class="latest-meta">
                        <span><i class="fa-regular fa-calendar"></i> ${latest.date}</span>
                        <span><i class="fa-regular fa-user"></i> ${latest.author}</span>
                    </div>
                    <a href="/tin-tuc/${latest.slug}.html" class="latest-readmore">
                        Đọc thêm <i class="fa-solid fa-arrow-right"></i>
                    </a>
                </div>
            </div>`;

    const gridArticles = articleData.slice(0, -1).reverse();
    let cardsHtml = '';
    for (const a of gridArticles) {
      cardsHtml += `
                    <article class="news-card" data-category="${a.tag}">
                        <div class="news-card-img">
                            <img src="${a.finalImg}" alt="${a.encodedTitle}" loading="lazy" decoding="async">
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
                    </article>`;
    }

    let listTemplate = cdnizeHtml(fs.readFileSync(newsListSourceTemplatePath, 'utf8'));
    let modified = false;

    if (listTemplate.includes('{{LatestArticle}}')) {
      listTemplate = listTemplate.replace('{{LatestArticle}}', latestHtml);
      modified = true;
    }

    if (listTemplate.includes('{{NewsItems}}')) {
      listTemplate = listTemplate.replace('{{NewsItems}}', cardsHtml);
      modified = true;
    }

    if (modified) {
      fs.writeFileSync(newsListTemplatePath, listTemplate, 'utf8');
      console.log(`\n✅ Đã sinh ${totalArticles} bài viết chi tiết vào thư mục tin-tuc/`);
      console.log(`✅ Bài mới nhất: "${latest.title}" (dòng cuối sheet)`);
      console.log(`✅ Cập nhật ${gridArticles.length} card vào grid tintuc.html`);
    } else {
      console.log('⚠️ Không tìm thấy {{LatestArticle}} hoặc {{NewsItems}} trong template danh sách tin tức.');
    }
  } catch (error) {
    console.error('❌ Lỗi khi xử lý tin tức:', error.message);
  }
}

// ================================================================
// MAIN
// ================================================================

async function main() {
  ensureDirSync(GENERATED_IMAGE_DIR);
  const manifest = loadImageManifest();

  await buildProducts(manifest);
  await buildNews(manifest);

  saveImageManifest(manifest);

  console.log('\n🎉 Hoàn tất! Sản phẩm, tin tức và ảnh nội bộ đã được cập nhật.');
}

main().catch((error) => {
  console.error('❌ Lỗi không mong muốn:', error);
  process.exit(1);
});
