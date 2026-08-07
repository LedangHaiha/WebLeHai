import React from 'react';

export default function Footer({ siteConfig }) {
  const config = siteConfig || {
    schoolName: 'TRƯỜNG THCS ĐỒNG TÂN',
    governingBody: 'UBND Xã Hữu Lũng - Tỉnh Lạng Sơn',
    address: 'Xã Hữu Lũng - Tỉnh Lạng Sơn',
    phone: '(0205) 3885.6789',
    email: 'thcsdongtan.huulung@langson.edu.vn'
  };

  return (
    <footer className="site-footer">
      <div className="footer-content">
        <div className="footer-col">
          <h3>CƠ QUAN CHỦ QUẢN</h3>
          <p><strong>{config.governingBody}</strong></p>
          <p><strong>{config.schoolName}</strong></p>
          <p>📍 Địa chỉ: {config.address}</p>
          <p>📞 Điện thoại: {config.phone}</p>
          <p>✉️ Email: {config.email}</p>
        </div>

        <div className="footer-col">
          <h3>LIÊN KẾT NHANH</h3>
          <ul>
            <li><a href="#intro">Giới thiệu nhà trường</a></li>
            <li><a href="#news">Tin tức - Sự kiện nổi bật</a></li>
            <li><a href="#docs">Văn bản chỉ đạo & Quy chế</a></li>
            <li><a href="#resources">Kho Tài nguyên & Đề thi</a></li>
            <li><a href="#schedule">Lịch công tác tuần</a></li>
          </ul>
        </div>

        <div className="footer-col">
          <h3>THỐNG KÊ TRUY CẬP</h3>
          <div className="stats-box">
            <div>🟢 Đang trực tuyến: <strong>48</strong></div>
            <div>📊 Lượt truy cập hôm nay: <strong>1,250</strong></div>
            <div>🌐 Tổng số lượt truy cập: <strong>850,420</strong></div>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        Bản quyền © 2026 {config.schoolName} - Xã Hữu Lũng, Tỉnh Lạng Sơn. Tất cả quyền được bảo lưu.
      </div>
    </footer>
  );
}
