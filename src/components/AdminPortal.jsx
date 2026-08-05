import React, { useState } from 'react';
import { ShieldCheck, LogOut, PlusCircle, FilePlus, Video, Bell, Trash2, CheckCircle, AlertCircle } from 'lucide-react';

export default function AdminPortal({ token, user, onLogin, onLogout, categories = [], onRefreshData }) {
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('admin123');
  const [loginError, setLoginError] = useState('');
  const [adminTab, setAdminTab] = useState('news');
  const [message, setMessage] = useState('');

  // News Form State
  const [newsTitle, setNewsTitle] = useState('');
  const [newsCategory, setNewsCategory] = useState(1);
  const [newsSummary, setNewsSummary] = useState('');
  const [newsContent, setNewsContent] = useState('');
  const [newsImage, setNewsImage] = useState('');
  const [newsFeatured, setNewsFeatured] = useState(false);

  // Document Form State
  const [docCode, setDocCode] = useState('');
  const [docTitle, setDocTitle] = useState('');
  const [docCategory, setDocCategory] = useState('Thông tư BGD&ĐT');
  const [docIssueDate, setDocIssueDate] = useState('04/08/2026');
  const [docSigner, setDocSigner] = useState('Hiệu trưởng THCS Đồng Tân');

  // Video Form State
  const [vidTitle, setVidTitle] = useState('');
  const [vidYoutubeId, setVidYoutubeId] = useState('');

  // Announcement Form State
  const [annContent, setAnnContent] = useState('');

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoginError('');
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      const data = await res.json();
      if (data.success) {
        onLogin(data.token, data.user);
      } else {
        setLoginError(data.message || 'Đăng nhập thất bại');
      }
    } catch (err) {
      setLoginError('Lỗi kết nối tới máy chủ API Gateway');
    }
  };

  const handleCreateNews = async (e) => {
    e.preventDefault();
    setMessage('');
    try {
      const res = await fetch('/api/news', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          title: newsTitle,
          categoryId: parseInt(newsCategory),
          summary: newsSummary,
          content: newsContent,
          image: newsImage,
          isFeatured: newsFeatured
        })
      });
      const data = await res.json();
      if (data.success) {
        setMessage('✅ ' + data.message);
        setNewsTitle('');
        setNewsSummary('');
        setNewsContent('');
        setNewsImage('');
        onRefreshData();
      } else {
        setMessage('❌ ' + data.message);
      }
    } catch (err) {
      setMessage('❌ Lỗi khi gửi dữ liệu lên server');
    }
  };

  const handleCreateDocument = async (e) => {
    e.preventDefault();
    setMessage('');
    try {
      const res = await fetch('/api/documents', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          code: docCode,
          title: docTitle,
          category: docCategory,
          issueDate: docIssueDate,
          signer: docSigner
        })
      });
      const data = await res.json();
      if (data.success) {
        setMessage('✅ ' + data.message);
        setDocCode('');
        setDocTitle('');
        onRefreshData();
      } else {
        setMessage('❌ ' + data.message);
      }
    } catch (err) {
      setMessage('❌ Lỗi khi phát hành văn bản');
    }
  };

  const handleCreateVideo = async (e) => {
    e.preventDefault();
    setMessage('');
    try {
      const res = await fetch('/api/media/videos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ title: vidTitle, youtubeId: vidYoutubeId })
      });
      const data = await res.json();
      if (data.success) {
        setMessage('✅ ' + data.message);
        setVidTitle('');
        setVidYoutubeId('');
        onRefreshData();
      }
    } catch (err) {
      setMessage('❌ Lỗi khi thêm video');
    }
  };

  const handleCreateAnnouncement = async (e) => {
    e.preventDefault();
    setMessage('');
    try {
      const res = await fetch('/api/announcements', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ content: annContent })
      });
      const data = await res.json();
      if (data.success) {
        setMessage('✅ ' + data.message);
        setAnnContent('');
        onRefreshData();
      }
    } catch (err) {
      setMessage('❌ Lỗi khi tạo thông báo');
    }
  };

  if (!token) {
    return (
      <div style={{ maxWidth: '450px', margin: '40px auto', background: 'white', padding: '25px', borderRadius: '8px', boxShadow: '0 4px 15px rgba(0,0,0,0.1)', border: '1px solid #cbd5e1' }}>
        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <ShieldCheck size={45} color="#0056a6" />
          <h2 style={{ fontSize: '20px', color: '#003a73', marginTop: '10px' }}>ĐĂNG NHẬP HỆ THỐNG QUẢN TRỊ</h2>
          <p style={{ fontSize: '12px', color: '#64748b' }}>Dành cho Ban Giám Hiệu & Giáo viên Biên tập tin bài</p>
        </div>

        {loginError && (
          <div style={{ background: '#fef2f2', border: '1px solid #fecaca', color: '#dc2626', padding: '8px 12px', borderRadius: '4px', fontSize: '13px', marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <AlertCircle size={15} /> {loginError}
          </div>
        )}

        <form onSubmit={handleLoginSubmit}>
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '5px' }}>Tên tài khoản (BGH/Giáo viên):</label>
            <input 
              type="text" 
              value={username} 
              onChange={(e) => setUsername(e.target.value)} 
              style={{ width: '100%', padding: '8px 10px', border: '1px solid #94a3b8', borderRadius: '4px' }}
              placeholder="Nhập 'admin' hoặc 'giaovien'"
              required 
            />
          </div>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '5px' }}>Mật khẩu:</label>
            <input 
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              style={{ width: '100%', padding: '8px 10px', border: '1px solid #94a3b8', borderRadius: '4px' }}
              placeholder="Mật khẩu mặc định: admin123"
              required 
            />
          </div>
          <button type="submit" style={{ width: '100%', background: '#0056a6', color: 'white', border: 'none', padding: '10px', borderRadius: '4px', fontWeight: '700', fontSize: '14px', cursor: 'pointer' }}>
            Đăng Nhập Quản Trị
          </button>
        </form>

        <div style={{ marginTop: '15px', padding: '10px', background: '#f8fafc', borderRadius: '4px', fontSize: '12px', color: '#475569' }}>
          💡 <strong>Tài khoản dùng thử:</strong><br />
          - Ban Giám Hiệu: Username: <code>admin</code> | Pass: <code>admin123</code><br />
          - Giáo viên: Username: <code>giaovien</code> | Pass: <code>admin123</code>
        </div>
      </div>
    );
  }

  return (
    <div style={{ background: 'white', padding: '20px', borderRadius: '8px', border: '1px solid #cbd5e1' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid #0056a6', paddingBottom: '12px', marginBottom: '20px' }}>
        <div>
          <h2 style={{ fontSize: '20px', color: '#003a73', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <ShieldCheck size={24} color="#0056a6" /> QUẢN TRỊ NỘI DUNG PORTAL THCS ĐỒNG TÂN
          </h2>
          <span style={{ fontSize: '13px', color: '#64748b' }}>
            Xin chào: <strong>{user?.fullName}</strong> ({user?.role === 'BGH' ? 'Ban Giám Hiệu' : 'Giáo viên Biên tập'})
          </span>
        </div>
        <button onClick={onLogout} style={{ background: '#ef4444', color: 'white', border: 'none', padding: '6px 14px', borderRadius: '4px', cursor: 'pointer', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <LogOut size={15} /> Đăng xuất
        </button>
      </div>

      {message && (
        <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', color: '#166534', padding: '10px 15px', borderRadius: '4px', marginBottom: '20px', fontWeight: '600' }}>
          {message}
        </div>
      )}

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '10px', borderBottom: '1px solid #e2e8f0', marginBottom: '20px' }}>
        <button 
          onClick={() => setAdminTab('news')} 
          style={{ padding: '8px 16px', border: 'none', borderBottom: adminTab === 'news' ? '3px solid #0056a6' : 'none', background: 'transparent', fontWeight: adminTab === 'news' ? '700' : '500', color: adminTab === 'news' ? '#0056a6' : '#64748b', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
        >
          <PlusCircle size={16} /> Đăng Bài Viết Mới
        </button>
        <button 
          onClick={() => setAdminTab('docs')} 
          style={{ padding: '8px 16px', border: 'none', borderBottom: adminTab === 'docs' ? '3px solid #0056a6' : 'none', background: 'transparent', fontWeight: adminTab === 'docs' ? '700' : '500', color: adminTab === 'docs' ? '#0056a6' : '#64748b', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
        >
          <FilePlus size={16} /> Phát Hành Văn Bản
        </button>
        <button 
          onClick={() => setAdminTab('videos')} 
          style={{ padding: '8px 16px', border: 'none', borderBottom: adminTab === 'videos' ? '3px solid #0056a6' : 'none', background: 'transparent', fontWeight: adminTab === 'videos' ? '700' : '500', color: adminTab === 'videos' ? '#0056a6' : '#64748b', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
        >
          <Video size={16} /> Thêm Video YouTube
        </button>
        <button 
          onClick={() => setAdminTab('ann')} 
          style={{ padding: '8px 16px', border: 'none', borderBottom: adminTab === 'ann' ? '3px solid #0056a6' : 'none', background: 'transparent', fontWeight: adminTab === 'ann' ? '700' : '500', color: adminTab === 'ann' ? '#0056a6' : '#64748b', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
        >
          <Bell size={16} /> Thông Báo Chữ Chạy
        </button>
      </div>

      {/* Tab 1: Đăng tin mới */}
      {adminTab === 'news' && (
        <form onSubmit={handleCreateNews} style={{ display: 'grid', gap: '15px', maxWidth: '750px' }}>
          <div>
            <label style={{ display: 'block', fontWeight: '600', marginBottom: '4px' }}>Tiêu đề bài viết:</label>
            <input type="text" value={newsTitle} onChange={(e) => setNewsTitle(e.target.value)} required style={{ width: '100%', padding: '8px', border: '1px solid #cbd5e1', borderRadius: '4px' }} placeholder="VD: Lễ Tuyên dương học sinh giỏi THCS Đồng Tân năm học 2026" />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
            <div>
              <label style={{ display: 'block', fontWeight: '600', marginBottom: '4px' }}>Chuyên mục bài viết:</label>
              <select value={newsCategory} onChange={(e) => setNewsCategory(e.target.value)} style={{ width: '100%', padding: '8px', border: '1px solid #cbd5e1', borderRadius: '4px' }}>
                {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div>
              <label style={{ display: 'block', fontWeight: '600', marginBottom: '4px' }}>Ảnh đại diện (Link URL):</label>
              <input type="text" value={newsImage} onChange={(e) => setNewsImage(e.target.value)} style={{ width: '100%', padding: '8px', border: '1px solid #cbd5e1', borderRadius: '4px' }} placeholder="URL hình ảnh (Để trống dùng ảnh mặc định)" />
            </div>
          </div>
          <div>
            <label style={{ display: 'block', fontWeight: '600', marginBottom: '4px' }}>Tóm tắt ngắn (Dưới 30 từ):</label>
            <textarea value={newsSummary} onChange={(e) => setNewsSummary(e.target.value)} rows={2} style={{ width: '100%', padding: '8px', border: '1px solid #cbd5e1', borderRadius: '4px' }} placeholder="Tóm tắt ngắn gọn nội dung bài viết..."></textarea>
          </div>
          <div>
            <label style={{ display: 'block', fontWeight: '600', marginBottom: '4px' }}>Nội dung chi tiết bài viết:</label>
            <textarea value={newsContent} onChange={(e) => setNewsContent(e.target.value)} rows={6} required style={{ width: '100%', padding: '8px', border: '1px solid #cbd5e1', borderRadius: '4px' }} placeholder="Soạn thảo nội dung đầy đủ bài viết tại đây..."></textarea>
          </div>
          <div>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: '600', cursor: 'pointer' }}>
              <input type="checkbox" checked={newsFeatured} onChange={(e) => setNewsFeatured(e.target.checked)} />
              🔥 Đặt làm BÀI VIẾT NỔI BẬT NÓNG TRÊN TRANG CHỦ
            </label>
          </div>
          <button type="submit" style={{ background: '#0056a6', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '4px', fontWeight: '700', cursor: 'pointer', justifySelf: 'start' }}>
            🚀 Đăng Bài Viết Lên Portal
          </button>
        </form>
      )}

      {/* Tab 2: Phát hành văn bản */}
      {adminTab === 'docs' && (
        <form onSubmit={handleCreateDocument} style={{ display: 'grid', gap: '15px', maxWidth: '750px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
            <div>
              <label style={{ display: 'block', fontWeight: '600', marginBottom: '4px' }}>Số hiệu Văn bản:</label>
              <input type="text" value={docCode} onChange={(e) => setDocCode(e.target.value)} required style={{ width: '100%', padding: '8px', border: '1px solid #cbd5e1', borderRadius: '4px' }} placeholder="VD: TT08/2026/TT-BGDĐT" />
            </div>
            <div>
              <label style={{ display: 'block', fontWeight: '600', marginBottom: '4px' }}>Ngày ban hành:</label>
              <input type="text" value={docIssueDate} onChange={(e) => setDocIssueDate(e.target.value)} required style={{ width: '100%', padding: '8px', border: '1px solid #cbd5e1', borderRadius: '4px' }} />
            </div>
          </div>
          <div>
            <label style={{ display: 'block', fontWeight: '600', marginBottom: '4px' }}>Trích yếu Tiêu đề Văn bản:</label>
            <input type="text" value={docTitle} onChange={(e) => setDocTitle(e.target.value)} required style={{ width: '100%', padding: '8px', border: '1px solid #cbd5e1', borderRadius: '4px' }} placeholder="Nội dung trích yếu của văn bản..." />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
            <div>
              <label style={{ display: 'block', fontWeight: '600', marginBottom: '4px' }}>Loại văn bản:</label>
              <select value={docCategory} onChange={(e) => setDocCategory(e.target.value)} style={{ width: '100%', padding: '8px', border: '1px solid #cbd5e1', borderRadius: '4px' }}>
                <option value="Thông tư BGD&ĐT">Thông tư BGD&ĐT</option>
                <option value="Quy chế Nhà trường">Quy chế Nhà trường</option>
                <option value="Kế hoạch Nhà trường">Kế hoạch Nhà trường</option>
                <option value="Hướng dẫn Phòng GD&ĐT">Hướng dẫn Phòng GD&ĐT</option>
              </select>
            </div>
            <div>
              <label style={{ display: 'block', fontWeight: '600', marginBottom: '4px' }}>Người / Cơ quan ký:</label>
              <input type="text" value={docSigner} onChange={(e) => setDocSigner(e.target.value)} style={{ width: '100%', padding: '8px', border: '1px solid #cbd5e1', borderRadius: '4px' }} />
            </div>
          </div>
          <button type="submit" style={{ background: '#d97706', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '4px', fontWeight: '700', cursor: 'pointer', justifySelf: 'start' }}>
            📄 Phát Hành Văn Bản Mới
          </button>
        </form>
      )}

      {/* Tab 3: Thêm Video */}
      {adminTab === 'videos' && (
        <form onSubmit={handleCreateVideo} style={{ display: 'grid', gap: '15px', maxWidth: '600px' }}>
          <div>
            <label style={{ display: 'block', fontWeight: '600', marginBottom: '4px' }}>Tên Video Hoạt động:</label>
            <input type="text" value={vidTitle} onChange={(e) => setVidTitle(e.target.value)} required style={{ width: '100%', padding: '8px', border: '1px solid #cbd5e1', borderRadius: '4px' }} placeholder="VD: Video Khai giảng năm học 2026 - 2027 THCS Đồng Tân" />
          </div>
          <div>
            <label style={{ display: 'block', fontWeight: '600', marginBottom: '4px' }}>YouTube Video ID:</label>
            <input type="text" value={vidYoutubeId} onChange={(e) => setVidYoutubeId(e.target.value)} required style={{ width: '100%', padding: '8px', border: '1px solid #cbd5e1', borderRadius: '4px' }} placeholder="Ví dụ: dQw4w9WgXcQ (Chuỗi ký tự đằng sau watch?v=)" />
          </div>
          <button type="submit" style={{ background: '#15803d', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '4px', fontWeight: '700', cursor: 'pointer', justifySelf: 'start' }}>
            🎬 Thêm Video Lên Trang
          </button>
        </form>
      )}

      {/* Tab 4: Đăng Thông báo Marquee */}
      {adminTab === 'ann' && (
        <form onSubmit={handleCreateAnnouncement} style={{ display: 'grid', gap: '15px', maxWidth: '600px' }}>
          <div>
            <label style={{ display: 'block', fontWeight: '600', marginBottom: '4px' }}>Nội dung dòng chữ chạy Marquee:</label>
            <textarea value={annContent} onChange={(e) => setAnnContent(e.target.value)} rows={3} required style={{ width: '100%', padding: '8px', border: '1px solid #cbd5e1', borderRadius: '4px' }} placeholder="Nhập thông báo chạy trên thanh thông tin..."></textarea>
          </div>
          <button type="submit" style={{ background: '#0284c7', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '4px', fontWeight: '700', cursor: 'pointer', justifySelf: 'start' }}>
            📢 Cập Nhật Thông Báo Chữ Chạy
          </button>
        </form>
      )}
    </div>
  );
}
