import React from 'react';
import { X, FileText, Download, Calendar, UserCheck, Eye } from 'lucide-react';

export default function DocumentDetailModal({ document: doc, onClose, onDownload }) {
  if (!doc) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '650px' }}>
        <div className="modal-header" style={{ background: '#d97706' }}>
          <span style={{ fontSize: '13px', fontWeight: '700' }}>📄 VĂN BẢN CHỈ ĐẠO & THÔNG TƯ</span>
          <button className="close-btn" onClick={onClose}><X size={20} /></button>
        </div>
        <div className="modal-body">
          <div style={{ background: '#fffbeb', border: '1px solid #fde68a', padding: '10px 15px', borderRadius: '6px', marginBottom: '15px' }}>
            <span style={{ fontSize: '12px', fontWeight: '700', color: '#b45309' }}>SỐ HIỆU:</span>
            <span style={{ fontSize: '15px', fontWeight: '800', color: '#0056a6', marginLeft: '8px' }}>{doc.code}</span>
          </div>

          <h2 style={{ fontSize: '17px', color: '#003a73', marginBottom: '15px', lineHeight: '1.4' }}>
            {doc.title}
          </h2>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', fontSize: '13px', background: '#f8fafc', padding: '12px', borderRadius: '6px', marginBottom: '20px' }}>
            <div><Calendar size={13} inline /> <strong>Ngày ban hành:</strong> {doc.issueDate}</div>
            <div><UserCheck size={13} inline /> <strong>Người ký:</strong> {doc.signer || 'BGH Trường'}</div>
            <div><FileText size={13} inline /> <strong>Thể loại:</strong> {doc.category}</div>
            <div><Eye size={13} inline /> <strong>Lượt xem:</strong> {doc.views}</div>
          </div>

          <div style={{ background: '#e0f2fe', padding: '15px', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <div style={{ fontWeight: '600', color: '#0369a1', fontSize: '13.5px' }}>Tệp đính kèm văn bản (.PDF / .DOCX)</div>
              <div style={{ fontSize: '12px', color: '#0284c7' }}>Đã có {doc.downloads} lượt tải về thành công</div>
            </div>
            <button 
              style={{ display: 'flex', alignItems: 'center', gap: '6px', background: '#0056a6', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '4px', cursor: 'pointer', fontWeight: '700', fontSize: '13px' }}
              onClick={() => {
                onDownload(doc.id);
                alert(`Đã tải về tệp văn bản ${doc.code} thành công!`);
              }}
            >
              <Download size={16} /> Tải văn bản
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
