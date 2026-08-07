import React from 'react';
import { Home, Info, Newspaper, FileText, Image, Video, BookOpen, Calendar, Mail, ShieldAlert, Upload } from 'lucide-react';

export default function Navbar({ activeTab, setActiveTab, onOpenAdmin, onOpenUpload }) {
  const navs = [
    { id: 'home', label: 'Trang chủ', icon: <Home size={15} /> },
    { id: 'intro', label: 'Giới thiệu', icon: <Info size={15} /> },
    { id: 'news', label: 'Tin Tức', icon: <Newspaper size={15} /> },
    { id: 'documents', label: 'Văn bản', icon: <FileText size={15} /> },
    { id: 'albums', label: 'Albums', icon: <Image size={15} /> },
    { id: 'videos', label: 'Videos', icon: <Video size={15} /> },
    { id: 'resources', label: 'Tài nguyên', icon: <BookOpen size={15} /> },
    { id: 'schedule', label: 'Lịch làm việc', icon: <Calendar size={15} /> },
    { id: 'contact', label: 'Liên hệ', icon: <Mail size={15} /> },
  ];

  return (
    <nav className="main-navbar">
      {navs.map((nav) => (
        <a
          key={nav.id}
          className={`nav-item ${nav.id === 'home' ? 'home-icon' : ''} ${activeTab === nav.id ? 'active' : ''}`}
          onClick={() => setActiveTab(nav.id)}
        >
          {nav.icon}
          <span>{nav.label}</span>
        </a>
      ))}

      {/* Prominent Quick Upload Button directly on Navbar */}
      <a className="nav-item" style={{ background: '#16a34a', fontWeight: '700', marginLeft: 'auto' }} onClick={onOpenUpload}>
        <Upload size={15} />
        <span>📤 TẢI NỘI DUNG LÊN</span>
      </a>

      {/* Admin Portal Button */}
      <a className="nav-item admin-btn" onClick={onOpenAdmin}>
        <ShieldAlert size={15} />
        <span>Quản Trị</span>
      </a>
    </nav>
  );
}
