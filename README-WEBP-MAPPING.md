# AGVN WebP image mapping

Bản này đã đổi toàn bộ ảnh sản phẩm đang dùng trên trang chủ, trang danh sách và các trang `san-pham/*.html` sang thư mục `AGVN_webp_image`.

## Điểm quan trọng

- `generate.js` có `PRODUCT_WEBP_BY_SLUG`, vì vậy chạy lại workflow từ Google Sheet sẽ không đưa 22 sản phẩm hiện có trở về ảnh PNG/JPG cũ.
- Sản phẩm mới chưa có trong map vẫn dùng cột `ImageURL` của Google Sheet. Nên nhập URL WebP cho sản phẩm mới.
- Giữ nguyên thư mục `AGVN_webp_image` trên GitHub.
- File `webp-image-map.json` là danh sách mapping đầy đủ để kiểm tra nhanh.

## Slug đã map

- `anwn-zn-an-do` → `https://agvngroup.com/AGVN_webp_image/ThuocTruBenh/ANWIN%20ZN%20A%23U0302%23U0301N%20%23U0110O%23U0323%23U0302%201L%20catalouge.webp`
- `bo-huc-vang` → `https://agvngroup.com/AGVN_webp_image/ThuocTruSau/Bo%23U0300%20hu%23U0301c%20va%23U0300ng%20%28aa%20faros%29%20AGVN%20300ml%20catalog.webp`
- `bosimax` → `https://agvngroup.com/AGVN_webp_image/PhanBon/bosimax%20%28sie%23U0302u%20lu%23U0300n%29%20catalouge.webp`
- `dac-tri-dao-on` → `https://agvngroup.com/AGVN_webp_image/ThuocTruBenh/%23U0110A%23U0323%23U0306C%20TRI%23U0323%20%23U0110A%23U0323O%20O%23U0302N%20catalouge.webp`
- `dao-on-promax` → `https://agvngroup.com/AGVN_webp_image/ThuocTruBenh/AGVN%20%23U0110A%23U0323O%20O%23U0302N%20PROMAX%20%28FENO%20PROMAX%29%20240ML%20catalog.webp`
- `diet-chich-hut` → `https://agvngroup.com/AGVN_webp_image/ThuocTruSau/Die%23U0323%23U0302t%20Chi%23U0301ch%20Hu%23U0301t%20catalouge.webp`
- `duong-dong-vang` → `https://agvngroup.com/AGVN_webp_image/PhanBon/Du%23U031bo%23U031b%23U0303ng%20%23U0110o%23U0300ng%20Va%23U0300ng%20AGVN%20catalouge.webp`
- `feno-super` → `https://agvngroup.com/AGVN_webp_image/ThuocTruBenh/FENO%20SUPER%20400ML%20catalouge.webp`
- `hat-vang` → `https://agvngroup.com/AGVN_webp_image/PhanBon/Ha%23U0323t%20Va%23U0300ng%20catalouge.webp`
- `humic-zn` → `https://agvngroup.com/AGVN_webp_image/PhanBon/HUMIC%20KE%23U0303M%20AGVN%20%28CATALOG%29.webp`
- `khuan-lanh-king` → `https://agvngroup.com/AGVN_webp_image/ThuocTruBenh/KHUA%23U0302%23U0309N%20LA%23U0323NH%20KING%20450ML%20catalouge.webp`
- `kumin-a60` → `https://agvngroup.com/AGVN_webp_image/ThuocTruBenh/AGVN%20KUMIN%20A60%20%28KASUMIRA%2060SL%29%20catalog.webp`
- `lem-lep` → `https://agvngroup.com/AGVN_webp_image/ThuocTruBenh/Lem%20le%23U0301p%20catalog.webp`
- `lun-luc` → `https://agvngroup.com/AGVN_webp_image/ThuocDieuHoaSinhTruong/LU%23U0300N%20LU%23U031b%23U0323C%20CATALOG.webp`
- `number-one` → `https://agvngroup.com/AGVN_webp_image/ThuocDieuHoaSinhTruong/NUMBER%20ONE%20%28AGVN%29%20catalog.webp`
- `pico-plus-300` → `https://agvngroup.com/AGVN_webp_image/ThuocTruBenh/AGVN%20PICOPLUS%20300%20%28AA%20YAKI%29%20240ML%20catalog.webp`
- `sach-nam-khuan` → `https://agvngroup.com/AGVN_webp_image/ThuocTruBenh/SA%23U0323CH%20NA%23U0302%23U0301M%20KHUA%23U0302%23U0309N%20%28AGVN%29%20catalog.webp`
- `sieu-re-no-bui` → `https://agvngroup.com/AGVN_webp_image/PhanBon/Sie%23U0302u%20Re%23U0302%23U0303%20No%23U031b%23U0309%20Bu%23U0323i%20catalouge.webp`
- `silic-k` → `https://agvngroup.com/AGVN_webp_image/PhanBon/SILIC%20K%2B%2B%20CATALOG.webp`
- `supercol-692` → `https://agvngroup.com/AGVN_webp_image/ThuocTruBenh/SUPERCOL%20%28AGVN%29%20catalog.webp`
- `vang-la` → `https://agvngroup.com/AGVN_webp_image/ThuocTruBenh/Va%23U0300ng%20la%23U0301%20catalouge.webp`
- `xong-hoi-b52` → `https://agvngroup.com/AGVN_webp_image/ThuocTruSau/XO%23U0302NG%20HO%23U031bI%20B52%20CATALOUGE.webp`
