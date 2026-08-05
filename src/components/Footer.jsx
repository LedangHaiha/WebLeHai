import React from 'react';

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-grid">
        <div className="footer-column">
          <h4>TRƯỜNG THỰC HIỆN CHUYỂN ĐỔI SỐ THCS ĐỒNG TÂN</h4>
          <p style={{ fontSize: '13px', lineHeight: '1.6', color: '#cbd5e1' }}>
            <strong>Cơ quan chủ quản:</strong> Phòng Giáo Dục và Đào Tạo Huyện Ứng Hòa - Thành phố Hà Nội.<br />
            <strong>Địa chỉ:</strong> Xã Đồng Tân, Huyện Ứng Hòa, TP. Hà Nội.<br />
            <strong>Điện thoại BGH:</strong> (024) 3885.6789 | <strong>Email:</strong> c2dongtan-uh@hanoiedu.vn<br />
            <strong>Chịu trách nhiệm nội dung:</strong> Ban Giám Hiệu Trường THCS Đồng Tân.
          </p>
        </div>

        <div className="footer-column">
          <h4>LIÊN KẾT NHANH</h4>
          <ul className="footer-links">
            <li><a href="#intro">Giới thiệu nhà trường</a></li>
            <li><a href="#news">Tin tức - Sự kiện nổi bật</a></li>
            <li><a href="#docs">Hệ thống văn bản chỉ đạo</a></li>
            <li><a href="#media">Thư viện ảnh & Video</a></li>
            <li><a href="#contact">Sơ đồ chỉ đường & Liên hệ</a></li>
          </ul>
        </div>

        <div className="footer-column">
          <h4>BẢO MẬT & VẬN HÀNH</h4>
          <p style={{ fontSize: '12.5px', color: '#cbd5e1', lineHeight: '1.5' }}>
            Hệ thống Cổng thông tin điện tử vận hành theo Kiến trúc 4 tầng bảo mật (API Gateway, Auth Guard JWT, SQLite Main DB).<br />
            © 2026 Bản quyền thuộc về Trường THCS Đồng Tân.
          </p>
        </div>
      </div>

      <div className="footer-bottom">
        Cổng thông tin điện tử Trường THCS Đồng Tân | Phát triển & Vận hành bởi Antigravity Super Agent (2026)
      </div>
    </footer>
  );
}
