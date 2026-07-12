const fs = require('fs');
const path = require('path');

// ================================================================
// PHẦN 1: SẢN PHẨM (giữ nguyên code cũ)
// ================================================================

// ID Google Sheet sản phẩm (giữ nguyên)
const SHEET_ID = '1LFD5TFBzRImhyWDQGoNw8I4aVgaYDZ-H1iwktL5P5-Y';
const API_URL = `https://opensheet.elk.sh/${SHEET_ID}/1`; 

// ================================================================
// HELPER: CDN + lazy-safe image URLs
// ================================================================

// ================================================================
// WEBP MAP: giữ ảnh sản phẩm tối ưu sau mỗi lần chạy generator
// ================================================================
const PRODUCT_WEBP_BY_SLUG = Object.freeze({
  "anwn-zn-an-do": "https://agvngroup.com/AGVN_webp_image/ThuocTruBenh/ANWIN%20ZN%20A%23U0302%23U0301N%20%23U0110O%23U0323%23U0302%201L%20catalouge.webp",
  "bo-huc-vang": "https://agvngroup.com/AGVN_webp_image/ThuocTruSau/Bo%23U0300%20hu%23U0301c%20va%23U0300ng%20%28aa%20faros%29%20AGVN%20300ml%20catalog.webp",
  "bosimax": "https://agvngroup.com/AGVN_webp_image/PhanBon/bosimax%20%28sie%23U0302u%20lu%23U0300n%29%20catalouge.webp",
  "dac-tri-dao-on": "https://agvngroup.com/AGVN_webp_image/ThuocTruBenh/%23U0110A%23U0323%23U0306C%20TRI%23U0323%20%23U0110A%23U0323O%20O%23U0302N%20catalouge.webp",
  "dao-on-promax": "https://agvngroup.com/AGVN_webp_image/ThuocTruBenh/AGVN%20%23U0110A%23U0323O%20O%23U0302N%20PROMAX%20%28FENO%20PROMAX%29%20240ML%20catalog.webp",
  "diet-chich-hut": "https://agvngroup.com/AGVN_webp_image/ThuocTruSau/Die%23U0323%23U0302t%20Chi%23U0301ch%20Hu%23U0301t%20catalouge.webp",
  "duong-dong-vang": "https://agvngroup.com/AGVN_webp_image/PhanBon/Du%23U031bo%23U031b%23U0303ng%20%23U0110o%23U0300ng%20Va%23U0300ng%20AGVN%20catalouge.webp",
  "feno-super": "https://agvngroup.com/AGVN_webp_image/ThuocTruBenh/FENO%20SUPER%20400ML%20catalouge.webp",
  "hat-vang": "https://agvngroup.com/AGVN_webp_image/PhanBon/Ha%23U0323t%20Va%23U0300ng%20catalouge.webp",
  "humic-zn": "https://agvngroup.com/AGVN_webp_image/PhanBon/HUMIC%20KE%23U0303M%20AGVN%20%28CATALOG%29.webp",
  "khuan-lanh-king": "https://agvngroup.com/AGVN_webp_image/ThuocTruBenh/KHUA%23U0302%23U0309N%20LA%23U0323NH%20KING%20450ML%20catalouge.webp",
  "kumin-a60": "https://agvngroup.com/AGVN_webp_image/ThuocTruBenh/AGVN%20KUMIN%20A60%20%28KASUMIRA%2060SL%29%20catalog.webp",
  "lem-lep": "https://agvngroup.com/AGVN_webp_image/ThuocTruBenh/Lem%20le%23U0301p%20catalog.webp",
  "lun-luc": "https://agvngroup.com/AGVN_webp_image/ThuocDieuHoaSinhTruong/LU%23U0300N%20LU%23U031b%23U0323C%20CATALOG.webp",
  "number-one": "https://agvngroup.com/AGVN_webp_image/ThuocDieuHoaSinhTruong/NUMBER%20ONE%20%28AGVN%29%20catalog.webp",
  "pico-plus-300": "https://agvngroup.com/AGVN_webp_image/ThuocTruBenh/AGVN%20PICOPLUS%20300%20%28AA%20YAKI%29%20240ML%20catalog.webp",
  "sach-nam-khuan": "https://agvngroup.com/AGVN_webp_image/ThuocTruBenh/SA%23U0323CH%20NA%23U0302%23U0301M%20KHUA%23U0302%23U0309N%20%28AGVN%29%20catalog.webp",
  "sieu-re-no-bui": "https://agvngroup.com/AGVN_webp_image/PhanBon/Sie%23U0302u%20Re%23U0302%23U0303%20No%23U031b%23U0309%20Bu%23U0323i%20catalouge.webp",
  "silic-k": "https://agvngroup.com/AGVN_webp_image/PhanBon/SILIC%20K%2B%2B%20CATALOG.webp",
  "supercol-692": "https://agvngroup.com/AGVN_webp_image/ThuocTruBenh/SUPERCOL%20%28AGVN%29%20catalog.webp",
  "vang-la": "https://agvngroup.com/AGVN_webp_image/ThuocTruBenh/Va%23U0300ng%20la%23U0301%20catalouge.webp",
  "xong-hoi-b52": "https://agvngroup.com/AGVN_webp_image/ThuocTruSau/XO%23U0302NG%20HO%23U031bI%20B52%20CATALOUGE.webp",
});

