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

<div class="banner-section">
        <div class="banner-container">
            <img src="https://raw.githubusercontent.com/trinkse61538/AGVN/c754eafe559f3903c26ef784231fd86d50da8c39/AGVN%20Banner%202.jpg" alt="Banner AGVN Group" class="banner-img" width="1920" height="635" fetchpriority="high">
        </div>
    </div>

    <section id="about" class="about-section">
        <div class="container">
            <div class="about-grid">
                <div class="about-content" data-aos="fade-right">
                    <h2 style="color: var(--primary-color); margin-bottom: 10px;">VỀ TẬP ĐOÀN AGVN GROUP</h2>
                    <h3 style="font-weight: 400; color: #555;">Người bạn đồng hành của nhà nông Việt</h3>
                    <p style="margin-top: 15px;">Tập Đoàn Nông Nghiệp AGVN Group tự hại là đơn vị tiên phong cung cấp các giải pháp vật tư nông nghiệp công nghệ cao. Với bộ sản phẩm tiên tiến, chúng tôi cam kết đồng hành cùng bà con từ lúc làm đất, bón phân cho tới ngày gặt hái quả ngọt thắng lợi.</p>
                    <p>Chúng tôi luôn nỗ lực không ngừng để nghiên cứu các dòng sản phẩm an toàn, bảo vệ hệ sinh thái đất và mang đến giá trị kinh tế bền vững nhất cho nông sản Việt Nam vươn tầm quốc tế.</p>
                </div>
                <div class="mission-cards" data-aos="fade-left">
                    <div class="card">
                        <i class="fa-solid fa-rocket"></i>
                        <h3>Sứ Mệnh</h3>
                        <p>Giúp bà con nông dân "Tăng Năng Suất - Giảm Chi Phí", tối ưu hóa lợi nhuận trên từng công đất.</p>
                    </div>
                    <div class="card">
                        <i class="fa-solid fa-eye"></i>
                        <h3>Tầm Nhìn</h3>
                        <p>Trở thành biểu tượng niềm tin hàng đầu trong ngành nông nghiệp sạch và bền vững tại Việt Nam.</p>
                    </div>
                    <div class="card">
                        <i class="fa-solid fa-shield-halved"></i>
                        <h3>An Toàn</h3>
                        <p>Sản phẩm đạt chuẩn, thân thiện với môi trường, con người và đảm bảo nông sản sạch.</p>
                    </div>
                    <div class="card">
                        <i class="fa-solid fa-wheat-awn"></i>
                        <h3>Hiệu Quả</h3>
                        <p>Hiệu quả vượt trội rõ rệt được hàng triệu bà con trên khắp các tỉnh thành chứng thực.</p>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <section id="products" class="product-section">
        <div class="container">
            <h2 class="section-title" data-aos="fade-up">CÁC DÒNG SẢN PHẨM</h2>

            <h3 style="color:var(--thuoc-color);font-size:1.3rem;margin-bottom:18px; font-weight: 700;">🧪 Thuốc Trừ Bệnh</h3>
            <div class="cw">
                <button class="cb cb-prev" onclick="goTruBenh(-1)">‹</button>
                <div class="cv">
                    <div class="ct" id="ctTruBenh">
                        <div class="ci">
                            <div class="ci-img"><img src="https://raw.githubusercontent.com/trinkse61538/AGVN/main/images/ThuocTruBenh/FENO%20SUPER%20400ML%20catalouge.png" alt="FENO SUPER" loading="lazy"></div>
                            <div class="ci-info">
                                <span class="pt-ylw">Thuốc Trừ Bệnh</span>
                                <div class="ci-title">FENO SUPER</div>
                                <ul class="ci-features">
                                    <li><span>✅</span> Nội hấp, lưu dẫn mạnh: Thuốc thấm sâu vào cây, bảo vệ toàn diện từ gốc đến ngọn.</li>
                                    <li><span>✅</span> Hiệu lực kéo dài, thấm sâu nhanh giúp bảo vệ toàn diện các mô cây non mới ra.</li>
                                    <li><span>✅</span> An toàn cho lúa: Sản phẩm dạng SC (huyền phục đậm đặc) không gây nóng, an toàn cho cây trồng ở mọi giai đoạn.</li>
                                </ul>
                                <button class="product-detail-more-btn" onclick="toggleProductDetail(this)">Xem thêm <i class="fa-solid fa-chevron-down"></i></button>
                            </div>
                        </div>
                        <div class="ci">
                            <div class="ci-img"><img src="https://raw.githubusercontent.com/trinkse61538/AGVN/main/images/ThuocTruBenh/Va%CC%80ng%20la%CC%81%20catalouge.png" alt="VÀNG LÁ" loading="lazy"></div>
                            <div class="ci-info">
                                <span class="pt-ylw">Thuốc Trừ Bệnh</span>
                                <div class="ci-title">VÀNG LÁ</div>
                                <ul class="ci-features">
                                    <li><span>✅</span> Cô lập mầm bệnh – Ngăn không cho lây lan.</li>
                                    <li><span>✅</span> Diệt nấm tận gốc – Hiệu quả nhanh chóng.</li>
                                    <li><span>✅</span> Giúp cây khỏe, xanh lá, phục hồi sức đề kháng, chống tái nhiễm.</li>
                                </ul>
                                <button class="product-detail-more-btn" onclick="toggleProductDetail(this)">Xem thêm <i class="fa-solid fa-chevron-down"></i></button>
                            </div>
                        </div>
                        <div class="ci">
                            <div class="ci-img"><img src="https://raw.githubusercontent.com/trinkse61538/AGVN/main/images/ThuocTruBenh/ANWIN%20ZN%20A%CC%82%CC%81N%20%C4%90O%CC%A3%CC%82%201L%20catalouge.png" alt="ANWN Zn+ Ấn Độ" loading="lazy"></div>
                            <div class="ci-info">
                                <span class="pt-ylw">Thuốc Trừ Bệnh</span>
                                <div class="ci-title">ANWN Zn+ ẤN ĐỘ</div>
                                <ul class="ci-features">
                                    <li><span>✅</span> Thành phần Hexaconazole 50 g/L (SC) – phổ tác dụng rộng, diệt nhanh các bệnh: Khô vằn, Đốm vằn, Lem lép hạt, Thán thư, Nấm hồng, Phấn trắng...</li>
                                    <li><span>✅</span> Sản phẩm còn được đăng ký chuyên trị bệnh rỉ sắt trên cà phê, mang lại sự an tâm tuyệt đối.</li>
                                    <li><span>✅</span> Bổ sung Kẽm Chelate → giúp cây xanh lá, dày lá, phục hồi nhanh sau bệnh.</li>
                                    <li><span>✅</span> Phối trộn dễ dàng, hoà tan tốt, nhờ công nghệ sản xuất tiên tiến, không gây kết tủa.</li>
                                </ul>
                                <button class="product-detail-more-btn" onclick="toggleProductDetail(this)">Xem thêm <i class="fa-solid fa-chevron-down"></i></button>
                            </div>
                        </div>
                        <div class="ci">
                            <div class="ci-img"><img src="https://raw.githubusercontent.com/trinkse61538/AGVN/main/images/ThuocTruBenh/%C4%90A%CC%A3%CC%86C%20TRI%CC%A3%20%C4%90A%CC%A3O%20O%CC%82N%20catalouge.png" alt="Đặc trị đạo ôn" loading="lazy"></div>
                            <div class="ci-info">
                                <span class="pt-ylw">Thuốc Trừ Bệnh</span>
                                <div class="ci-title">ĐẶC TRỊ ĐẠO ÔN</div>
                                <ul class="ci-features">
                                    <li><span>✅</span> Hết sạch đạo ôn: Đặc trị hiệu quả đạo ôn lá (cháy lá), đạo ôn cổ bông và đạo ôn cổ gié, giúp cây lúa hồi phục nhanh chóng.</li>
                                    <li><span>✅</span> Cứng cây, đứng lá: Thuốc giúp cây lúa khỏe mạnh, xanh lá, tăng khả năng quang hợp và chống chịu sâu bệnh hiệu quả.</li>
                                    <li><span>✅</span> Năng suất vượt trội: Bảo vệ bông lúa khỏi nấm bệnh, giúp hạt chắc mẩy, gia tăng sản lượng.</li>
                                    <li><span>✅</span> Rất an toàn cho lúa: Công thức đặc biệt không gây nóng cho cây, an toàn khi phun ở giai đoạn lúa trổ bông nhạy cảm.</li>
                                </ul>
                                <button class="product-detail-more-btn" onclick="toggleProductDetail(this)">Xem thêm <i class="fa-solid fa-chevron-down"></i></button>
                            </div>
                        </div>
                        <div class="ci">
                            <div class="ci-img"><img src="https://raw.githubusercontent.com/trinkse61538/AGVN/main/images/ThuocTruBenh/KHUA%CC%82%CC%89N%20LA%CC%A3NH%20KING%20450ML%20catalouge.png" alt="Khuẩn lạnh King" loading="lazy"></div>
                            <div class="ci-info">
                                <span class="pt-ylw">Thuốc Trừ Bệnh</span>
                                <div class="ci-title">KHUẨN LẠNH KING</div>
                                <ul class="ci-features">
                                    <li><span>✅</span> Đặc trị các bệnh vi khuẩn như bạc lá, sương mai, thối quả...</li>
                                    <li><span>✅</span> Thuốc trừ bệnh gốc kháng sinh mới, có phổ tác động rộng.</li>
                                    <li><span>✅</span> Kích thích tăng trưởng, giúp cây mát khỏe, lá xanh bóng.</li>
                                </ul>
                                <button class="product-detail-more-btn" onclick="toggleProductDetail(this)">Xem thêm <i class="fa-solid fa-chevron-down"></i></button>
                            </div>
                        </div>
                        <div class="ci">
                            <div class="ci-img"><img src="https://raw.githubusercontent.com/trinkse61538/AGVN/main/images/ThuocTruBenh/Lem%20le%CC%81p%20catalog.png" alt="Lem Lép Hạt" loading="lazy"></div>
                            <div class="ci-info">
                                <span class="pt-ylw">Thuốc Trừ Bệnh</span>
                                <div class="ci-title">LEM LÉP HẠT</div>
                                <ul class="ci-features">
                                    <li><span>✅</span> Thuốc trừ bệnh với 2 cơ chế tác động: chuyên vị và lưu dẫn mạnh.</li>
                                    <li><span>✅</span> Thấm sâu, hạn chế mưa rửa trôi, hiệu lực kéo dài.</li>
                                    <li><span>✅</span> Bảo vệ bộ lá đòng xanh khỏe, giúp cây phát triển bền vững.</li>
                                </ul>
                                <button class="product-detail-more-btn" onclick="toggleProductDetail(this)">Xem thêm <i class="fa-solid fa-chevron-down"></i></button>
                            </div>
                        </div>
                        <div class="ci">
                            <div class="ci-img"><img src="https://raw.githubusercontent.com/trinkse61538/AGVN/main/images/ThuocTruBenh/SA%CC%A3CH%20NA%CC%82%CC%81M%20KHUA%CC%82%CC%89N%20(AGVN)%20catalog.png" alt="Sạch Nấm Khuẩn" loading="lazy"></div>
                            <div class="ci-info">
                                <span class="pt-ylw">Thuốc Trừ Bệnh</span>
                                <div class="ci-title">SẠCH NẤM KHUẨN</div>
                                <ul class="ci-features">
                                    <li><span>✅</span> Trị khuẩn mạnh mẽ: Cháy bìa lá (bạc lá), lép vàng, thán thư, thối nhũn...</li>
                                    <li><span>✅</span> Cơ chế tác động "kháng khuẩn từ bên trong - diệt khuẩn từ bên ngoài" tạo thành một "gọng kìm" vững chắc, giúp cây trồng được bảo vệ một cách toàn diện.</li>
                                    <li><span>✅</span> Giúp cây xanh khỏe – chắc hạt – năng suất bền vững.</li>
                                </ul>
                                <button class="product-detail-more-btn" onclick="toggleProductDetail(this)">Xem thêm <i class="fa-solid fa-chevron-down"></i></button>
                            </div>
                        </div>
                        <div class="ci">
                            <div class="ci-img"><img src="https://raw.githubusercontent.com/trinkse61538/AGVN/main/images/ThuocTruBenh/AGVN%20%C4%90A%CC%A3O%20O%CC%82N%20PROMAX%20(FENO%20PROMAX)%20240ML%20catalog.png" alt="ĐẠO ÔN PROMAX" loading="lazy"></div>
                            <div class="ci-info">
                                <span class="pt-ylw">Thuốc Trừ Bệnh</span>
                                <div class="ci-title">ĐẠO ÔN PROMAX</div>
                                <ul class="ci-features">
                                    <li><span>✅</span> Lưu dẫn cực mạnh: Thuốc thấm sâu nhanh vào mô cây, bảo vệ toàn diện từ bộ lá đến tận cổ bông.</li>
                                    <li><span>✅</span> Hiệu quả kéo dài: Diệt bệnh nhanh, giữ lúa xanh bền, lá đòng khỏe, bông vàng sáng – chắc hạt đến cậy.</li>
                                    <li><span>✅</span> Dạng huyền phù (SC): Tan tốt, mát cây, không lo nóng lúa hay cháy lá ngay cả khi phun trong điều kiện thời tiết khắc nghiệt.</li>
                                </ul>
                                <button class="product-detail-more-btn" onclick="toggleProductDetail(this)">Xem thêm <i class="fa-solid fa-chevron-down"></i></button>
                            </div>
                        </div>
                        <div class="ci">
                            <div class="ci-img"><img src="https://raw.githubusercontent.com/trinkse61538/AGVN/main/images/ThuocTruBenh/AGVN%20PICOPLUS%20300%20(AA%20YAKI)%20240ML%20catalog.png" alt="PICO PLUS 300" loading="lazy"></div>
                            <div class="ci-info">
                                <span class="pt-ylw">Thuốc Trừ Bệnh</span>
                                <div class="ci-title">PICO PLUS 300</div>
                                <ul class="ci-features">
                                    <li><span>✅</span> Cơ chế tác động kép: Lưu dẫn mạnh và thấm sâu giúp bảo vệ cây trồng toàn diện từ bên trong ra bên ngoài.</li>
                                    <li><span>✅</span> Hiệu quả kéo dài: Ức chế hô hấp của nấm bệnh, ngăn chặn sự xâm nhiễm và lây lan.</li>
                                    <li><span>✅</span> Bảo vệ năng suất: Giúp giữ bộ lá đòng xanh mướt, bông lúa sáng, hạt chắc tới cậy, tăng chất lượng nông sản.</li>
                                    <li><span>✅</span> Tiện lợi tối đa: Nồng độ hoạt chất cao, không cần phối trộn thêm nhiều loại thuốc khác vẫn quản lý tốt nấm bệnh.</li>
                                    <li><span>✅</span> Dạng thuốc: Huyền phù (SC) hiện đại, an toàn cho cây trồng, không gây nóng lúa.</li>
                                </ul>
                                <button class="product-detail-more-btn" onclick="toggleProductDetail(this)">Xem thêm <i class="fa-solid fa-chevron-down"></i></button>
                            </div>
                        </div>
                        <div class="ci">
                            <div class="ci-img"><img src="https://raw.githubusercontent.com/trinkse61538/AGVN/main/images/ThuocTruBenh/SUPERCOL%20(AGVN)%20catalog.png" alt="Supecol 692" loading="lazy"></div>
                            <div class="ci-info">
                                <span class="pt-ylw">Thuốc Trừ Bệnh</span>
                                <div class="ci-title">SUPERCOL 692</div>
                                <ul class="ci-features">
                                    <li><span>✅</span> Tạo cơ chế phòng vệ từ bên ngoài và quản lý hiệu quả các bệnh gây hại như: vàng lá, đốm lá, đạo ôn lá, đạo ôn cổ bông...</li>
                                    <li><span>✅</span> Tác động kép: tiếp xúc và lưu dẫn mạnh → ngăn chặn nấm bệnh ngay từ đầu, tiêu diệt sợi nấm đã xâm nhập.</li>
                                </ul>
                                <button class="product-detail-more-btn" onclick="toggleProductDetail(this)">Xem thêm <i class="fa-solid fa-chevron-down"></i></button>
                            </div>
                        </div>
                    </div>
                </div>
                <button class="cb cb-next" onclick="goTruBenh(1)">›</button>
            </div>


            <h3 style="color:var(--sau-ray-color);font-size:1.3rem;margin:40px 0 18px; font-weight: 700;">☣️ Thuốc Trừ Sâu - Rầy</h3>
            <div class="cw">
                <button class="cb cb-prev" onclick="goSauRay(-1)">‹</button>
                <div class="cv">
                    <div class="ct" id="ctSauRay">
                        <div class="ci">
                            <div class="ci-img"><img src="https://raw.githubusercontent.com/trinkse61538/AGVN/main/images/ThuocTruSau/Die%CC%A3%CC%82t%20Chi%CC%81ch%20Hu%CC%81t%20catalouge.png" alt="Diệt chích hút" loading="lazy"></div>
                            <div class="ci-info">
                                <span class="pt-red">Thuốc Trừ Sâu - Rầy</span>
                                <div class="ci-title">DIỆT CHÍCH HÚT</div>
                                <ul class="ci-features">
                                    <li><span>✅</span> Diệt nhanh, diệt sạch: Hiệu quả cực mạnh với nhiều loại côn trùng chích hút như: rầy nâu, rầy cánh trắng, bọ trĩ, rệp sáp, rầy xanh...</li>
                                    <li><span>✅</span> Không gây nóng bông, diệt sạch và ung trứng, cắt lứa nhanh chóng.</li>
                                    <li><span>✅</span> Tính lưu dẫn cao, giúp thuốc di chuyển đến các bộ phận khác của cây.</li>
                                    <li><span>✅</span> Hiệu lực kéo dài, hấp thu nhanh trong vòng 2-3 giờ, không bị rửa trôi khi gặp mưa.</li>
                                    <li><span>✅</span> Pha trộn dễ dàng, hoà tan tốt, sử dụng tốt mọi giai đoạn cây trồng.</li>
                                </ul>
                                <button class="product-detail-more-btn" onclick="toggleProductDetail(this)">Xem thêm <i class="fa-solid fa-chevron-down"></i></button>
                            </div>
                        </div>
                        <div class="ci">
                            <div class="ci-img"><img src="https://raw.githubusercontent.com/trinkse61538/AGVN/main/images/ThuocTruSau/Bo%CC%80%20hu%CC%81c%20va%CC%80ng%20(aa%20faros)%20AGVN%20300ml%20catalog.png" alt="BÒ HÚC VÀNG" loading="lazy"></div>
                            <div class="ci-info">
                                <span class="pt-red">Thuốc Trừ Sâu - Rầy</span>
                                <div class="ci-title">BÒ HÚC VÀNG</div>
                                <ul class="ci-features">
                                    <li><span>✅</span> Đặc trị rầy nâu, rầy phấn trắng, bọ xít hôi, rệp sáp, bọ trĩ trên lúa.</li>
                                    <li><span>✅</span> Kiểm soát hiệu quả rầy mềm, bọ trĩ, rệp sáp, bọ xít muỗi trên rau màu và cây ăn trái.</li>
                                    <li><span>✅</span> Với dạng Huyền phù (SC) tiên tiến, thuốc thấm sâu, bám dính tốt và hấp thụ tối ưu mà không gây nóng cây, sử dụng an toàn trong mọi giai đoạn phát triển của cây trồng.</li>
                                </ul>
                                <button class="product-detail-more-btn" onclick="toggleProductDetail(this)">Xem thêm <i class="fa-solid fa-chevron-down"></i></button>
                            </div>
                        </div>
                        <div class="ci">
                            <div class="ci-img"><img src="https://raw.githubusercontent.com/trinkse61538/AGVN/main/images/ThuocTruSau/XO%CC%82NG%20HO%CC%9BI%20B52%20CATALOUGE.png" alt="Xông hơi B52" loading="lazy"></div>
                            <div class="ci-info">
                                <span class="pt-red">Thuốc Trừ Sâu - Rầy</span>
                                <div class="ci-title">XÔNG HƠI B52</div>
                                <ul class="ci-features">
                                    <li><span>✅</span> Xông hơi cực mạnh: Lan tỏa khắp tán lá and thân cây, diệt cả côn trùng ẩn sâu bên trong.</li>
                                    <li><span>✅</span> Tiếp xúc nhanh: Hiệu quả nhanh, kéo dài nhiều ngày giúp giảm số lần phun, tiết kiệm chi phí.</li>
                                    <li><span>✅</span> Nội hấp: Nội hấp vượt trội, thấm sâu vào mô cây diệt tức thì côn trùng và ổ trứng gây hại.</li>
                                </ul>
                                <button class="product-detail-more-btn" onclick="toggleProductDetail(this)">Xem thêm <i class="fa-solid fa-chevron-down"></i></button>
                            </div>
                        </div>
                    </div>
                </div>
                <button class="cb cb-next" onclick="goSauRay(1)">›</button>
            </div>


            <h3 style="color:var(--dieu-hoa-color);font-size:1.3rem;margin:40px 0 18px; font-weight: 700;">🚀 Thuốc Điều Hòa Sinh Trưởng</h3>
            <div class="cw">
                <button class="cb cb-prev" onclick="goDieuHoa(-1)">‹</button>
                <div class="cv">
                    <div class="ct" id="ctDieuHoa">
                        <div class="ci">
                            <div class="ci-img"><img src="https://raw.githubusercontent.com/trinkse61538/AGVN/main/images/ThuocDieuHoaSinhTruong/LU%CC%80N%20LU%CC%9B%CC%A3C%20CATALOG.png" alt="LÙN LỰC" loading="lazy"></div>
                            <div class="ci-info">
                                <span class="pt-teal">Thuốc Điều Hoà Sinh Trưởng</span>
                                <div class="ci-title">LÙN LỰC</div>
                                <ul class="ci-features">
                                    <li><span>✅</span> Điều hòa sinh trưởng, hạn chế chiều cao: Paclobutrazol ức chế quá trình sinh tổng hợp Gibberellin, giúp ngắn thân rạ, ngắn lóng, tăng độ dày thân cây.</li>
                                    <li><span>✅</span> Mập thân – cứng cây – đứng lá: Giúp bộ lá dày, xanh bền, đứng thẳng, không gây phượt lá.</li>
                                    <li><span>✅</span> Giảm đổ ngã, bảo vệ năng suất: Hạn chế đổ ngã khi gặp mưa gió, giúp giảm thất thoát năng suất và tiết kiệm chi phí thu hoạch.</li>
                                    <li><span>✅</span> Giúp bộ rễ phát triển khỏe, đẻ nhánh gọn và hiệu quả nhờ điều tiết sinh trưởng cân đối, nâng cao hiệu quả sử dụng phân bón ngay từ giai đoạn đầu.</li>
                                    <li><span>✅</span> Dạng huyền phù (SC) ưu việt: Thuốc dạng sữa dễ hòa tan hoàn toàn trong nước, giúp cây hấp thụ nhanh chóng và tối ưu qua lá, thân, rễ.</li>
                                </ul>
                                <button class="product-detail-more-btn" onclick="toggleProductDetail(this)">Xem thêm <i class="fa-solid fa-chevron-down"></i></button>
                            </div>
                        </div>
                        <div class="ci">
                            <div class="ci-img"><img src="https://raw.githubusercontent.com/trinkse61538/AGVN/main/images/ThuocDieuHoaSinhTruong/NUMBER ONE (AGVN) catalog.png" alt="Number One" loading="lazy"></div>
                            <div class="ci-info">
                                <span class="pt-teal">Thuốc Điều Hoà Sinh Trưởng</span>
                                <div class="ci-title">NUMBER ONE</div>
                                <ul class="ci-features">
                                    <li><span>✅</span> Ưu điểm vượt trội của Pyraclostrobin kiểm soát hiệu quả many loại nấm là các tác nhân gây ra các loại bệnh phổ biến.</li>
                                    <li><span>✅</span> Kích thích hoạt động quang hợp: Hoạt chất này làm tăng hàm lượng diệp lục tố, giúp lá cây xanh lâu hơn, nâng cao hiệu quả hấp thụ ánh sáng.</li>
                                    <li><span>✅</span> Cải thiện khả năng hấp thụ dinh dưỡng và nước: Đặc biệt với Nitơ, cây trồng có thể sử dụng nguồn dinh dưỡng một cách tối ưu hơn, từ đó phát triển mạnh mẽ và đồng đều.</li>
                                    <li><span>✅</span> Tăng cường sức đề kháng: với khả năng kích hoạt gen PR (Gen PR phòng thủ sinh học) cây trồng có khả năng chống chịu tốt hơn trước stress môi trường, bao gồm nhiệt độ cao, hạn hán hoặc độ ẩm cao.</li>
                                    <li><span>✅</span> Kéo dài tuổi thọ lá: thuốc cũng có thể làm giảm tác dụng sinh học của ethylene tổng hợp, trì hoãn sự già đi của cây trồng, cải thiện hệ miễn dịch và khả năng chống lại các yếu tố tăng trưởng bất lợi, từ đó cải thiện năng suất và chất lượng nông sản.</li>
                                </ul>
                                <button class="product-detail-more-btn" onclick="toggleProductDetail(this)">Xem thêm <i class="fa-solid fa-chevron-down"></i></button>
                            </div>
                        </div>
                    </div>
                </div>
                <button class="cb cb-next" onclick="goDieuHoa(1)">›</button>
            </div>


            <h3 style="color:var(--primary-color);font-size:1.3rem;margin:40px 0 18px; font-weight: 700;">🌱 Phân bón</h3>
            <div class="cw">
                <button class="cb cb-prev" onclick="goPhanBon(-1)">‹</button>
                <div class="cv">
                    <div class="ct" id="ctPhanBon">
                        <div class="ci">
                            <div class="ci-img"><img src="https://raw.githubusercontent.com/trinkse61538/AGVN/24f9b3756526d585cd0e1eac5970906f40cfcd62/images/PhanBon/Du%CC%9Bo%CC%9B%CC%83ng%20%C4%90o%CC%80ng%20Va%CC%80ng%20AGVN%20catalouge.png" alt="DƯỠNG ĐÒNG VÀNG" loading="lazy"></div>
                            <div class="ci-info">
                                <span class="pt-grn">Phân bón hữu cơ</span>
                                <div class="ci-title">DƯỠNG ĐÒNG VÀNG</div>
                                <ul class="ci-features">
                                    <li><span>✅</span> Bổ sung toàn diện: Cung cấp đầy đủ chất hữu cơ, đa lượng NPK và các trung vi lượng thiết yếu, giúp lúa khỏe mạnh, cứng cáp and tăng sức đề kháng.</li>
                                    <li><span>✅</span> Cải tạo đất, chắc hạt: Thành phần hữu cơ giúp cải tạo đất, kích thích rễ phát triển mạnh, từ đó hấp thụ dinh dưỡng tốt hơn, giúp cây đứng lá and hạt chắc.</li>
                                    <li><span>✅</span> Kích thích đòng to, bông dài, hạt nhiều, lúa trổ thoát nhanh và đồng loạt.</li>
                                </ul>
                                <button class="product-detail-more-btn" onclick="toggleProductDetail(this)">Xem thêm <i class="fa-solid fa-chevron-down"></i></button>
                            </div>
                        </div>
                        <div class="ci">
                            <div class="ci-img"><img src="https://raw.githubusercontent.com/trinkse61538/AGVN/24f9b3756526d585cd0e1eac5970906f40cfcd62/images/PhanBon/Ha%CC%A3t%20Va%CC%80ng%20catalouge.png" alt="HẠT VÀNG" loading="lazy"></div>
                            <div class="ci-info">
                                <span class="pt-grn">Phân bón hữu cơ</span>
                                <div class="ci-title">HẠT VÀNG</div>
                                <ul class="ci-features">
                                    <li><span>✅</span> Vô gạo thần tốc, tăng tỉ lệ hạt chắc – sáng bông.</li>
                                    <li><span>✅</span> Giữ xanh bộ lá đòng → quang hợp mạnh, chín chắc tới cậy.</li>
                                    <li><span>✅</span> Bông chín lá xanh, lúa tươi nặng ký.</li>
                                </ul>
                                <button class="product-detail-more-btn" onclick="toggleProductDetail(this)">Xem thêm <i class="fa-solid fa-chevron-down"></i></button>
                            </div>
                        </div>
                        <div class="ci">
                            <div class="ci-img"><img src="https://raw.githubusercontent.com/trinkse61538/AGVN/24f9b3756526d585cd0e1eac5970906f40cfcd62/images/PhanBon/Sie%CC%82u%20Re%CC%82%CC%83%20No%CC%9B%CC%89%20Bu%CC%A3i%20catalouge.png" alt="SIÊU RỄ NỞ BỤI" loading="lazy"></div>
                            <div class="ci-info">
                                <span class="pt-grn">Phân bón hữu cơ</span>
                                <div class="ci-title">SIÊU RỄ NỞ BỤI</div>
                                <ul class="ci-features">
                                    <li><span>✅</span> Axit Humic, P₂O₅ & K₂O: Tăng khả năng hấp thụ, giúp cây lúa khỏe thân, cứng cây và lá xanh bền vững.</li>
                                    <li><span>✅</span> Hormone thực vật NAA & Cytokinin: Kích thích cây đẻ nhánh mạnh, nở bụi to đồng đều, tăng số bông.</li>
                                    <li><span>✅</span> Chất hữu cơ 35%: Là nền tảng giúp cải tạo đất, cung cấp dinh dưỡng, làm rễ mập và cắm sâu.</li>
                                </ul>
                                <button class="product-detail-more-btn" onclick="toggleProductDetail(this)">Xem thêm <i class="fa-solid fa-chevron-down"></i></button>
                            </div>
                        </div>
                        <div class="ci">
                            <div class="ci-img"><img src="https://raw.githubusercontent.com/trinkse61538/AGVN/24f9b3756526d585cd0e1eac5970906f40cfcd62/images/PhanBon/HUMIC%20KE%CC%83M%20AGVN%20(CATALOG).png" alt="HUMIC Zn++" loading="lazy"></div>
                            <div class="ci-info">
                                <span class="pt-grn">Phân bón hữu cơ</span>
                                <div class="ci-title">HUMIC Zn++</div>
                                <ul class="ci-features">
                                    <li><span>✅</span> Kích hoạt bộ rễ phát triển cực mạnh, cắm sâu, giúp cây lúa hấp thụ dinh dưỡng hiệu quả gấp đôi.</li>
                                    <li><span>✅</span> Tăng mật độ chồi hữu hiệu, đảm bảo lúa nở bụi to.</li>
                                    <li><span>✅</span> Giúp lúa mập đòng, lớn bông, gia tăng cả về số lượng và trọng lượng hạt.</li>
                                    <li><span>✅</span> Cải tạo đất, hạ phèn, giải độc hữu cơ.</li>
                                    <li><span>✅</span> Giảm đến 30% lượng phân bón nhưng vẫn đảm bảo đạt năng suất tối đa.</li>
                                </ul>
                                <button class="product-detail-more-btn" onclick="toggleProductDetail(this)">Xem thêm <i class="fa-solid fa-chevron-down"></i></button>
                            </div>
                        </div>
                        <div class="ci">
                            <div class="ci-img"><img src="https://raw.githubusercontent.com/trinkse61538/AGVN/24f9b3756526d585cd0e1eac5970906f40cfcd62/images/PhanBon/bosimax%20(sie%CC%82u%20lu%CC%80n)%20catalouge.png" alt="BOSIMAX" loading="lazy"></div>
                            <div class="ci-info">
                                <span class="pt-grn">Phân bón vi lượng</span>
                                <div class="ci-title">BOSIMAX</div>
                                <ul class="ci-features">
                                    <li><span>✅</span> Cứng cây, ngắn lóng, đứng lá: Nhờ kiểm soát chiều cao cây lúa giúp cây cứng cáp, làm ngắn thân rạ, lá thẳng đứng, làm giảm nguy cơ đổ ngã do gió hoặc mưa lớn ở giai đoạn đòng và trổ bông.</li>
                                    <li><span>✅</span> Tăng cường hệ rễ: Không gây ức chế sự phát triển của bộ rễ, đồng thời có thể kích thích sự phát triển của rễ giúp lúa tập trung dinh dưỡng đẻ nhánh mạnh, nuôi đòng to, bông lớn, tăng khả năng chống chịu thời tiết bất lợi.</li>
                                </ul>
                                <button class="product-detail-more-btn" onclick="toggleProductDetail(this)">Xem thêm <i class="fa-solid fa-chevron-down"></i></button>
                            </div>
                        </div>
                        <div class="ci">
                            <div class="ci-img"><img src="https://raw.githubusercontent.com/trinkse61538/AGVN/24f9b3756526d585cd0e1eac5970906f40cfcd62/images/PhanBon/SILIC%20K%2B%2B%20CATALOG.png" alt="Silic K++" loading="lazy"></div>
                            <div class="ci-info">
                                <span class="pt-grn">Phân bón vi lượng</span>
                                <div class="ci-title">SILIC K++</div>
                                <ul class="ci-features">
                                    <li><span>✅</span> Vô gạo thần tốc, to chắc hạt: Giúp lúa chín chắc tới cây, hạn chế đổ ngã.</li>
                                    <li><span>✅</span> Siêu lớn trái, ngọt trái: Trái to, đẹp màu, xanh gai, nặng ký; hạn chế rụng hoa/trái non.</li>
                                    <li><span>✅</span> Ra rễ cực mạnh, cứng cây: Tạo lớp giáp bảo vệ đa tầng, chống chịu phèn, hạn, mặn và thời tiết bất lợi.</li>
                                    <li><span>✅</span> Tăng năng suất: Tốiưu hấp thụ phân bón và giữ nước, gia tăng chất lượng nông sản.</li>
                                </ul>
                                <button class="product-detail-more-btn" onclick="toggleProductDetail(this)">Xem thêm <i class="fa-solid fa-chevron-down"></i></button>
                            </div>
                        </div>
                    </div>
                </div>
                <button class="cb cb-next" onclick="goPhanBon(1)">›</button>
            </div>

        </div>
    </section>

    <section id="testimonials" class="testimonial-section">
        <div class="container">
            <h2 class="section-title" data-aos="fade-up">BÀ CON NÓI VỀ AGVN GROUP</h2>
            <p style="text-align:center;margin-bottom:30px;font-size:.95rem;color:#555;">Kết quả thực tế từ những cánh đồng sử dụng trọn bộ giải pháp AGVN</p>
            <div class="video-container" data-aos="zoom-in">
                <iframe src="https://www.youtube.com/embed/x-YZqLrYdys" title="YouTube video player" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
            </div>
        </div>
    </section>

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
                    <li><a href="https://agvngroup.com/aboutus.html"><i class="fa-solid fa-angle-right"></i> Về chúng tôi</a></li>
                    <li><a href="#products"><i class="fa-solid fa-angle-right"></i> Các dòng sản phẩm</a></li>
                    <li><a href="#testimonials"><i class="fa-solid fa-angle-right"></i> Kết quả thực tế</a></li>
                </ul>
            </div>
            <div class="footer-contact">
                <h4>Thông Tin Liên Hệ</h4>
                <div class="footer-contact-item">
                    <i class="fa-solid fa-location-dot"></i>
                    <a href="https://www.google.com/maps/search/?api=1&query=Số+12+Đường+Dự+Định+Khóm+Đông+Thịnh+9+Phường+Long+Xuyên+Long+Xuyên+Việt+Nam" target="_blank" title="Xem trên Google Maps">
                        <span>Số 12 Đường Dự Định, Khóm Đông Thịnh 9, Phường Long Xuyên, Long Xuyên, Vietnam</span>
                    </a>
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
            <p>© 2026 Tập Đoàn Nông Nghiệp AGVN Group. Thiết kế chuyên nghiệp vì nhà nông.</p>
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

