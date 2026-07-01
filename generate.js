const fs = require('fs');
const path = require('path');

// ID Google Sheet của bạn
const SHEET_ID = '1LFD5TFBzRImhyWDQGoNw8I4aVgaYDZ-H1iwktL5P5-Y';
const SHEET_NAME = 'Sheet1'; // Thay đổi nếu bạn đổi tên sheet dưới tab
const API_URL = `https://opensheet.elk.sh/${SHEET_ID}/${SHEET_NAME}`;

async function buildProducts() {
  try {
    console.log('Đang lấy dữ liệu từ Google Sheet...');
    const response = await fetch(API_URL);
    if (!response.ok) {
      throw new Error(`Không thể kết nối API Opensheet: ${response.statusText}`);
    }
    const products = await response.json();

    // Đường dẫn tới file mẫu và thư mục đích
    const templatePath = path.join(__dirname, 'product_template.html');
    const outputDir = path.join(__dirname, 'san-pham');

    // Tự động tạo thư mục 'san-pham' nếu chưa có
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    if (!fs.existsSync(templatePath)) {
      console.error('Lỗi: Không tìm thấy file product_template.html ở thư mục gốc.');
      return;
    }

    const templateContent = fs.readFileSync(templatePath, 'utf8');

    // Duyệt qua từng dòng sản phẩm từ Google Sheet
    products.forEach(product => {
      // Ép đúng tên key theo tiêu đề cột của bạn (Opensheet tự nhận diện viết hoa/thường theo cột đầu)
      const slug = product['Slug'] || product['slug'];
      const name = product['ProductName'] || product['productname'] || product['Product Name'];
      const img = product['ImageURL'] || product['imageurl'] || product['Image URL'];
      const tag = product['ProductTag'] || product['producttag'] || product['Product Tag'];
      const desc = product['Description'] || product['description'];

      // Bỏ qua nếu dòng đó trống hoặc không có tên file (Slug)
      if (!slug) return;

      console.log(`Đang xử lý sản phẩm: ${name} (${slug}.html)`);

      // Thay thế các Placeholder trong template bằng dữ liệu từ Sheet
      let htmlContent = templateContent
        .replaceAll('{{ProductName}}', name || '')
        .replaceAll('{{ImageURL}}', img || '')
        .replaceAll('{{ProductTag}}', tag || 'Nông Nghiệp')
        .replaceAll('{{Description}}', desc || '');

      // Đường dẫn file đầu ra (VD: san-pham/sp2.html)
      const outputPath = path.join(outputDir, `${slug.trim()}.html`);

      // Ghi file html mới
      fs.writeFileSync(outputPath, htmlContent, 'utf8');
    });

    console.log('Chúc mừng! Đã tự động sinh toàn bộ file sản phẩm thành công.');

  } catch (error) {
    console.error('Đã xảy ra lỗi trong quá trình build:', error);
    process.exit(1);
  }
}

buildProducts();