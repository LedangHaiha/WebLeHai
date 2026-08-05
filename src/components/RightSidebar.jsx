import React, { useState } from 'react';
import { Video, FileText, Download, BarChart2, Eye } from 'lucide-react';

export default function RightSidebar({ videos = [], documents = [], onSelectDocument }) {
  const [selectedVideo, setSelectedVideo] = useState(videos[0] || null);

  const activeVid = selectedVideo || videos[0] || {
    title: 'Phim tư liệu: 40 năm truyền thống THCS Đồng Tân',
    youtubeId: 'dQw4w9WgXcQ'
  };

  return (
    <aside className="right-sidebar-col">
      {/* Widget 1: Videos */}
      <div className="widget-box">
        <div className="widget-header">
          <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Video size={15} /> Videos Nhà Trường
          </span>
        </div>
        <div className="widget-body">
          <div className="video-player-container">
            <iframe
              src={`https://www.youtube.com/embed/${activeVid.youtubeId}?rel=0`}
              title={activeVid.title}
              allowFullScreen
            ></iframe>
          </div>
          <div style={{ fontSize: '12px', fontWeight: '600', color: '#1e293b', marginBottom: '8px' }}>
            {activeVid.title}
          </div>
          {videos.length > 1 && (
            <div style={{ fontSize: '11px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
              {videos.map(v => (
                <div 
                  key={v.id} 
                  style={{ 
                    cursor: 'pointer', 
                    color: v.id === activeVid.id ? '#0056a6' : '#64748b',
                    fontWeight: v.id === activeVid.id ? '700' : '400',
                    borderBottom: '1px dashed #f1f5f9',
                    paddingBottom: '3px'
                  }}
                  onClick={() => setSelectedVideo(v)}
                >
                  ▶ {v.title}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Widget 2: Văn bản mới */}
      <div className="widget-box">
        <div className="widget-header orange">
          <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <FileText size={15} /> Văn bản mới
          </span>
        </div>
        <div className="widget-body">
          {documents.slice(0, 4).map((doc) => (
            <div key={doc.id} className="document-item">
              <div className="document-code">{doc.code}</div>
              <div className="document-title" onClick={() => onSelectDocument(doc.id)}>
                {doc.title}
              </div>
              <div className="document-meta">
                <span>📅 Ngày đăng: {doc.issueDate}</span>
                <span style={{ display: 'flex', gap: '8px' }}>
                  <span><Eye size={11} inline /> {doc.views || 0}</span>
                  <span><Download size={11} inline /> {doc.downloads || 0}</span>
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Widget 3: Thống kê truy cập */}
      <div className="widget-box">
        <div className="widget-header green">
          <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <BarChart2 size={15} /> Thống kê truy cập
          </span>
        </div>
        <div className="widget-body">
          <div className="stats-box">
            <div className="stat-row">
              <span>🔴 Đang truy cập:</span>
              <strong style={{ color: '#16a34a' }}>24</strong>
            </div>
            <div className="stat-row">
              <span>☀️ Trong ngày:</span>
              <strong>582</strong>
            </div>
            <div className="stat-row">
              <span>🌐 Tổng lượt truy cập:</span>
              <strong style={{ color: '#0284c7' }}>184,920</strong>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
