import React from 'react';
import { X, FileText, Download, Calendar, UserCheck, Eye, ExternalLink } from 'lucide-react';

export default function DocumentDetailModal({ document: doc, onClose, onDownload }) {
  if (!doc) return null;

  const handleFileDownload = () => {
    onDownload(doc.id);
    if (doc.fileUrl && doc.fileUrl !== '#') {
      const link = document.createElement('a');
      link.href = doc.fileUrl;
      link.download = doc.code + '.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      alert(`Đã bắt đầu tải tệp văn bản ${doc.code} (.PDF) về máy tính!`);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '680px' }}>
        <div className="modal-header" style={{ background: '#d97706' }}>
          <span style={{ fontSize: '13px', fontWeight: '700' }}>📄 VĂN BẢN CHỈ ĐẠO & QUY CHẾ</span>
          <button className="close-btn" onClick={onClose}><X size={20} /></button>
        </div>
        <div className="modal-body">
          <div style={{ background: '#fffbeb', border: '1px solid #fde68a', padding: '10px 15px', borderRadius: '6px', marginBottom: '15px' }}>
            <span style={{ fontSize: '12px', fontWeight: '700', color: '#b45309' }}>SỐ HIỆU VĂN BẢN:</span>
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

          {/* Action buttons for File Download & External Link */}
          <div style={{ display: 'flex', gap: '12px', flexDirection: 'column' }}>
            <div style={{ background: '#e0f2fe', padding: '15px', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <div style={{ fontWeight: '600', color: '#0369a1', fontSize: '13.5px' }}>Tệp đính kèm văn bản (.PDF / .DOCX)</div>
                <div style={{ fontSize: '12px', color: '#0284c7' }}>Đã có {doc.downloads} lượt tải về thành công</div>
              </div>
              <button 
                style={{ display: 'flex', alignItems: 'center', gap: '6px', background: '#0056a6', color: 'white', border: 'none', padding: '10px 18px', borderRadius: '4px', cursor: 'pointer', fontWeight: '700', fontSize: '13.5px' }}
                onClick={handleFileDownload}
              >
                <Download size={16} /> Tải tệp xuống
              </button>
            </div>

            {doc.externalLink && (
              <div style={{ background: '#fef3c7', border: '1px solid #fde68a', padding: '12px 15px', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '13px', color: '#92400e', fontWeight: '600' }}>🔗 Đường link truy cập văn bản gốc:</span>
                <a 
                  href={doc.externalLink} 
                  target="_blank" 
                  rel="noreferrer"
                  style={{ display: 'flex', alignItems: 'center', gap: '4px', background: '#d97706', color: 'white', textDecoration: 'none', padding: '6px 14px', borderRadius: '4px', fontWeight: '700', fontSize: '12.5px' }}
                >
                  <ExternalLink size={14} /> Mở đường link
                </a>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