function toggleProductDetail(btn) {
  var ci = btn.closest('.ci');
  ci.classList.toggle('expanded');
  btn.innerHTML = ci.classList.contains('expanded') ? 'Thu gọn <i class="fa-solid fa-chevron-up"></i>' : 'Xem thêm <i class="fa-solid fa-chevron-down"></i>';
}

function runCar(name) {
  var track = document.getElementById('ct' + name);
  if (!track) return;
  var originals = Array.from(track.children);
  var N = originals.length;
  if (N === 0) return;
  for (var i = 0; i < N; i++) {
    var clone = originals[i].cloneNode(true);
    track.appendChild(clone);
  }
  track._pos = 0;
  track._N = N;
}

function moveCar(name, dir) {
  var track = document.getElementById('ct' + name);
  if (!track) return;
  var items = track.children;
  var N = track._N || items.length / 2 || 1;
  track._pos = (track._pos || 0) + dir;
  var offset = track._pos * (100 / (items.length > 0 ? 1 : 1));
  track.style.transform = 'translateX(' + offset + '%)';
}

function goTruBenh(dir) { moveCar('TruBenh', dir); }
function goSauRay(dir) { moveCar('SauRay', dir); }
function goDieuHoa(dir) { moveCar('DieuHoa', dir); }
function goPhanBon(dir) { moveCar('PhanBon', dir); }

runCar('TruBenh');
runCar('SauRay');
runCar('DieuHoa');
runCar('PhanBon');
</script>
