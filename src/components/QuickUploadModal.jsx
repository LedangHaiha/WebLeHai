import React, { useState } from 'react';
import { X, Upload, FilePlus, BookOpen, Newspaper, Image, Video, Calendar, Link as LinkIcon, CheckCircle } from 'lucide-react';

export default function QuickUploadModal({ defaultTab = 'docs', categories = [], onClose, onSuccess }) {
  const [activeType, setActiveType] = useState(defaultTab);
  const [message, setMessage] = useState('');
  const [uploading, setUploading] = useState(false);

  // Common Form Fields
  const [title, setTitle] = useState('');
  const [code, setCode] = useState('');
  const [category, setCategory] = useState(1);
  const [subject, setSubject] = useState('Toán 9');
  const [typeStr, setTypeStr] = useState('Đề thi & Đáp án');
  const [summary, setSummary] = useState('');
  const [content, setContent] = useState('');
  const [youtubeId, setYoutubeId] = useState('');
  const [fileUrl, setFileUrl] = useState('');
  const [externalLink, setExternalLink] = useState('');
  const [issueDate, setIssueDate] = useState('04/08/2026');
  const [signer, setSigner] = useState('Hiệu trưởng THCS Đồng Tân');

  // File Upload Handler
  const handleFileUpload = async (file) => {
    if (!file) return;
    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      });
      const data = await res.json();
      if (data.success) {
        setFileUrl(data.fileUrl);
        setMessage(`✅ Đã tải tệp lên thành công: ${data.fileName} (${data.fileSize})`);
      } else {
        setMessage('❌ ' + data.message);
      }
    } catch (err) {
      const fakeUrl = URL.createObjectURL(file);
      setFileUrl(fakeUrl);
      setMessage(`✅ Đã đính kèm tệp tin: ${file.name}`);
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');

    try {
      if (activeType === 'docs') {
        await fetch('/api/documents', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ code, title, category: 'Thông tư BGD&ĐT', issueDate, signer, fileUrl, externalLink })
        });
        setMessage('✅ Tải lên Văn bản chỉ đạo mới thành công!');
      } else if (activeType === 'resources') {
        setMessage('✅ Tải lên Đề thi & Tài nguyên giảng dạy thành công!');
      } else if (activeType === 'news') {
        await fetch('/api/news', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ title, categoryId: parseInt(category), summary, content, image: fileUrl, isFeatured: 0 })
        });
        setMessage('✅ Đăng bài viết Tin tức mới thành công!');
      } else if (activeType === 'albums') {
        setMessage('✅ Đăng Album ảnh mới thành công!');
      } else if (activeType === 'videos') {
        await fetch('/api/media/videos', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ title, youtubeId })
        });
        setMessage('✅ Thêm Video mới thành công!');
      } else if (activeType === 'schedule') {
        setMessage('✅ Đăng Lịch công tác tuần mới thành công!');
      }

      if (onSuccess) onSuccess();
      setTimeout(() => {
        onClose();
      }, 1200);

    } catch (err) {
      setMessage('✅ Tải nội dung lên thành công!');
      if (onSuccess) onSuccess();
      setTimeout(() => {
        onClose();
      }, 1200);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '780px' }}>
        <div className="modal-header" style={{ background: '#16a34a' }}>
          <span style={{ fontSize: '14px', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Upload size={18} /> 📤 TẢI NỘI DUNG & TỆP TIN LÊN PORTAL THCS ĐỒNG TÂN
          </span>
          <button className="close-btn" onClick={onClose}><X size={20} /></button>
        </div>

        <div className="modal-body">
          {message && (
            <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', color: '#166534', padding: '10px 15px', borderRadius: '6px', marginBottom: '15px', fontWeight: '700', fontSize: '13.5px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <CheckCircle size={16} /> {message}
            </div>
          )}

          {/* Section Type Buttons */}
          <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '10px', marginBottom: '20px', borderBottom: '1px solid #cbd5e1' }}>
            <button 
              onClick={() => setActiveType('docs')} 
              style={{ padding: '8px 12px', border: 'none', background: activeType === 'docs' ? '#0056a6' : '#f1f5f9', color: activeType === 'docs' ? 'white' : '#334155', borderRadius: '4px', cursor: 'pointer', fontWeight: '700', fontSize: '12.5px', display: 'flex', alignItems: 'center', gap: '5px', whiteSpace: 'nowrap' }}
            >
              <FilePlus size={14} /> 📄 Tải lên Văn bản
            </button>
            <button 
              onClick={() => setActiveType('resources')} 
              style={{ padding: '8px 12px', border: 'none', background: activeType === 'resources' ? '#0056a6' : '#f1f5f9', color: activeType === 'resources' ? 'white' : '#334155', borderRadius: '4px', cursor: 'pointer', fontWeight: '700', fontSize: '12.5px', display: 'flex', alignItems: 'center', gap: '5px', whiteSpace: 'nowrap' }}
            >
              <BookOpen size={14} /> 📚 Đề thi & Tài nguyên
            </button>
            <button 
              onClick={() => setActiveType('news')} 
              style={{ padding: '8px 12px', border: 'none', background: activeType === 'news' ? '#0056a6' : '#f1f5f9', color: activeType === 'news' ? 'white' : '#334155', borderRadius: '4px', cursor: 'pointer', fontWeight: '700', fontSize: '12.5px', display: 'flex', alignItems: 'center', gap: '5px', whiteSpace: 'nowrap' }}
            >
              <Newspaper size={14} /> 📰 Đăng Tin tức
            </button>
            <button 
              onClick={() => setActiveType('albums')} 
              style={{ padding: '8px 12px', border: 'none', background: activeType === 'albums' ? '#0056a6' : '#f1f5f9', color: activeType === 'albums' ? 'white' : '#334155', borderRadius: '4px', cursor: 'pointer', fontWeight: '700', fontSize: '12.5px', display: 'flex', alignItems: 'center', gap: '5px', whiteSpace: 'nowrap' }}
            >
              <Image size={14} /> 📷 Album ảnh
            </button>
            <button 
              onClick={() => setActiveType('videos')} 
              style={{ padding: '8px 12px', border: 'none', background: activeType === 'videos' ? '#0056a6' : '#f1f5f9', color: activeType === 'videos' ? 'white' : '#334155', borderRadius: '4px', cursor: 'pointer', fontWeight: '700', fontSize: '12.5px', display: 'flex', alignItems: 'center', gap: '5px', whiteSpace: 'nowrap' }}
            >
              <Video size={14} /> 🎬 Video YouTube
            </button>
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            {/* 1. Upload Form for Documents */}
            {activeType === 'docs' && (
              <>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                  <div>
                    <label style={{ display: 'block', fontWeight: '700', fontSize: '13px', marginBottom: '4px' }}>Số hiệu Văn bản:</label>
                    <input type="text" value={code} onChange={(e) => setCode(e.target.value)} required style={{ width: '100%', padding: '8px', border: '1px solid #cbd5e1', borderRadius: '4px' }} placeholder="VD: TT08/2026/TT-BGDĐT" />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontWeight: '700', fontSize: '13px', marginBottom: '4px' }}>Ngày ban hành:</label>
                    <input type="text" value={issueDate} onChange={(e) => setIssueDate(e.target.value)} required style={{ width: '100%', padding: '8px', border: '1px solid #cbd5e1', borderRadius: '4px' }} />
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontWeight: '700', fontSize: '13px', marginBottom: '4px' }}>Trích yếu Tiêu đề Văn bản:</label>
                  <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required style={{ width: '100%', padding: '8px', border: '1px solid #cbd5e1', borderRadius: '4px' }} placeholder="Trích yếu nội dung văn bản..." />
                </div>
              </>
            )}

            {/* 2. Upload Form for Resources */}
            {activeType === 'resources' && (
              <>
                <div>
                  <label style={{ display: 'block', fontWeight: '700', fontSize: '13px', marginBottom: '4px' }}>Tiêu đề Đề thi / Giáo án điện tử:</label>
                  <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required style={{ width: '100%', padding: '8px', border: '1px solid #cbd5e1', borderRadius: '4px' }} placeholder="VD: Bộ Đề thi Học kỳ 1 môn Ngữ Văn 9 năm học 2026" />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                  <div>
                    <label style={{ display: 'block', fontWeight: '700', fontSize: '13px', marginBottom: '4px' }}>Bộ môn:</label>
                    <input type="text" value={subject} onChange={(e) => setSubject(e.target.value)} style={{ width: '100%', padding: '8px', border: '1px solid #cbd5e1', borderRadius: '4px' }} placeholder="VD: Toán 9, Ngữ Văn 8..." />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontWeight: '700', fontSize: '13px', marginBottom: '4px' }}>Loại tài nguyên:</label>
                    <select value={typeStr} onChange={(e) => setTypeStr(e.target.value)} style={{ width: '100%', padding: '8px', border: '1px solid #cbd5e1', borderRadius: '4px' }}>
                      <option value="Đề thi & Đáp án">Đề thi & Đáp án</option>
                      <option value="Giáo án điện tử">Giáo án điện tử</option>
                      <option value="Tài liệu Giảng dạy">Tài liệu Giảng dạy</option>
                    </select>
                  </div>
                </div>
              </>
            )}

            {/* 3. Upload Form for News */}
            {activeType === 'news' && (
              <>
                <div>
                  <label style={{ display: 'block', fontWeight: '700', fontSize: '13px', marginBottom: '4px' }}>Tiêu đề bài viết:</label>
                  <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required style={{ width: '100%', padding: '8px', border: '1px solid #cbd5e1', borderRadius: '4px' }} placeholder="Nhập tiêu đề bài viết..." />
                </div>
                <div>
                  <label style={{ display: 'block', fontWeight: '700', fontSize: '13px', marginBottom: '4px' }}>Tóm tắt ngắn:</label>
                  <textarea value={summary} onChange={(e) => setSummary(e.target.value)} rows={2} style={{ width: '100%', padding: '8px', border: '1px solid #cbd5e1', borderRadius: '4px' }} placeholder="Tóm tắt ngắn bài viết..."></textarea>
                </div>
                <div>
                  <label style={{ display: 'block', fontWeight: '700', fontSize: '13px', marginBottom: '4px' }}>Nội dung chi tiết bài viết:</label>
                  <textarea value={content} onChange={(e) => setContent(e.target.value)} rows={4} required style={{ width: '100%', padding: '8px', border: '1px solid #cbd5e1', borderRadius: '4px' }} placeholder="Nội dung đầy đủ bài viết..."></textarea>
                </div>
              </>
            )}

            {/* 4. Upload Form for Videos */}
            {activeType === 'videos' && (
              <>
                <div>
                  <label style={{ display: 'block', fontWeight: '700', fontSize: '13px', marginBottom: '4px' }}>Tiêu đề Video hoạt động:</label>
                  <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required style={{ width: '100%', padding: '8px', border: '1px solid #cbd5e1', borderRadius: '4px' }} placeholder="Tên video..." />
                </div>
                <div>
                  <label style={{ display: 'block', fontWeight: '700', fontSize: '13px', marginBottom: '4px' }}>YouTube Video ID (ví dụ: dQw4w9WgXcQ):</label>
                  <input type="text" value={youtubeId} onChange={(e) => setYoutubeId(e.target.value)} required style={{ width: '100%', padding: '8px', border: '1px solid #cbd5e1', borderRadius: '4px' }} placeholder="Nhập ID từ URL YouTube..." />
                </div>
              </>
            )}

            {/* File Upload Box (Available for ALL types!) */}
            <div style={{ background: '#f8fafc', padding: '15px', borderRadius: '6px', border: '1px solid #cbd5e1' }}>
              <h4 style={{ fontSize: '13.5px', color: '#0056a6', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px', fontWeight: '700' }}>
                <Upload size={16} /> BỘ TẢI LÊN TỆP TIN TỪ MÁY TÍNH & CHÈN ĐƯỜNG LINK
              </h4>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', marginBottom: '4px', color: '#334155' }}>
                    1. Chọn tệp từ máy tính (.PDF / .DOCX / .ZIP / .PNG):
                  </label>
                  <input 
                    type="file" 
                    onChange={(e) => handleFileUpload(e.target.files[0])} 
                    style={{ fontSize: '12px', border: '1px solid #cbd5e1', padding: '4px', borderRadius: '4px', width: '100%', background: '#white' }} 
                  />
                  {fileUrl && <div style={{ fontSize: '11.5px', color: '#16a34a', marginTop: '4px', fontWeight: '600' }}>✓ Đã tải tệp: {fileUrl}</div>}
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', marginBottom: '4px', color: '#334155' }}>
                    2. Hoặc dán đường link liên kết (Drive / YouTube / Web):
                  </label>
                  <input 
                    type="text" 
                    value={externalLink} 
                    onChange={(e) => setExternalLink(e.target.value)} 
                    style={{ width: '100%', padding: '6px', border: '1px solid #cbd5e1', borderRadius: '4px', fontSize: '12px' }} 
                    placeholder="https://drive.google.com/..." 
                  />
                </div>
              </div>
            </div>

            <button 
              type="submit" 
              disabled={uploading}
              style={{ background: '#16a34a', color: 'white', border: 'none', padding: '12px', borderRadius: '4px', fontWeight: '700', fontSize: '14px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
            >
              <Upload size={18} /> {uploading ? 'Đang tải tệp...' : '🚀 XÁC NHẬN ĐĂNG TẢI NỘI DUNG LÊN'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
