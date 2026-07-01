const fs = require('fs');
const path = require('path');

// ID Google Sheet của bạn
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

      let htmlContent = templateContent
        .replaceAll('{{ProductName}}', name || '')
        .replaceAll('{{ImageURL}}', img || '')
        .replaceAll('{{ProductTag}}', tag || 'Nông Nghiệp')
        .replaceAll('{{Description}}', desc || '');

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

buildProducts();
