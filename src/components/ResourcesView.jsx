import React, { useState } from 'react';
import { BookOpen, Download, Search, ExternalLink, Upload } from 'lucide-react';

export default function ResourcesView({ resources = [], onOpenUpload }) {
  const [filterType, setFilterType] = useState('Tất cả');
  const [search, setSearch] = useState('');

  const resourceList = resources.length > 0 ? resources : [
    {
      id: 1,
      title: 'Đề thi Học kỳ 1 môn Ngữ Văn lớp 9 năm học 2026 - 2027 (Có đáp án)',
      type: 'Đề thi & Đáp án',
      subject: 'Ngữ Văn 9',
      author: 'Tổ Xã Hội',
      date: '02/01/2027',
      downloads: 450,
      fileUrl: '#',
      externalLink: 'https://drive.google.com'
    },
    {
      id: 2,
      title: 'Giáo án điện tử môn Toán 8: Bài 5 - Phương trình bậc nhất một ẩn',
      type: 'Giáo án điện tử',
      subject: 'Toán 8',
      author: 'Tổ Tự Nhiên',
      date: '10/11/2026',
      downloads: 680,
      fileUrl: '#',
      externalLink: ''
    },
    {
      id: 3,
      title: 'Bộ Đề ôn tập Học sinh giỏi môn Tiếng Anh khối 8 và 9 cấp Huyện',
      type: 'Đề thi & Đáp án',
      subject: 'Tiếng Anh 8-9',
      author: 'Nhóm Ngoại Ngữ',
      date: '15/10/2026',
      downloads: 890,
      fileUrl: '#',
      externalLink: 'https://drive.google.com'
    },
    {
      id: 4,
      title: 'Tài liệu hướng dẫn Thực hành Thí nghiệm Vật lý 9 - Bài 12',
      type: 'Tài liệu Giảng dạy',
      subject: 'Vật lý 9',
      author: 'Tổ Tự Nhiên',
      date: '05/11/2026',
      downloads: 310,
      fileUrl: '#',
      externalLink: ''
    }
  ];

  const filtered = resourceList.filter(item => {
    const matchesType = filterType === 'Tất cả' || item.type === filterType;
    const matchesSearch = item.title.toLowerCase().includes(search.toLowerCase()) || item.subject.toLowerCase().includes(search.toLowerCase());
    return matchesType && matchesSearch;
  });

  const handleDownload = (item) => {
    if (item.fileUrl && item.fileUrl !== '#') {
      const link = document.createElement('a');
      link.href = item.fileUrl;
      link.download = item.title + '.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      alert(`Đã bắt đầu tải về tệp tài liệu: ${item.title}`);
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '1100px', margin: '0 auto' }}>
      <div className="widget-box">
        <div className="widget-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <BookOpen size={18} /> KHO TÀI NGUYÊN GIẢNG DẠY & ĐỀ THI - THCS ĐỒNG TÂN
          </span>

          <button 
            style={{ background: '#16a34a', color: 'white', border: 'none', padding: '5px 12px', borderRadius: '4px', cursor: 'pointer', fontWeight: '700', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '5px' }}
            onClick={() => onOpenUpload && onOpenUpload('resources')}
          >
            <Upload size={14} /> 📤 ĐĂNG TẢI ĐỀ THI / GIÁO ÁN MỚI
          </button>
        </div>

        <div className="widget-body" style={{ padding: '20px' }}>
          
          <div style={{ display: 'flex', gap: '15px', marginBottom: '20px', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', gap: '8px' }}>
              {['Tất cả', 'Đề thi & Đáp án', 'Giáo án điện tử', 'Tài liệu Giảng dạy'].map(t => (
                <button
                  key={t}
                  onClick={() => setFilterType(t)}
                  style={{
                    padding: '6px 12px',
                    borderRadius: '4px',
                    border: '1px solid #cbd5e1',
                    background: filterType === t ? '#0056a6' : '#ffffff',
                    color: filterType === t ? '#ffffff' : '#334155',
                    cursor: 'pointer',
                    fontWeight: '500',
                    fontSize: '13px'
                  }}
                >
                  {t}
                </button>
              ))}
            </div>

            <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <input
                type="text"
                placeholder="Tìm đề thi, giáo án..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{ padding: '6px 10px', border: '1px solid #cbd5e1', borderRadius: '4px', fontSize: '13px', width: '200px' }}
              />
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {filtered.map(item => (
              <div 
                key={item.id} 
                style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 15px', border: '1px solid #e2e8f0', borderRadius: '6px', background: '#f8fafc' }}
              >
                <div>
                  <span style={{ fontSize: '11px', background: '#e0f2fe', color: '#0369a1', padding: '2px 8px', borderRadius: '3px', fontWeight: '700', marginRight: '8px' }}>
                    {item.type}
                  </span>
                  <span style={{ fontSize: '12px', color: '#64748b', fontWeight: '600' }}>📚 Môn: {item.subject}</span>
                  <h3 style={{ fontSize: '14.5px', color: '#003a73', margin: '4px 0', fontWeight: '700' }}>
                    {item.title}
                  </h3>
                  <div style={{ fontSize: '12px', color: '#64748b' }}>
                    ✍️ Biên soạn: {item.author} | 📅 Ngày tạo: {item.date} | 📥 {item.downloads} lượt tải
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '8px' }}>
                  <button 
                    style={{ display: 'flex', alignItems: 'center', gap: '6px', background: '#15803d', color: 'white', border: 'none', padding: '8px 14px', borderRadius: '4px', cursor: 'pointer', fontWeight: '700', fontSize: '13px', whiteSpace: 'nowrap' }}
                    onClick={() => handleDownload(item)}
                  >
                    <Download size={15} /> Tải tệp xuống
                  </button>

                  {item.externalLink && (
                    <a 
                      href={item.externalLink}
                      target="_blank"
                      rel="noreferrer"
                      style={{ display: 'flex', alignItems: 'center', gap: '4px', background: '#d97706', color: 'white', textDecoration: 'none', padding: '8px 14px', borderRadius: '4px', fontWeight: '700', fontSize: '13px', whiteSpace: 'nowrap' }}
                    >
                      <ExternalLink size={14} /> Link Drive
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </div>
  );
}
