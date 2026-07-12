# AGVN — ghi chú cập nhật giao diện dùng chung

## Đã đồng bộ

- Header và footer của toàn bộ file HTML dùng cùng một cấu trúc.
- Menu có `Quy Trình Canh Tác Lúa` trỏ đến `/quytrinhcanhtaclua.html`.
- `Tin Tức` đã có sẵn trong menu nhưng đang bị ẩn bằng class `agvn-nav-news--hidden`.
- Khu vực tin tức được thêm `noindex, nofollow` trong thời gian chưa hoàn thiện.
- Nút gọi điện, Zalo và Messenger đã được chuẩn hóa.
- CSS/JS dùng chung nằm tại:
  - `/assets/agvn-shared.css`
  - `/assets/agvn-shared.js`

## Cách bật Tin Tức sau này

1. Tìm trong header dùng chung của các file HTML:
   `class="agvn-nav-item agvn-nav-news--hidden"`
2. Xóa `agvn-nav-news--hidden`.
3. Trong `tintuc.html`, `news_template.html` và các file bên trong `tin-tuc/`, xóa:
   `<meta name="robots" content="noindex, nofollow">`

> Lưu ý: Vì website hiện là HTML tĩnh, header/footer vẫn được chép vào từng file. CSS và JavaScript đã được tách dùng chung để việc chỉnh giao diện sau này chỉ cần sửa trong thư mục `assets/`.

## Thông tin liên hệ đang sử dụng

- Địa chỉ: Số 12 Đường Dự Định, Khóm Đông Thịnh 9, Phường Long Xuyên, Long Xuyên, Vietnam
- Điện thoại / Zalo: 0869 980 098
- Email: agvngroup2025@gmail.com
- Không hiển thị mã số thuế hoặc người đại diện trên website.

## Kiểm tra trực tiếp bằng file trên máy
Các file dùng đường dẫn tương đối tới `assets/agvn-shared.css` và `assets/agvn-shared.js`, vì vậy có thể mở `index.html` trực tiếp bằng Chrome (`file://`) mà header/footer vẫn hiển thị đúng.

Mục **Tin Tức** có cả class `agvn-nav-news--hidden` và thuộc tính `hidden`. Khi muốn hiển thị, cần xóa cả class và thuộc tính `hidden` khỏi mục menu.