function getProductImageUrl(slug, originalUrl) {
  const normalizedSlug = String(slug || '').trim().toLowerCase();
  return PRODUCT_WEBP_BY_SLUG[normalizedSlug] || toCdnUrl(originalUrl || '');
}

const TRANSPARENT_PLACEHOLDER =
  'data:image/svg+xml;charset=UTF-8,' +
  encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 9"></svg>');

/**
 * Chuyển link GitHub Raw sang jsDelivr CDN để giảm lỗi 429.
 * Hỗ trợ dạng:
 * https://raw.githubusercontent.com/{owner}/{repo}/{branch}/{path}
 * =>
 * https://cdn.jsdelivr.net/gh/{owner}/{repo}@{branch}/{path}
 */
function toCdnUrl(url) {
  if (!url || typeof url !== 'string') return '';

  const cleanUrl = url.trim();
  if (!cleanUrl) return '';

  if (!cleanUrl.includes('raw.githubusercontent.com')) {
    return cleanUrl;
  }

  try {
    const parsed = new URL(cleanUrl);
    const parts = parsed.pathname.split('/').filter(Boolean);

    if (parsed.hostname !== 'raw.githubusercontent.com' || parts.length < 4) {
      return cleanUrl;
    }

    const owner = parts[0];
    const repo = parts[1];
    const ref = parts[2];
    const filePath = parts.slice(3).join('/');

    return `https://cdn.jsdelivr.net/gh/${owner}/${repo}@${ref}/${filePath}${parsed.search || ''}`;
  } catch (error) {
    return cleanUrl;
  }
}

/**
 * CDN hóa toàn bộ raw.githubusercontent.com xuất hiện trong HTML/CSS/text.
 * Dùng cho template, description và content bài viết.
 */
