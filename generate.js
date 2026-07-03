const fs = require('fs');
const path = require('path');

// ================================================================
// PHẦN 1: SẢN PHẨM (giữ nguyên code cũ)
// ================================================================

// ID Google Sheet sản phẩm (giữ nguyên)
const SHEET_ID = '1LFD5TFBzRImhyWDQGoNw8I4aVgaYDZ-H1iwktL5P5-Y';
const API_URL = `https://opensheet.elk.sh/${SHEET_ID}/1`; 

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

    const templateContent = fs.readFileSync(templatePath, 'utf8');

    products.forEach(product => {
      // Đọc giá trị từ cột Slug (Dù là link full hay chữ thường)
      const rawSlug = product['Slug'] || product['slug'];
      
      // Xử lý bóc tách để lấy đúng tên file (Ví dụ: "sp1000")
      const finalSlug = extractSlug(rawSlug);
      
      const name = product['ProductName'] || product['productname'] || product['Product Name'];
      const img = product['ImageURL'] || product['imageurl'] || product['Image URL'];
      const tag = product['ProductTag'] || product['producttag'] || product['Product Tag'];
      const desc = product['Description'] || product['description'];

      // Bỏ qua nếu dòng đó không có thông tin định danh file
      if (!finalSlug) return;

      console.log(`Đang xử lý sản phẩm: ${name || 'Không tên'} -> tạo file: san-pham/${finalSlug}.html`);

      // Tự động chuyển đổi các dấu xuống dòng trong Google Sheet thành thẻ <br> trong HTML
      const formattedDescription = (desc || '').replace(/\r?\n/g, '<br>');

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
    const newsOutputDir = path.join(__dirname, 'tin-tuc');

    // Tạo thư mục tin-tuc/
    if (!fs.existsSync(newsOutputDir)) {
      fs.mkdirSync(newsOutputDir, { recursive: true });
    }

    if (!fs.existsSync(newsDetailTemplatePath)) {
      console.error('❌ Không tìm thấy news_template.html');
      return;
    }
    if (!fs.existsSync(newsListTemplatePath)) {
      console.error('❌ Không tìm thấy tintuc.html');
      return;
    }

    const detailTemplate = fs.readFileSync(newsDetailTemplatePath, 'utf8');

    // === Bước 1: Sinh trang chi tiết cho từng bài ===
    let cardsHtml = '';
    let articleCount = 0;

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
      articleCount++;

      const tagInfo  = TAG_MAP[tag] || { label: tag || 'Tin Tức', color: '#666' };
      const finalImg = imgUrl || 'https://raw.githubusercontent.com/trinkse61538/AGVN/main/images/bonglua.png';
      const readTime = estimateReadTime(content);
      const encodedTitle = title.replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

      // Xử lý Content: giữ nguyên xuống dòng → thẻ <p> hoặc <br>
      let formattedContent = content
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

      // === Sinh card cho danh sách ===
      cardsHtml += `
                    <article class="news-card" data-category="${tag}">
                        <div class="news-card-img">
                            <img src="${finalImg}" alt="${encodedTitle}" loading="lazy">
                            <span class="news-card-date"><i class="fa-regular fa-calendar"></i> ${date}</span>
                            <span class="news-card-tag" style="background:${tagInfo.color};">${tagInfo.label}</span>
                        </div>
                        <div class="news-card-body">
                            <h3 class="news-card-title">${title}</h3>
                            <p class="news-card-excerpt">${excerpt}</p>
                            <div class="news-card-meta">
                                <span><i class="fa-regular fa-user"></i> ${author}</span>
                                <a href="/tin-tuc/${slug}.html" class="news-card-link">Đọc tiếp <i class="fa-solid fa-arrow-right"></i></a>
                            </div>
                        </div>
                    </article>`;
    });

    // === Bước 2: Cập nhật danh sách tintuc.html ===
    let listTemplate = fs.readFileSync(newsListTemplatePath, 'utf8');
    const newsGridHtml = `<div class="news-grid" data-aos="fade-up">${cardsHtml}
                </div>`;

    if (listTemplate.includes('{{NewsItems}}')) {
      const result = listTemplate.replace('{{NewsItems}}', newsGridHtml);
      fs.writeFileSync(newsListTemplatePath, result, 'utf8');
      console.log(`\n✅ Đã sinh ${articleCount} bài viết chi tiết vào thư mục tin-tuc/`);
      console.log(`✅ Đã cập nhật ${articleCount} card tin tức vào tintuc.html`);
    } else {
      console.log('⚠️ Không tìm thấy {{NewsItems}} trong tintuc.html');
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
