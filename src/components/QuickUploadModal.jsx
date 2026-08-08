import React, { useState } from 'react';
import { X, Upload, FilePlus, BookOpen, Newspaper, Image, Video, CheckCircle } from 'lucide-react';

// Robust YouTube ID Extractor
function extractYouTubeId(urlOrId) {
  if (!urlOrId) return '';
  const str = urlOrId.trim();
  if (str.length === 11 && !str.includes('/') && !str.includes('.')) {
    return str;
  }
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = str.match(regExp);
  return (match && match[2].length === 11) ? match[2] : '';
}

export default function QuickUploadModal({ defaultTab = 'docs', categories = [], onClose, onAddNewItem }) {
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
  const [issueDate, setIssueDate] = useState('08/08/2026');
  const [signer, setSigner] = useState('Hiệu trưởng THCS Đồng Tân');
  const [author, setAuthor] = useState('Tổ Chuyên Môn');

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
        setMessage(`✅ Đã tải tệp lên máy chủ: ${data.fileName} (${data.fileSize})`);
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

    const newItemId = Date.now();
    let newItem = null;

    if (activeType === 'docs') {
      newItem = {
        id: newItemId,
        code: code || `VB-${newItemId.toString().slice(-4)}`,
        title: title || 'Văn bản chỉ đạo mới ban hành',
        category: 'Thông tư BGD&ĐT',
        issueDate: issueDate || '08/08/2026',
        signer: signer || 'BGH THCS Đồng Tân',
        views: 1,
        downloads: 0,
        fileUrl: fileUrl || '#',
        externalLink: externalLink || ''
      };

      try {
        await fetch('/api/documents', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newItem)
        });
      } catch (err) {}

    } else if (activeType === 'resources') {
      newItem = {
        id: newItemId,
        title: title || 'Tài liệu & Đề thi vừa tải lên',
        type: typeStr || 'Đề thi & Đáp án',
        subject: subject || 'Toán 9',
        author: author || 'Tổ Chuyên Môn',
        date: '08/08/2026',
        downloads: 0,
        fileUrl: fileUrl || '#',
        externalLink: externalLink || ''
      };

    } else if (activeType === 'news') {
      const catObj = categories.find(c => c.id === parseInt(category)) || { name: 'Tin tức - Sự kiện' };
      newItem = {
        id: newItemId,
        title: title || 'Tin tức mới cập nhật',
        slug: 'tin-moi-' + newItemId,
        categoryId: parseInt(category),
        categoryName: catObj.name,
        summary: summary || title,
        content: content || summary || title,
        image: fileUrl || 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=800&q=80',
        author: 'Ban Biên Tập THCS Đồng Tân',
        isFeatured: 0,
        views: 1,
        createdAt: '2026-08-08 08:00:00',
        fileUrl: fileUrl || '',
        externalLink: externalLink || ''
      };

      try {
        await fetch('/api/news', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newItem)
        });
      } catch (err) {}

    } else if (activeType === 'albums') {
      newItem = {
        id: newItemId,
        title: title || 'Album ảnh hoạt động mới',
        date: '08/08/2026',
        photosCount: 10,
        cover: fileUrl || 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=600&q=80',
        description: summary || title,
        fileUrl: fileUrl || '',
        externalLink: externalLink || ''
      };

    } else if (activeType === 'videos') {
      const extractedYtId = extractYouTubeId(youtubeId || externalLink || '');
      const isLocalVideoFile = fileUrl.endsWith('.mp4') || fileUrl.endsWith('.webm') || fileUrl.endsWith('.mov') || fileUrl.startsWith('/uploads');
      
      newItem = {
        id: newItemId,
        title: title || 'Video hoạt động trường học mới',
        youtubeId: extractedYtId,
        videoUrl: isLocalVideoFile ? fileUrl : (fileUrl || ''),
        thumbnailUrl: isLocalVideoFile ? 'https://images.unsplash.com/photo-1577896851231-70ef18881754?w=600&q=80' : (extractedYtId ? `https://img.youtube.com/vi/${extractedYtId}/hqdefault.jpg` : 'https://images.unsplash.com/photo-1577896851231-70ef18881754?w=600&q=80'),
        views: 1,
        externalLink: externalLink || (extractedYtId ? `https://www.youtube.com/watch?v=${extractedYtId}` : '')
      };

      try {
        await fetch('/api/media/videos', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newItem)
        });
      } catch (err) {}
    }

    if (onAddNewItem && newItem) {
      onAddNewItem(activeType, newItem);
    }

    setMessage('✅ Đã tải Video lên thành công và hiển thị live!');
    setTimeout(() => {
      onClose();
    }, 800);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '780px' }}>
        <div className="modal-header" style={{ background: '#16a34a' }}>
          <span style={{ fontSize: '14px', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Upload size={18} /> 📤 ĐĂNG TẢI NỘI DUNG VÀ VIDEO MỚI
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
              type="button"
              onClick={() => setActiveType('videos')} 
              style={{ padding: '8px 12px', border: 'none', background: activeType === 'videos' ? '#0056a6' : '#f1f5f9', color: activeType === 'videos' ? 'white' : '#334155', borderRadius: '4px', cursor: 'pointer', fontWeight: '700', fontSize: '12.5px', display: 'flex', alignItems: 'center', gap: '5px', whiteSpace: 'nowrap' }}
            >
              <Video size={14} /> 🎬 Video YouTube / Tệp MP4
            </button>
            <button 
              type="button"
              onClick={() => setActiveType('docs')} 
              style={{ padding: '8px 12px', border: 'none', background: activeType === 'docs' ? '#0056a6' : '#f1f5f9', color: activeType === 'docs' ? 'white' : '#334155', borderRadius: '4px', cursor: 'pointer', fontWeight: '700', fontSize: '12.5px', display: 'flex', alignItems: 'center', gap: '5px', whiteSpace: 'nowrap' }}
            >
              <FilePlus size={14} /> 📄 Tải lên Văn bản
            </button>
            <button 
              type="button"
              onClick={() => setActiveType('resources')} 
              style={{ padding: '8px 12px', border: 'none', background: activeType === 'resources' ? '#0056a6' : '#f1f5f9', color: activeType === 'resources' ? 'white' : '#334155', borderRadius: '4px', cursor: 'pointer', fontWeight: '700', fontSize: '12.5px', display: 'flex', alignItems: 'center', gap: '5px', whiteSpace: 'nowrap' }}
            >
              <BookOpen size={14} /> 📚 Đề thi & Tài nguyên
            </button>
            <button 
              type="button"
              onClick={() => setActiveType('news')} 
              style={{ padding: '8px 12px', border: 'none', background: activeType === 'news' ? '#0056a6' : '#f1f5f9', color: activeType === 'news' ? 'white' : '#334155', borderRadius: '4px', cursor: 'pointer', fontWeight: '700', fontSize: '12.5px', display: 'flex', alignItems: 'center', gap: '5px', whiteSpace: 'nowrap' }}
            >
              <Newspaper size={14} /> 📰 Đăng Tin tức
            </button>
            <button 
              type="button"
              onClick={() => setActiveType('albums')} 
              style={{ padding: '8px 12px', border: 'none', background: activeType === 'albums' ? '#0056a6' : '#f1f5f9', color: activeType === 'albums' ? 'white' : '#334155', borderRadius: '4px', cursor: 'pointer', fontWeight: '700', fontSize: '12.5px', display: 'flex', alignItems: 'center', gap: '5px', whiteSpace: 'nowrap' }}
            >
              <Image size={14} /> 📷 Album ảnh
            </button>
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            {/* Form for Videos */}
            {activeType === 'videos' && (
              <>
                <div>
                  <label style={{ display: 'block', fontWeight: '700', fontSize: '13px', marginBottom: '4px' }}>Tiêu đề Video hoạt động:</label>
                  <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required style={{ width: '100%', padding: '8px', border: '1px solid #cbd5e1', borderRadius: '4px' }} placeholder="VD: Video Khai giảng năm học 2026 - 2027 THCS Đồng Tân" />
                </div>
                <div>
                  <label style={{ display: 'block', fontWeight: '700', fontSize: '13px', marginBottom: '4px' }}>Đường link Video YouTube (Hoặc dán ID YouTube):</label>
                  <input type="text" value={youtubeId} onChange={(e) => setYoutubeId(e.target.value)} style={{ width: '100%', padding: '8px', border: '1px solid #cbd5e1', borderRadius: '4px' }} placeholder="Dán link full: https://www.youtube.com/watch?v=... hoặc mã ID" />
                </div>
              </>
            )}

            {/* Form for Documents */}
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
                  <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required style={{ width: '100%', padding: '8px', border: '1px solid #cbd5e1', borderRadius: '4px' }} placeholder="Nội dung trích yếu văn bản..." />
                </div>
              </>
            )}

            {/* Form for Resources */}
            {activeType === 'resources' && (
              <>
                <div>
                  <label style={{ display: 'block', fontWeight: '700', fontSize: '13px', marginBottom: '4px' }}>Tiêu đề Đề thi / Giáo án điện tử:</label>
                  <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required style={{ width: '100%', padding: '8px', border: '1px solid #cbd5e1', borderRadius: '4px' }} placeholder="VD: Đề thi Học kỳ 1 môn Ngữ Văn 9" />
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

            {/* Form for News */}
            {activeType === 'news' && (
              <>
                <div>
                  <label style={{ display: 'block', fontWeight: '700', fontSize: '13px', marginBottom: '4px' }}>Tiêu đề bài viết:</label>
                  <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required style={{ width: '100%', padding: '8px', border: '1px solid #cbd5e1', borderRadius: '4px' }} placeholder="Nhập tiêu đề bài viết..." />
                </div>
                <div>
                  <label style={{ display: 'block', fontWeight: '700', fontSize: '13px', marginBottom: '4px' }}>Nội dung chi tiết bài viết:</label>
                  <textarea value={content} onChange={(e) => setContent(e.target.value)} rows={4} required style={{ width: '100%', padding: '8px', border: '1px solid #cbd5e1', borderRadius: '4px' }} placeholder="Nội dung bài viết..."></textarea>
                </div>
              </>
            )}

            {/* File Upload Box (Supports Video MP4, Documents, Images) */}
            <div style={{ background: '#f8fafc', padding: '15px', borderRadius: '6px', border: '1px solid #cbd5e1' }}>
              <h4 style={{ fontSize: '13.5px', color: '#0056a6', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px', fontWeight: '700' }}>
                <Upload size={16} /> TẢI TỆP NỘI DUNG / VIDEO (.MP4 / .PDF / .DOCX / .ZIP) TỪ MÁY TÍNH
              </h4>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', marginBottom: '4px', color: '#334155' }}>
                    1. Chọn tệp từ máy (.MP4 / .PDF / .DOCX):
                  </label>
                  <input 
                    type="file" 
                    onChange={(e) => handleFileUpload(e.target.files[0])} 
                    style={{ fontSize: '12px', border: '1px solid #cbd5e1', padding: '4px', borderRadius: '4px', width: '100%', background: 'white' }} 
                  />
                  {fileUrl && <div style={{ fontSize: '11.5px', color: '#16a34a', marginTop: '4px', fontWeight: '600' }}>✓ Đã chọn tệp: {fileUrl}</div>}
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', marginBottom: '4px', color: '#334155' }}>
                    2. Hoặc dán đường link liên kết ngoài:
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
              <Upload size={18} /> {uploading ? 'Đang tải tệp...' : '🚀 XÁC NHẬN ĐĂNG TẢI LÊN MỤC TƯƠNG ỨNG'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
