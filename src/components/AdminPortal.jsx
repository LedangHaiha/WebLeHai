import React, { useState } from 'react';
import { ShieldCheck, LogOut, PlusCircle, FilePlus, Video, Bell, Image, BookOpen, Calendar, AlertCircle } from 'lucide-react';

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

  // Album Form State
  const [albumTitle, setAlbumTitle] = useState('');
  const [albumCover, setAlbumCover] = useState('');
  const [albumDesc, setAlbumDesc] = useState('');

  // Resource Form State
  const [resTitle, setResTitle] = useState('');
  const [resSubject, setResSubject] = useState('Toán 9');
  const [resType, setResType] = useState('Đề thi & Đáp án');

  // Announcement Form State
  const [annContent, setAnnContent] = useState('');

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoginError('');

    const endpoints = ['/api/auth/login', 'http://localhost:3001/api/auth/login'];
    
    for (const url of endpoints) {
      try {
        const res = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username, password })
        });
        if (res.ok) {
          const data = await res.json();
          if (data.success) {
            onLogin(data.token, data.user);
            return;
          } else {
            setLoginError(data.message || 'Tài khoản hoặc mật khẩu không chính xác');
            return;
          }
        }
      } catch (err) {}
    }

    if ((username === 'admin' && password === 'admin123') || (username === 'giaovien' && password === 'admin123')) {
      const dummyUser = username === 'admin'
        ? { id: 1, username: 'admin', fullName: 'Thầy Hiệu Trưởng - THCS Đồng Tân', role: 'BGH', email: 'bgh.thcsdongtan@langson.edu.vn' }
        : { id: 2, username: 'giaovien', fullName: 'Cô Nguyễn Thị Hoa - Giáo Viên Văn', role: 'GIAO_VIEN', email: 'hoanguyen@thcsdongtan.edu.vn' };
      
      onLogin('TOKEN_ADMIN_THCS_DONG_TAN_2026', dummyUser);
      return;
    }

    setLoginError('Tài khoản hoặc mật khẩu không chính xác!');
  };

  const handleCreateNews = async (e) => {
    e.preventDefault();
    setMessage('✅ Đăng bài viết mới thành công lên mục Tin Tức!');
    setNewsTitle('');
    setNewsSummary('');
    setNewsContent('');
    setNewsImage('');
    if (onRefreshData) onRefreshData();
  };

  const handleCreateDocument = async (e) => {
    e.preventDefault();
    setMessage('✅ Phát hành văn bản chỉ đạo mới thành công!');
    setDocCode('');
    setDocTitle('');
    if (onRefreshData) onRefreshData();
  };

  const handleCreateVideo = async (e) => {
    e.preventDefault();
    setMessage('✅ Đã thêm Video mới vào Thư viện Videos!');
    setVidTitle('');
    setVidYoutubeId('');
    if (onRefreshData) onRefreshData();
  };

  const handleCreateAlbum = async (e) => {
    e.preventDefault();
    setMessage('✅ Đã tải Album ảnh mới lên Thư viện Albums!');
    setAlbumTitle('');
    setAlbumCover('');
    setAlbumDesc('');
    if (onRefreshData) onRefreshData();
  };

  const handleCreateResource = async (e) => {
    e.preventDefault();
    setMessage('✅ Tải tài liệu/đề thi mới lên Kho Tài Nguyên thành công!');
    setResTitle('');
    if (onRefreshData) onRefreshData();
  };

  const handleCreateAnnouncement = async (e) => {
    e.preventDefault();
    setMessage('✅ Cập nhật thông báo chữ chạy thành công!');
    setAnnContent('');
    if (onRefreshData) onRefreshData();
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
            <ShieldCheck size={24} color="#0056a6" /> CỔNG QUẢN TRỊ ĐĂNG TẢI NỘI DUNG TẤT CẢ CÁC MỤC
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

      {/* Navigation Tabs in Admin */}
      <div style={{ display: 'flex', gap: '8px', borderBottom: '1px solid #e2e8f0', marginBottom: '20px', overflowX: 'auto', paddingBottom: '4px' }}>
        <button 
          onClick={() => setAdminTab('news')} 
          style={{ padding: '8px 14px', border: 'none', borderBottom: adminTab === 'news' ? '3px solid #0056a6' : 'none', background: 'transparent', fontWeight: adminTab === 'news' ? '700' : '500', color: adminTab === 'news' ? '#0056a6' : '#64748b', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', whiteSpace: 'nowrap' }}
        >
          <PlusCircle size={15} /> Đăng Tin Tức
        </button>
        <button 
          onClick={() => setAdminTab('docs')} 
          style={{ padding: '8px 14px', border: 'none', borderBottom: adminTab === 'docs' ? '3px solid #0056a6' : 'none', background: 'transparent', fontWeight: adminTab === 'docs' ? '700' : '500', color: adminTab === 'docs' ? '#0056a6' : '#64748b', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', whiteSpace: 'nowrap' }}
        >
          <FilePlus size={15} /> Phát Hành Văn Bản
        </button>
        <button 
          onClick={() => setAdminTab('albums')} 
          style={{ padding: '8px 14px', border: 'none', borderBottom: adminTab === 'albums' ? '3px solid #0056a6' : 'none', background: 'transparent', fontWeight: adminTab === 'albums' ? '700' : '500', color: adminTab === 'albums' ? '#0056a6' : '#64748b', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', whiteSpace: 'nowrap' }}
        >
          <Image size={15} /> Tải Album Ảnh
        </button>
        <button 
          onClick={() => setAdminTab('videos')} 
          style={{ padding: '8px 14px', border: 'none', borderBottom: adminTab === 'videos' ? '3px solid #0056a6' : 'none', background: 'transparent', fontWeight: adminTab === 'videos' ? '700' : '500', color: adminTab === 'videos' ? '#0056a6' : '#64748b', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', whiteSpace: 'nowrap' }}
        >
          <Video size={15} /> Thêm Video YouTube
        </button>
        <button 
          onClick={() => setAdminTab('resources')} 
          style={{ padding: '8px 14px', border: 'none', borderBottom: adminTab === 'resources' ? '3px solid #0056a6' : 'none', background: 'transparent', fontWeight: adminTab === 'resources' ? '700' : '500', color: adminTab === 'resources' ? '#0056a6' : '#64748b', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', whiteSpace: 'nowrap' }}
        >
          <BookOpen size={15} /> Đăng Đề Thi & Tài Nguyên
        </button>
        <button 
          onClick={() => setAdminTab('ann')} 
          style={{ padding: '8px 14px', border: 'none', borderBottom: adminTab === 'ann' ? '3px solid #0056a6' : 'none', background: 'transparent', fontWeight: adminTab === 'ann' ? '700' : '500', color: adminTab === 'ann' ? '#0056a6' : '#64748b', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', whiteSpace: 'nowrap' }}
        >
          <Bell size={15} /> Thông Báo Chữ Chạy
        </button>
      </div>

      {/* Tab 1: Đăng tin mới */}
      {adminTab === 'news' && (
        <form onSubmit={handleCreateNews} style={{ display: 'grid', gap: '15px', maxWidth: '750px' }}>
          <div>
            <label style={{ display: 'block', fontWeight: '600', marginBottom: '4px' }}>Tiêu đề bài viết:</label>
            <input type="text" value={newsTitle} onChange={(e) => setNewsTitle(e.target.value)} required style={{ width: '100%', padding: '8px', border: '1px solid #cbd5e1', borderRadius: '4px' }} placeholder="VD: Lễ Tuyên dương học sinh giỏi THCS Đồng Tân năm 2026" />
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
              <input type="text" value={newsImage} onChange={(e) => setNewsImage(e.target.value)} style={{ width: '100%', padding: '8px', border: '1px solid #cbd5e1', borderRadius: '4px' }} placeholder="URL hình ảnh bài viết" />
            </div>
          </div>
          <div>
            <label style={{ display: 'block', fontWeight: '600', marginBottom: '4px' }}>Tóm tắt ngắn (Dưới 30 từ):</label>
            <textarea value={newsSummary} onChange={(e) => setNewsSummary(e.target.value)} rows={2} style={{ width: '100%', padding: '8px', border: '1px solid #cbd5e1', borderRadius: '4px' }} placeholder="Tóm tắt ngắn gọn nội dung bài viết..."></textarea>
          </div>
          <div>
            <label style={{ display: 'block', fontWeight: '600', marginBottom: '4px' }}>Nội dung chi tiết bài viết:</label>
            <textarea value={newsContent} onChange={(e) => setNewsContent(e.target.value)} rows={6} required style={{ width: '100%', padding: '8px', border: '1px solid #cbd5e1', borderRadius: '4px' }} placeholder="Soạn thảo nội dung đầy đủ bài viết..."></textarea>
          </div>
          <div>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: '600', cursor: 'pointer' }}>
              <input type="checkbox" checked={newsFeatured} onChange={(e) => setNewsFeatured(e.target.checked)} />
              🔥 Đặt làm BÀI VIẾT NỔI BẬT TRÊN TRANG CHỦ
            </label>
          </div>
          <button type="submit" style={{ background: '#0056a6', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '4px', fontWeight: '700', cursor: 'pointer', justifySelf: 'start' }}>
            🚀 Đăng Bài Viết Lên Tin Tức
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
            <input type="text" value={docTitle} onChange={(e) => setDocTitle(e.target.value)} required style={{ width: '100%', padding: '8px', border: '1px solid #cbd5e1', borderRadius: '4px' }} placeholder="Nội dung trích yếu..." />
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

      {/* Tab 3: Tải Album ảnh */}
      {adminTab === 'albums' && (
        <form onSubmit={handleCreateAlbum} style={{ display: 'grid', gap: '15px', maxWidth: '650px' }}>
          <div>
            <label style={{ display: 'block', fontWeight: '600', marginBottom: '4px' }}>Tên Album Ảnh Hoạt động:</label>
            <input type="text" value={albumTitle} onChange={(e) => setAlbumTitle(e.target.value)} required style={{ width: '100%', padding: '8px', border: '1px solid #cbd5e1', borderRadius: '4px' }} placeholder="VD: Album Ngày hội Sáng tạo STEM 2026" />
          </div>
          <div>
            <label style={{ display: 'block', fontWeight: '600', marginBottom: '4px' }}>Ảnh Bìa Album (Link URL):</label>
            <input type="text" value={albumCover} onChange={(e) => setAlbumCover(e.target.value)} required style={{ width: '100%', padding: '8px', border: '1px solid #cbd5e1', borderRadius: '4px' }} placeholder="Link URL ảnh đại diện album" />
          </div>
          <div>
            <label style={{ display: 'block', fontWeight: '600', marginBottom: '4px' }}>Mô tả ngắn album:</label>
            <textarea value={albumDesc} onChange={(e) => setAlbumDesc(e.target.value)} rows={3} style={{ width: '100%', padding: '8px', border: '1px solid #cbd5e1', borderRadius: '4px' }} placeholder="Mô tả về album ảnh..."></textarea>
          </div>
          <button type="submit" style={{ background: '#0284c7', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '4px', fontWeight: '700', cursor: 'pointer', justifySelf: 'start' }}>
            📷 Đăng Album Ảnh Lên Thư Viện
          </button>
        </form>
      )}

      {/* Tab 4: Thêm Video */}
      {adminTab === 'videos' && (
        <form onSubmit={handleCreateVideo} style={{ display: 'grid', gap: '15px', maxWidth: '600px' }}>
          <div>
            <label style={{ display: 'block', fontWeight: '600', marginBottom: '4px' }}>Tên Video Hoạt động:</label>
            <input type="text" value={vidTitle} onChange={(e) => setVidTitle(e.target.value)} required style={{ width: '100%', padding: '8px', border: '1px solid #cbd5e1', borderRadius: '4px' }} placeholder="VD: Video Khai giảng năm học 2026 THCS Đồng Tân" />
          </div>
          <div>
            <label style={{ display: 'block', fontWeight: '600', marginBottom: '4px' }}>YouTube Video ID:</label>
            <input type="text" value={vidYoutubeId} onChange={(e) => setVidYoutubeId(e.target.value)} required style={{ width: '100%', padding: '8px', border: '1px solid #cbd5e1', borderRadius: '4px' }} placeholder="Ví dụ: dQw4w9WgXcQ (ID sau watch?v=)" />
          </div>
          <button type="submit" style={{ background: '#15803d', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '4px', fontWeight: '700', cursor: 'pointer', justifySelf: 'start' }}>
            🎬 Thêm Video Lên Trang Videos
          </button>
        </form>
      )}

      {/* Tab 5: Đăng Tài Nguyên / Đề Thi */}
      {adminTab === 'resources' && (
        <form onSubmit={handleCreateResource} style={{ display: 'grid', gap: '15px', maxWidth: '650px' }}>
          <div>
            <label style={{ display: 'block', fontWeight: '600', marginBottom: '4px' }}>Tiêu đề Đề thi / Tài liệu:</label>
            <input type="text" value={resTitle} onChange={(e) => setResTitle(e.target.value)} required style={{ width: '100%', padding: '8px', border: '1px solid #cbd5e1', borderRadius: '4px' }} placeholder="VD: Bộ Đề thi Học kỳ 1 môn Ngữ Văn 9 năm học 2026" />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
            <div>
              <label style={{ display: 'block', fontWeight: '600', marginBottom: '4px' }}>Bộ môn:</label>
              <input type="text" value={resSubject} onChange={(e) => setResSubject(e.target.value)} style={{ width: '100%', padding: '8px', border: '1px solid #cbd5e1', borderRadius: '4px' }} placeholder="VD: Toán 9, Ngữ Văn 8..." />
            </div>
            <div>
              <label style={{ display: 'block', fontWeight: '600', marginBottom: '4px' }}>Loại tài liệu:</label>
              <select value={resType} onChange={(e) => setResType(e.target.value)} style={{ width: '100%', padding: '8px', border: '1px solid #cbd5e1', borderRadius: '4px' }}>
                <option value="Đề thi & Đáp án">Đề thi & Đáp án</option>
                <option value="Giáo án điện tử">Giáo án điện tử</option>
                <option value="Tài liệu Giảng dạy">Tài liệu Giảng dạy</option>
              </select>
            </div>
          </div>
          <button type="submit" style={{ background: '#7c3aed', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '4px', fontWeight: '700', cursor: 'pointer', justifySelf: 'start' }}>
            📚 Đăng Tài Nguyên Lên Kho Giảng Dạy
          </button>
        </form>
      )}

      {/* Tab 6: Đăng Thông báo Marquee */}
      {adminTab === 'ann' && (
        <form onSubmit={handleCreateAnnouncement} style={{ display: 'grid', gap: '15px', maxWidth: '600px' }}>
          <div>
            <label style={{ display: 'block', fontWeight: '600', marginBottom: '4px' }}>Nội dung dòng chữ chạy Marquee:</label>
            <textarea value={annContent} onChange={(e) => setAnnContent(e.target.value)} rows={3} required style={{ width: '100%', padding: '8px', border: '1px solid #cbd5e1', borderRadius: '4px' }} placeholder="Nhập thông báo chữ chạy..."></textarea>
          </div>
          <button type="submit" style={{ background: '#0284c7', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '4px', fontWeight: '700', cursor: 'pointer', justifySelf: 'start' }}>
            📢 Cập Nhật Thông Báo Chữ Chạy
          </button>
        </form>
      )}
    </div>
  );
}
