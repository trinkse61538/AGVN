---
title: "Sản Phẩm Tiên Tiến"
layout: default
---

<style>
/* CSS riêng cho trang sản phẩm */
.section-products { padding: 100px 20px; position: relative; }
.bg-organic { background-color: #fff; }
.bg-protection { background-color: #F4F8F5; }
.section-header { text-align: center; max-width: 700px; margin: 0 auto 60px; }
.category-badge { display: inline-flex; align-items: center; gap: 8px; padding: 8px 20px; border-radius: 30px; font-size: 0.85rem; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 15px; }
.bg-organic .category-badge { background: #E6F4EA; color: var(--primary); }
.bg-protection .category-badge { background: #FFF8E6; color: #D49200; }
.section-title-new { font-size: 2.2rem; font-weight: 800; color: var(--dark); line-height: 1.3; }
.product-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(360px, 1fr)); gap: 40px; max-width: 1200px; margin: 0 auto; }
.product-card { background: #fff; border-radius: 24px; overflow: hidden; box-shadow: 0 10px 15px -3px rgba(0,0,0,0.05); display: flex; flex-direction: column; transition: all 0.4s; border: 1px solid rgba(0,0,0,0.02); }
.product-card:hover { transform: translateY(-10px); box-shadow: 0 20px 25px -5px rgba(0,122,51,0.1); }
.bg-organic .product-card:hover { border-color: rgba(0,122,51,0.2); }
.bg-protection .product-card:hover { border-color: rgba(255,184,28,0.3); }
.card-img { width: 100%; height: 340px; display: flex; align-items: center; justify-content: center; padding: 10px; position: relative; background: #FAFAFA; overflow: hidden; }
.card-img::before { content: ''; position: absolute; width: 230px; height: 230px; border-radius: 40% 60% 70% 30% / 40% 50% 60% 50%; transition: all 0.5s ease; z-index: 1; }
.bg-organic .card-img::before { background: rgba(141,198,63,0.15); }
.bg-protection .card-img::before { background: rgba(255,184,28,0.12); }
.product-card:hover .card-img::before { transform: rotate(45deg) scale(1.1); border-radius: 70% 30% 50% 50% / 30% 60% 40% 70%; }
.card-img img { max-width: 100%; max-height: 100%; object-fit: contain; z-index: 2; transition: transform 0.4s; }
.product-card:hover .card-img img { transform: scale(1.08) translateY(-5px); }
.card-info { padding: 30px; display: flex; flex-direction: column; flex-grow: 1; background: #fff; }
.card-title { font-size: 1.35rem; font-weight: 700; color: var(--dark); margin: 10px 0 15px; transition: color 0.3s; }
.product-card:hover .card-title { color: var(--primary); }
.bg-protection .product-card:hover .card-title { color: #D49200; }
.card-features { list-style: none; margin-bottom: 20px; flex-grow: 1; overflow: hidden; max-height: 155px; transition: max-height 0.5s; }
.card-features.expanded { max-height: 2000px; }
.card-features::after { content: ''; position: absolute; bottom: 0; left: 0; width: 100%; height: 50px; background: linear-gradient(transparent, #fff); pointer-events: none; transition: opacity 0.3s; }
.card-features li { font-size: 0.92rem; color: var(--text-gray); margin-bottom: 12px; line-height: 1.6; display: flex; align-items: flex-start; gap: 12px; text-align: justify; }
.card-features li span { font-size: 0.85rem; padding-top: 3px; }
.bg-organic .card-features li span { color: var(--primary); }
.bg-protection .card-features li span { color: #FFB81C; }
.toggle-btn { display: inline-flex; align-items: center; gap: 8px; margin-top: auto; padding: 8px 20px; border-radius: 30px; font-size: 0.85rem; font-weight: 600; cursor: pointer; transition: all 0.3s; align-self: flex-start; border: 1px solid transparent; }
.bg-organic .toggle-btn { background: #F0Fdf4; color: var(--primary); }
.bg-organic .toggle-btn:hover { background: var(--primary); color: #fff; }
.bg-protection .toggle-btn { background: #FFFFF0; color: #D49200; border-color: #FFE0A3; }
.bg-protection .toggle-btn:hover { background: #FFB81C; color: #fff; }
.section-more-btn { display: none; margin: 40px auto 0; padding: 12px 35px; border-radius: 30px; font-size: 0.95rem; font-weight: 600; cursor: pointer; border: none; }
.bg-organic .section-more-btn { background: var(--primary); color: #fff; }
.bg-protection .section-more-btn { background: #FFB81C; color: #fff; }

@media (max-width: 768px) {
  .section-products { padding: 60px 15px; }
  .section-title-new { font-size: 1.75rem; }
  .product-grid { grid-template-columns: 1fr; gap: 30px; }
  .product-grid.limit-mobile .product-card:nth-child(n+3) { display: none; }
  .section-more-btn.visible { display: block; }
}
</style>

<!-- HERO BANNER -->
<div class="hero-banner">
<div class="container">
<h1 data-aos="zoom-in">Sản Phẩm Tiên Tiến</h1>
<p data-aos="fade-up" data-aos-delay="200">Giải pháp đột phá công nghệ cao giúp tối ưu hóa tiềm năng năng suất, bảo vệ đất và sức khỏe cây trồng.</p>
</div>
</div>

<section class="section-products bg-organic" id="organic-section">
<div class="container">
<div class="section-header" data-aos="fade-up">
<div id="ctTruBenh" class="category-badge"><i class="fa-solid fa-seedling"></i> Lá chắn chủ động</div>
<h2 class="section-title-new">Thuốc Trừ Bệnh</h2>
</div>
<div class="product-grid" data-aos="fade-up">

<div class="product-card">
<div class="card-img"><img src="https://raw.githubusercontent.com/trinkse61538/AGVN/main/images/ThuocTruBenh/FENO%20SUPER%20400ML%20catalouge.png" alt="FENO SUPER" loading="lazy"></div>
<div class="card-info">
<div class="card-title">FENO SUPER</div>
<ul class="card-features">
<li><span><i class="fa-solid fa-circle-check"></i></span>Nội hấp, lưu dẫn mạnh: Thuốc thấm sâu vào cây, bảo vệ toàn diện từ gốc đến ngọn .</li>
<li><span><i class="fa-solid fa-circle-check"></i></span>Hiệu lực kéo dài, thấm sâu nhanh giúp bảo vệ toàn diện các mô cây non mới ra .</li>
<li><span><i class="fa-solid fa-circle-check"></i></span>An toàn cho lúa: Sản phẩm dạng SC (huyền phục đậm đặc) không gây nóng, an toàn cho cây trồng ở mọi giai đoạn .</li>
</ul>
</div>
</div>

</div>

<!-- LƯU Ý: Anh copy các product card còn lại từ file AGVN_product.html gốc vào đây -->

<button class="section-more-btn" onclick="toggleSectionMobile(this)">Xem thêm sản phẩm</button>
</div>
</section>

<!-- ANH COPY CÁC SECTION CÒN LẠI (Thuốc Trừ Sâu, Điều Hòa, Phân Bón) TỪ FILE GỐC -->

<footer id="footer">
<div class="footer-grid">
<div class="footer-about">
<h3>AGVN GROUP</h3>
<p>Bộ sản phẩm tiên tiến hàng đầu Việt Nam giúp thúc đẩy nền nông nghiệp xanh bền vững, mang lại vụ mùa ấm no cho mọi gia đình nhà nông.</p>
<p style="color: var(--accent-color); font-weight: 600;"><i class="fa-solid fa-clock"></i> Thời gian làm việc: 24/7 (Hỗ trợ kỹ thuật bất cứ khi nào bà con cần)</p>
</div>
<div class="footer-links">
<h4>Chuyên Mục</h4>
<ul>
<li><a href="https://agvngroup.com"><i class="fa-solid fa-angle-right"></i> Trang chủ</a></li>
<li><a href="https://agvngroup.com/aboutus.html"><i class="fa-solid fa-angle-right"></i> Giới thiệu</a></li>
<li><a href="#ctTruBenh"><i class="fa-solid fa-angle-right"></i> Sản phẩm</a></li>
</ul>
</div>
<div class="footer-contact">
<h4>Thông Tin Liên Hệ</h4>
<div class="footer-contact-item">
<i class="fa-solid fa-location-dot"></i>
<a href="https://www.google.com/maps/search/?api=1&query=S%E1%BB%91+12+%C4%90%C6%B0%E1%BB%9Dng+D%E1%BB%B1+%C4%90%E1%BB%8Bnh+Kh%C3%B3m+%C4%90%C3%B4ng+Th%E1%BB%8Bnh+9+Ph%C6%B0%E1%BB%9Dng+Long+Xuy%C3%AAn+Long+Xuy%C3%AAn+Vi%E1%BB%87t+Nam" target="_blank"><span>Số 12 Đường Dự Định, Khóm Đông Thịnh 9, Phường Long Xuyên, Long Xuyên, Vietnam</span></a>
</div>
<div class="footer-contact-item">
<i class="fa-solid fa-phone-volume"></i>
<span><a href="tel:0869980098"><strong>0869 980 098</strong></a></span>
</div>
<div class="footer-contact-item">
<i class="fa-solid fa-envelope"></i>
<span><a href="mailto:agvngroup2025@gmail.com">agvngroup2025@gmail.com</a></span>
</div>
</div>
</div>
<div class="footer-bottom">
<p>© 2026 AGVN Group. Tất cả quyền được bảo lưu.</p>
</div>
</footer>

<script src="https://unpkg.com/aos@2.3.1/dist/aos.js"></script>
<script>
AOS.init({ duration: 1000, once: true });

function toggleMenu() {
  var m = document.getElementById('navMenu');
  m.classList.toggle('open');
  var icon = document.querySelector('.hamburger i');
  icon.classList.toggle('fa-bars');
  icon.classList.toggle('fa-times');
}

function initCardToggleButtons() {
  document.querySelectorAll('.product-card').forEach(function(card) {
    var features = card.querySelector('.card-features');
    if (features && !card.querySelector('.toggle-btn')) {
      if (features.scrollHeight > 150) {
        var btn = document.createElement('div');
        btn.className = 'toggle-btn';
        btn.innerHTML = 'Xem thêm';
        btn.onclick = function() {
          var isExpanded = features.classList.toggle('expanded');
          this.classList.toggle('active');
          this.innerHTML = isExpanded ? 'Thu gọn' : 'Xem thêm';
        };
        card.querySelector('.card-info').appendChild(btn);
      }
    }
  });
}

function toggleSectionMobile(btn) {
  var grid = btn.previousElementSibling;
  if (grid && grid.classList) {
    grid.classList.toggle('limit-mobile');
    btn.innerHTML = grid.classList.contains('limit-mobile') ? 'Xem thêm sản phẩm' : 'Thu gọn';
    if (!grid.classList.contains('limit-mobile')) {
      setTimeout(initCardToggleButtons, 50);
    }
  }
}

function checkSectionMobileButtons() {
  document.querySelectorAll('.section-products').forEach(function(section) {
    var cards = section.querySelectorAll('.product-card');
    var btn = section.querySelector('.section-more-btn');
    if (btn) {
      if (cards.length > 2) { btn.classList.add('visible'); }
      else { btn.classList.remove('visible'); }
    }
  });
}

window.addEventListener('load', function() {
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(function() { checkSectionMobileButtons(); initCardToggleButtons(); });
  } else {
    setTimeout(function() { checkSectionMobileButtons(); initCardToggleButtons(); }, 300);
  }
});
</script>
