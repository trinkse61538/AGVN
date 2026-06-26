---
title: "Trang Chủ"
layout: default
---

<style>
/* CSS riêng cho trang chủ */
section { padding: 50px 20px; }

.banner-section { padding: 0; background: #0d2e14; }
.banner-container { width: 100%; max-width: 1920px; margin: 0 auto; line-height: 0; }
.banner-img { width: 100%; height: auto; display: block; object-fit: cover; }

.about-section { background-color: var(--bg-light); }
.about-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 40px; align-items: center; }
.about-content h3 { font-size: 1.8rem; color: var(--primary-color); margin-bottom: 15px; }
.about-content p { margin-bottom: 20px; font-size: 1.1rem; color: #444; text-align: justify; }
.mission-cards { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
.card { background: #fff; padding: 25px; border-radius: 12px; box-shadow: 0 5px 15px rgba(0,0,0,0.05); border-top: 4px solid var(--primary-color); transition: transform 0.3s; }
.card:hover { transform: translateY(-5px); }
.card i { font-size: 2rem; color: var(--secondary-color); margin-bottom: 15px; }

.product-section { background: #fff; position: relative; }
.cw { position: relative; display: flex; align-items: center; gap: 16px; margin-bottom: 30px; }
.cv { flex: 1; overflow: hidden; border-radius: 12px; padding: 10px 5px; }
.ct { display: flex; gap: 25px; transition: transform 0.5s ease-in-out; align-items: flex-start; }
.ci { flex: 0 0 calc((100% - 25px) / 2); background: #fff; border-radius: 12px; overflow: hidden; border: 1px solid #e2f0d9; box-shadow: 0 4px 15px rgba(0,0,0,0.06); display: flex; flex-direction: column; }
.ci-img { width: 100%; height: 480px; background: #f9fdf9; display: flex; align-items: center; justify-content: center; padding: 15px; flex-shrink: 0; overflow: hidden; }
.ci-img img { width: 100%; height: 100%; object-fit: contain; transition: transform 0.4s; }
.ci:hover .ci-img img { transform: scale(1.10); }
.ci-info { padding: 20px; border-top: 1px solid #edf5e8; display: flex; flex-direction: column; flex-grow: 1; }
.ci-title { font-size: 1.3rem; font-weight: 700; color: var(--primary-color); margin: 8px 0 12px; }
.ci-features { list-style: none; margin-top: 5px; }
.ci-features li { font-size: 0.95rem; color: #444; margin-bottom: 8px; display: flex; align-items: flex-start; gap: 8px; }
.pt-grn { background: var(--primary-color); color: #fff; font-size: 0.8rem; padding: 4px 14px; border-radius: 8px; display: inline-block; font-weight: 700; }
.pt-ylw { background: var(--thuoc-color); color: #fff; font-size: 0.8rem; padding: 4px 14px; border-radius: 8px; display: inline-block; font-weight: 700; }
.pt-red { background: var(--sau-ray-color); color: #fff; font-size: 0.8rem; padding: 4px 14px; border-radius: 8px; display: inline-block; font-weight: 700; }
.pt-teal { background: var(--dieu-hoa-color); color: #fff; font-size: 0.8rem; padding: 4px 14px; border-radius: 8px; display: inline-block; font-weight: 700; }
.cb { flex-shrink: 0; width: 44px; height: 44px; border-radius: 50%; border: none; background: var(--primary-color); color: #fff; font-size: 1.5rem; cursor: pointer; z-index: 2; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 10px rgba(0,0,0,0.15); }
.cb:hover { background: var(--secondary-color); }
.product-detail-more-btn { display: flex; align-items: center; justify-content: center; width: 100%; margin-top: auto; padding: 6px 0; background: #f4fdf4; color: var(--primary-color); border: 1px dashed var(--primary-color); border-radius: 6px; font-size: 0.85rem; font-weight: 600; cursor: pointer; min-height: 38px; }
.ci-features li { display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
.ci-features li:nth-child(n+2) { display: none; }
.ci.expanded .ci-features li { display: flex !important; -webkit-line-clamp: unset !important; overflow: visible !important; }
.ci.expanded .ci-features li:nth-child(n+2) { display: flex !important; }
.ci.expanded .ci-features { max-height: 200px; overflow-y: auto; }

.testimonial-section { background: var(--bg-light); }
.video-container { max-width: 850px; margin: 0 auto; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.15); background: #000; aspect-ratio: 16/9; }
.video-container iframe { width: 100%; height: 100%; border: none; }

@media (max-width: 992px) {
  .ci { flex: 0 0 calc((100% - 25px) / 2); }
  .ci-img { height: 380px; }
}
@media (max-width: 768px) {
  .about-grid { grid-template-columns: 1fr; }
  .mission-cards { grid-template-columns: 1fr; }
  .ci { flex: 0 0 100%; max-width: 100%; }
  .ct { flex-direction: row; gap: 25px; }
  #ctTruBenh .ci-title { color: var(--thuoc-color); }
  #ctSauRay .ci-title { color: var(--sau-ray-color); }
  #ctDieuHoa .ci-title { color: var(--dieu-hoa-color); }
  #ctPhanBon .ci-title { color: var(--primary-color); }
}
</style>
