import React from 'react';
import { X, Calendar, User, Eye, Share2 } from 'lucide-react';

export default function NewsDetailModal({ article, onClose }) {
  if (!article) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <span style={{ fontSize: '13px', background: '#0284c7', padding: '2px 8px', borderRadius: '4px' }}>
            {article.categoryName || 'Tin tức'}
          </span>
          <button className="close-btn" onClick={onClose}><X size={20} /></button>
        </div>
        <div className="modal-body">
          <h1 style={{ fontSize: '22px', color: '#003a73', marginBottom: '10px', lineHeight: '1.3' }}>
            {article.title}
          </h1>

          <div style={{ display: 'flex', gap: '15px', fontSize: '12px', color: '#64748b', borderBottom: '1px solid #e2e8f0', paddingBottom: '10px', marginBottom: '15px' }}>
            <span><Calendar size={13} inline /> Ngày đăng: {article.createdAt?.split(' ')[0] || '04/08/2026'}</span>
            <span><User size={13} inline /> Tác giả: {article.author || 'Ban Biên Tập'}</span>
            <span><Eye size={13} inline /> Lượt xem: {article.views}</span>
          </div>

          {article.image && (
            <img 
              src={article.image} 
              alt={article.title} 
              style={{ width: '100%', maxHeight: '380px', objectFit: 'cover', borderRadius: '6px', marginBottom: '15px' }} 
            />
          )}

          <div style={{ fontWeight: '600', fontStyle: 'italic', background: '#f8fafc', padding: '12px', borderLeft: '4px solid #0284c7', marginBottom: '15px', fontSize: '13.5px' }}>
            {article.summary}
          </div>

          <div style={{ fontSize: '14px', lineHeight: '1.7', color: '#1e293b' }}>
            {article.content}
          </div>

          <div style={{ marginTop: '25px', paddingTop: '15px', borderTop: '1px dashed #cbd5e1', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '12px', color: '#64748b' }}>Nguồn: Cổng Thông tin Điện tử THCS Đồng Tân</span>
            <button 
              style={{ display: 'flex', alignItems: 'center', gap: '6px', background: '#e0f2fe', color: '#0369a1', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', fontWeight: '500' }}
              onClick={() => alert('Đã sao chép liên kết bài viết!')}
            >
              <Share2 size={14} /> Chia sẻ bài viết
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
