import React from 'react';

export default function HeaderBanner() {
  return (
    <header className="header-banner">
      <div className="header-content">
        <img 
          src="https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=300&q=80" 
          alt="Logo THCS Đồng Tân" 
          className="school-logo" 
        />
        <div className="header-text">
          <h1 className="school-title">TRƯỜNG THCS ĐỒNG TÂN</h1>
          <div className="school-slogan">HỘI TỤ - KẾT TINH - TỎA SÁNG</div>
          <div className="school-address">
            📍 Địa chỉ: Xã Đồng Tân - Huyện Ứng Hòa - Thành Phố Hà Nội | 📞 Điện thoại: (024) 3885.6789
          </div>
        </div>
      </div>
    </header>
  );
}