function cdnizeHtml(input) {
  if (!input || typeof input !== 'string') return input || '';

  return input.replace(/https:\/\/raw\.githubusercontent\.com\/[^\s"'<>]+/g, (match) => toCdnUrl(match));
}

/**
 * Escape nội dung dùng trong HTML attribute.
 */
function escapeAttr(value) {
  return String(value || '')
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}


// Hàm hỗ trợ bóc tách lấy tên file từ Full URL
function extractSlug(fullUrl) {
  if (!fullUrl) return '';
  
  // Xóa khoảng trắng thừa ở 2 đầu
  let cleanUrl = fullUrl.trim();
  
  // Loại bỏ phần đuôi .html nếu có để xử lý đồng bộ
  if (cleanUrl.toLowerCase().endsWith('.html')) {
    cleanUrl = cleanUrl.substring(0, cleanUrl.length - 5);
  }
  
  // Tách chuỗi theo dấu "/" và lấy phần tử cuối cùng
  const parts = cleanUrl.split('/');
  let slug = parts[parts.length - 1];
  
  // Loại bỏ các ký tự đặc biệt nếu user lỡ tay nhập vào
  slug = slug.replace(/[^a-zA-Z0-9-_]/g, '');
  
  return slug;
}

async function buildProducts() {
  try {
    console.log('Đang lấy dữ liệu từ Google Sheet...');
    const response = await fetch(API_URL);
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Không thể kết nối API Opensheet: ${response.status} - ${errorText}`);
    }
    
    const products = await response.json();

    if (!Array.isArray(products) || products.length === 0) {
      console.log("Cảnh báo: Không tìm thấy dòng dữ liệu nào hợp lệ từ Google Sheet.");
      return;
    }

    const templatePath = path.join(__dirname, 'product_template.html');
    const outputDir = path.join(__dirname, 'san-pham');

    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    if (!fs.existsSync(templatePath)) {
      console.error('Lỗi: Không tìm thấy file product_template.html ở thư mục gốc.');
      return;
    }

    const templateContent = cdnizeHtml(fs.readFileSync(templatePath, 'utf8'));

    products.forEach(product => {
      // Đọc giá trị từ cột Slug (Dù là link full hay chữ thường)
      const rawSlug = product['Slug'] || product['slug'];
      
      // Xử lý bóc tách để lấy đúng tên file (Ví dụ: "sp1000")
      const finalSlug = extractSlug(rawSlug);
      
      const name = product['ProductName'] || product['productname'] || product['Product Name'];
      const img = getProductImageUrl(finalSlug, product['ImageURL'] || product['imageurl'] || product['Image URL'] || '');
      const tag = product['ProductTag'] || product['producttag'] || product['Product Tag'];
      const desc = product['Description'] || product['description'];

      // Bỏ qua nếu dòng đó không có thông tin định danh file
      if (!finalSlug) return;

      console.log(`Đang xử lý sản phẩm: ${name || 'Không tên'} -> tạo file: san-pham/${finalSlug}.html`);

      // Tự động chuyển đổi các dấu xuống dòng trong Google Sheet thành thẻ <br> trong HTML
      const formattedDescription = cdnizeHtml(desc || '').replace(/\r?\n/g, '<br>');

      let htmlContent = templateContent
        .replaceAll('{{ProductName}}', name || '')
        .replaceAll('{{ImageURL}}', img || '')
        .replaceAll('{{ProductTag}}', tag || 'Nông Nghiệp')
        .replaceAll('{{Description}}', formattedDescription); // Sử dụng nội dung đã xử lý xuống dòng

      // Tạo file vật lý dạng: san-pham/sp1000.html
      const outputPath = path.join(outputDir, `${finalSlug}.html`);
      fs.writeFileSync(outputPath, htmlContent, 'utf8');
    });

    console.log('Chúc mừng! Đã xử lý link URL và sinh file sản phẩm thành công.');

  } catch (error) {
    console.error('Đã xảy ra lỗi trong quá trình build:', error);
    process.exit(1);
  }
}

// ================================================================
// PHẦN 2: TIN TỨC (thêm mới, không ảnh hưởng phần 1)
// ================================================================

// ID Google Sheet tin tức (anh Trí điền sau khi tạo sheet)
const NEWS_SHEET_ID = '1H5CENOofHF7mZ_A-kq2nue1Y6eVeJBm6RS2RrMjb6Lc';
const NEWS_API_URL = `https://opensheet.elk.sh/${NEWS_SHEET_ID}/1`;

// Map tag value → tên hiển thị + màu sắc
const TAG_MAP = {
  'kienthuc':  { label: 'Kiến Thức',  color: '#007A33' },
  'kythuat':   { label: 'Kỹ Thuật',   color: '#FFB81C' },
  'thanhcong': { label: 'Thành Công', color: '#FF4D4D' },
  'sanpham':   { label: 'Sản Phẩm',   color: '#00A896' },
  'hoatdong':  { label: 'Hoạt Động',  color: '#8DC63F' },
};

// Hàm chuyển tiếng Việt thành slug không dấu
function toSlug(text) {
  if (!text) return '';
  const map = {
    'à':'a','á':'a','ả':'a','ã':'a','ạ':'a','ă':'a','ắ':'a','ằ':'a','ẳ':'a','ẵ':'a','ặ':'a','â':'a','ấ':'a','ầ':'a','ẩ':'a','ẫ':'a','ậ':'a',
    'đ':'d',
    'è':'e','é':'e','ẻ':'e','ẽ':'e','ẹ':'e','ê':'e','ế':'e','ề':'e','ể':'e','ễ':'e','ệ':'e',
    'ì':'i','í':'i','ỉ':'i','ĩ':'i','ị':'i',
    'ò':'o','ó':'o','ỏ':'o','õ':'o','ọ':'o','ô':'o','ố':'o','ồ':'o','ổ':'o','ỗ':'o','ộ':'o','ơ':'o','ớ':'o','ờ':'o','ở':'o','ỡ':'o','ợ':'o',
    'ù':'u','ú':'u','ủ':'u','ũ':'u','ụ':'u','ư':'u','ứ':'u','ừ':'u','ử':'u','ữ':'u','ự':'u',
    'ỳ':'y','ý':'y','ỷ':'y','ỹ':'y','ỵ':'y',
    'À':'a','Á':'a','Ả':'a','Ã':'a','Ạ':'a','Ă':'a','Ắ':'a','Ằ':'a','Ẳ':'a','Ẵ':'a','Ặ':'a','Â':'a','Ấ':'a','Ầ':'a','Ẩ':'a','Ẫ':'a','Ậ':'a',
    'Đ':'d',
    'È':'e','É':'e','Ẻ':'e','Ẽ':'e','Ẹ':'e','Ê':'e','Ế':'e','Ề':'e','Ể':'e','Ễ':'e','Ệ':'e',
    'Ì':'i','Í':'i','Ỉ':'i','Ĩ':'i','Ị':'i',
    'Ò':'o','Ó':'o','Ỏ':'o','Õ':'o','Ọ':'o','Ô':'o','Ố':'o','Ồ':'o','Ổ':'o','Ỗ':'o','Ộ':'o','Ơ':'o','Ớ':'o','Ờ':'o','Ở':'o','Ỡ':'o','Ợ':'o',
    'Ù':'u','Ú':'u','Ủ':'u','Ũ':'u','Ụ':'u','Ư':'u','Ứ':'u','Ừ':'u','Ử':'u','Ữ':'u','Ự':'u',
    'Ỳ':'y','Ý':'y','Ỷ':'y','Ỹ':'y','Ỵ':'y',
  };
  let slug = text.replace(/[^a-zA-Z0-9À-ỹ\s-]/g, '').trim().toLowerCase();
  slug = slug.replace(/[\s]+/g, '-');
  slug = slug.replace(/[-]+/g, '-');
  slug = slug.replace(/^-+|-+$/g, '');
  // Replace từng ký tự có dấu
  slug = slug.split('').map(c => map[c] || c).join('');
  return slug;
}

// Tính thời gian đọc (khoảng 500 ký tự/phút)
function estimateReadTime(content) {
  if (!content) return '1';
  const cleanText = content.replace(/<[^>]*>/g, '');
  const charCount = cleanText.length;
  const minutes = Math.max(1, Math.round(charCount / 500));
  return String(minutes);
}

async function buildNews() {
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
      console.log('Cảnh báo: Không tìm thấy tin tức từ sheet.');
      return;
    }

    // Đọc template tin tức chi tiết
    const newsDetailTemplatePath = path.join(__dirname, 'news_template.html');
    const newsListTemplatePath = path.join(__dirname, 'tintuc.html');
    const newsListSourceTemplatePath = fs.existsSync(path.join(__dirname, 'tintuc_template.html'))
      ? path.join(__dirname, 'tintuc_template.html')
      : newsListTemplatePath;
    const newsOutputDir = path.join(__dirname, 'tin-tuc');

    // Tạo thư mục tin-tuc/
    if (!fs.existsSync(newsOutputDir)) {
      fs.mkdirSync(newsOutputDir, { recursive: true });
    }

    if (!fs.existsSync(newsDetailTemplatePath)) {
      console.error('❌ Không tìm thấy news_template.html');
      return;
    }
    if (!fs.existsSync(newsListSourceTemplatePath)) {
      console.error('❌ Không tìm thấy tintuc.html hoặc tintuc_template.html');
      return;
    }

    const detailTemplate = cdnizeHtml(fs.readFileSync(newsDetailTemplatePath, 'utf8'));

    // === Bước 1: Xử lý từng bài (sinh trang chi tiết + thu thập dữ liệu) ===
    let articleData = [];  // lưu toàn bộ dữ liệu bài viết để dùng sau

    articles.forEach((article) => {
      const date     = (article['Date']     || '').trim();
      const title    = (article['Title']    || '').trim();
      const excerpt  = (article['Excerpt']  || '').trim();
      const imgUrl   = (article['ImageURL'] || '').trim();
      const tag      = (article['Tag']      || '').trim();
      const author   = (article['Author']   || '').trim();
      const content  = (article['Content']  || '').trim();

      // Slug: ưu tiên cột Slug, nếu không có thì tự sinh từ Title
      const rawSlug = (article['Slug'] || article['slug'] || '').trim();
      const slug = extractSlug(rawSlug) || toSlug(title);

      // Bỏ qua dòng trống
      if (!title || !slug) return;

      const tagInfo  = TAG_MAP[tag] || { label: tag || 'Tin Tức', color: '#666' };
      const finalImg = toCdnUrl(imgUrl || 'https://raw.githubusercontent.com/trinkse61538/AGVN/main/images/bonglua.png');
      const readTime = estimateReadTime(content);
      const encodedTitle = escapeAttr(title);

      // Xử lý Content: giữ nguyên xuống dòng → thẻ <p> hoặc <br>
      let formattedContent = cdnizeHtml(content)
        .replace(/\r?\n\r?\n/g, '</p><p>')
        .replace(/\r?\n/g, '<br>');
      formattedContent = '<p>' + formattedContent + '</p>';

      // === Sinh file chi tiết ===
      const pageUrl = `https://agvngroup.com/tin-tuc/${slug}.html`;
      const encodedUrl = encodeURIComponent(pageUrl);

      let detailHtml = detailTemplate
        .replaceAll('{{Title}}', title)
        .replaceAll('{{Date}}', date)
        .replaceAll('{{Author}}', author)
        .replaceAll('{{TagDisplay}}', tagInfo.label)
        .replaceAll('{{ImageURL}}', finalImg)
        .replaceAll('{{Content}}', formattedContent)
        .replaceAll('{{ReadTime}}', readTime)
        .replaceAll('{{EncodedURL}}', encodedUrl);

      const detailPath = path.join(newsOutputDir, `${slug}.html`);
      fs.writeFileSync(detailPath, detailHtml, 'utf8');
      console.log(`  📄 Đã tạo: tin-tuc/${slug}.html — ${title}`);

      // Lưu dữ liệu để dùng cho danh sách
      articleData.push({ date, title, excerpt, finalImg, tag, slug, author, tagInfo, encodedTitle });
    });

    const totalArticles = articleData.length;
    if (totalArticles === 0) {
      console.log('⚠️ Không có bài viết hợp lệ để hiển thị.');
      return;
    }

    // === Bước 2: Render dữ liệu vào template ===
    // Bài mới nhất = dòng cuối sheet (do người dùng thêm ở cuối)
    const latest = articleData[totalArticles - 1];

    // Card Hero cho bài mới nhất ({{LatestArticle}})
    const latestHtml = `
            <div class="latest-card" data-aos="fade-up">
                <div class="latest-card-img">
                    <img src="${latest.finalImg}" alt="${latest.encodedTitle}" loading="lazy" decoding="async">
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

    // Các bài còn lại (trừ bài mới nhất) → grid, đảo ngược thứ tự (mới nhất lên đầu)
    const gridArticles = articleData.slice(0, -1).reverse();
    let cardsHtml = '';
    gridArticles.forEach((a) => {
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
    });

    // === Bước 3: Ghi template ===
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
      console.log('⚠️ Không tìm thấy {{LatestArticle}} hoặc {{NewsItems}} trong template danh sách tin tức. Nên giữ file tintuc_template.html có 2 placeholder này để generate nhiều lần không bị mất chỗ chèn.');
    }

  } catch (error) {
    console.error('❌ Lỗi khi xử lý tin tức:', error.message);
  }
}

// ================================================================
// HÀM CHÍNH: chạy cả 2 phần
// ================================================================
async function main() {
  await buildProducts();
  await buildNews();
  console.log('\n🎉 Hoàn tất! Cả sản phẩm và tin tức đã được cập nhật.');
}

main();
