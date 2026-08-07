import React from 'react';

export default function HeaderBanner({ siteConfig }) {
  const config = siteConfig || {
    schoolName: 'TRƯỜNG THCS ĐỒNG TÂN',
    governingBody: 'ỦY BAN NHÂN DÂN XÃ HỮU LŨNG - TỈNH LẠNG SƠN',
    slogan: 'HỘI TỤ - KẾT TINH - TỎA SÁNG',
    address: 'Xã Hữu Lũng - Tỉnh Lạng Sơn',
    phone: '(0205) 3885.6789',
    email: 'thcsdongtan.huulung@langson.edu.vn',
    logoUrl: 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=300&q=80',
    bannerBg: ''
  };

  return (
    <header className="header-banner" style={config.bannerBg ? { backgroundImage: `url(${config.bannerBg})`, backgroundSize: 'cover' } : {}}>
      <div className="header-content">
        <img 
          src={config.logoUrl || "https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=300&q=80"} 
          alt="Logo THCS Đồng Tân" 
          className="school-logo" 
        />
        <div className="header-text">
          {config.governingBody && (
            <div style={{ fontSize: '11px', color: '#e0f2fe', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '2px', fontWeight: '600' }}>
              {config.governingBody}
            </div>
          )}
          <h1 className="school-title">{config.schoolName}</h1>
          <div className="school-slogan">{config.slogan}</div>
          <div className="school-address">
            📍 Địa chỉ: {config.address} | 📞 Điện thoại: {config.phone}
          </div>
        </div>
      </div>
    </header>
  );
}
