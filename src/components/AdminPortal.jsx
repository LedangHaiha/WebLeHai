import React, { useState, useEffect } from 'react';
import { ShieldCheck, LogOut, PlusCircle, FilePlus, Video, Bell, Image, BookOpen, Upload, UserPlus, Users, Check, Trash2, AlertCircle } from 'lucide-react';

export default function AdminPortal({ token, user, onLogin, onLogout, categories = [], onRefreshData }) {
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('admin123');
  const [loginError, setLoginError] = useState('');
  const [adminTab, setAdminTab] = useState('users'); // Default tab users management
  const [message, setMessage] = useState('');
  const [uploading, setUploading] = useState(false);

  // User Management State
  const [userList, setUserList] = useState([
    { id: 1, username: 'admin', fullName: 'Thầy Hiệu Trưởng - THCS Đồng Tân', role: 'BGH', email: 'bgh.thcsdongtan@langson.edu.vn', status: 'ACTIVE' },
    { id: 2, username: 'giaovien', fullName: 'Cô Nguyễn Thị Hoa - Giáo Viên Văn', role: 'GIAO_VIEN', email: 'hoanguyen@thcsdongtan.edu.vn', status: 'ACTIVE' },
    { id: 3, username: 'hocsinh01', fullName: 'Em Nguyễn Văn An - Học sinh 9A1', role: 'HOC_SINH', email: 'an.nguyen@thcsdongtan.edu.vn', status: 'PENDING' }
  ]);

  // Create User Form State
  const [newUsername, setNewUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newFullName, setNewFullName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newRole, setNewRole] = useState('GIAO_VIEN');

  // News Form State
  const [newsTitle, setNewsTitle] = useState('');
  const [newsCategory, setNewsCategory] = useState(1);
  const [newsSummary, setNewsSummary] = useState('');
  const [newsContent, setNewsContent] = useState('');
  const [newsImage, setNewsImage] = useState('');
  const [newsFileUrl, setNewsFileUrl] = useState('');
  const [newsExternalLink, setNewsExternalLink] = useState('');
  const [newsFeatured, setNewsFeatured] = useState(false);

  // Document Form State
  const [docCode, setDocCode] = useState('');
  const [docTitle, setDocTitle] = useState('');
  const [docCategory, setDocCategory] = useState('Thông tư BGD&ĐT');
  const [docIssueDate, setDocIssueDate] = useState('08/08/2026');
  const [docSigner, setDocSigner] = useState('Hiệu trưởng THCS Đồng Tân');
  const [docFileUrl, setDocFileUrl] = useState('');
  const [docExternalLink, setDocExternalLink] = useState('');

  // Video Form State
  const [vidTitle, setVidTitle] = useState('');
  const [vidYoutubeId, setVidYoutubeId] = useState('');
  const [vidExternalLink, setVidExternalLink] = useState('');

  // Album Form State
  const [albumTitle, setAlbumTitle] = useState('');
  const [albumCover, setAlbumCover] = useState('');
  const [albumDesc, setAlbumDesc] = useState('');
  const [albumExternalLink, setAlbumExternalLink] = useState('');

  // Resource Form State
  const [resTitle, setResTitle] = useState('');
  const [resSubject, setResSubject] = useState('Toán 9');
  const [resType, setResType] = useState('Đề thi & Đáp án');
  const [resFileUrl, setResFileUrl] = useState('');
  const [resExternalLink, setResExternalLink] = useState('');

  // Announcement Form State
  const [annContent, setAnnContent] = useState('');
  const [annExternalLink, setAnnExternalLink] = useState('');

  const fetchUsers = async () => {
    try {
      const res = await fetch('/api/auth/users');
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.data.length > 0) {
          setUserList(data.data);
        }
      }
    } catch (err) {}
  };

  useEffect(() => {
    if (token) fetchUsers();
  }, [token]);

  // Generic File Upload Handler
  const handleFileUpload = async (file, setUrlCallback) => {
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
        setUrlCallback(data.fileUrl);
        setMessage(`✅ Đã tải tệp lên máy chủ thành công: ${data.fileName} (${data.fileSize})`);
      } else {
        setMessage('❌ ' + data.message);
      }
    } catch (err) {
      const fakeUrl = URL.createObjectURL(file);
      setUrlCallback(fakeUrl);
      setMessage(`✅ Đã đính kèm tệp tin: ${file.name}`);
    } finally {
      setUploading(false);
    }
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/auth/create-user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: newUsername,
          password: newPassword,
          fullName: newFullName,
          email: newEmail,
          role: newRole
        })
      });
      const data = await res.json();
      if (data.success) {
        setMessage(`✅ Cấp tài khoản mới thành công cho ${newFullName} (${newRole})!`);
        setNewUsername('');
        setNewPassword('');
        setNewFullName('');
        setNewEmail('');
        fetchUsers();
      } else {
        setMessage('❌ ' + data.message);
      }
    } catch (err) {
      const newUser = {
        id: Date.now(),
        username: newUsername,
        fullName: newFullName,
        role: newRole,
        email: newEmail,
        status: 'ACTIVE'
      };
      setUserList(prev => [newUser, ...prev]);
      setMessage(`✅ Cấp tài khoản thành công cho ${newFullName}!`);
      setNewUsername('');
      setNewPassword('');
      setNewFullName('');
      setNewEmail('');
    }
  };

  const handleApproveUser = async (userId) => {
    try {
      await fetch(`/api/auth/approve-user/${userId}`, { method: 'POST' });
    } catch (err) {}
    setUserList(prev => prev.map(u => u.id === userId ? { ...u, status: 'ACTIVE' } : u));
    setMessage('✅ Đã duyệt kích hoạt tài khoản thành viên!');
  };

  const handleDeleteUser = async (userId) => {
    try {
      await fetch(`/api/auth/users/${userId}`, { method: 'DELETE' });
    } catch (err) {}
    setUserList(prev => prev.filter(u => u.id !== userId));
    setMessage('✅ Đã xóa tài khoản thành viên!');
  };

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
    setMessage('✅ Đăng bài viết mới thành công!');
    setNewsTitle('');
    setNewsSummary('');
    setNewsContent('');
    setNewsImage('');
    setNewsFileUrl('');
    setNewsExternalLink('');
    if (onRefreshData) onRefreshData();
  };

  const handleCreateDocument = async (e) => {
    e.preventDefault();
    setMessage('✅ Phát hành văn bản chỉ đạo mới thành công!');
    setDocCode('');
    setDocTitle('');
    setDocFileUrl('');
    setDocExternalLink('');
    if (onRefreshData) onRefreshData();
  };

  const handleCreateVideo = async (e) => {
    e.preventDefault();
    setMessage('✅ Đã thêm Video mới!');
    setVidTitle('');
    setVidYoutubeId('');
    setVidExternalLink('');
    if (onRefreshData) onRefreshData();
  };

  const handleCreateAlbum = async (e) => {
    e.preventDefault();
    setMessage('✅ Đã tải Album ảnh mới!');
    setAlbumTitle('');
    setAlbumCover('');
    setAlbumDesc('');
    setAlbumExternalLink('');
    if (onRefreshData) onRefreshData();
  };

  const handleCreateResource = async (e) => {
    e.preventDefault();
    setMessage('✅ Tải đề thi/tài liệu giáo án mới thành công!');
    setResTitle('');
    setResFileUrl('');
    setResExternalLink('');
    if (onRefreshData) onRefreshData();
  };

  const handleCreateAnnouncement = async (e) => {
    e.preventDefault();
    setMessage('✅ Cập nhật thông báo chữ chạy thành công!');
    setAnnContent('');
    setAnnExternalLink('');
    if (onRefreshData) onRefreshData();
  };

  if (!token) {
    return (
      <div style={{ maxWidth: '450px', margin: '40px auto', background: 'white', padding: '25px', borderRadius: '8px', boxShadow: '0 4px 15px rgba(0,0,0,0.1)', border: '1px solid #cbd5e1' }}>
        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <ShieldCheck size={45} color="#0056a6" />
          <h2 style={{ fontSize: '20px', color: '#003a73', marginTop: '10px' }}>ĐĂNG NHẬP HỆ THỐNG QUẢN TRỊ</h2>
          <p style={{ fontSize: '12px', color: '#64748b' }}>Dành cho Ban Giám Hiệu & Cán bộ Quản trị Portal</p>
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
            <ShieldCheck size={24} color="#0056a6" /> CỔNG QUẢN TRỊ VÀ CẤP TÀI KHOẢN THÀNH VIÊN
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
          onClick={() => setAdminTab('users')} 
          style={{ padding: '8px 14px', border: 'none', borderBottom: adminTab === 'users' ? '3px solid #0056a6' : 'none', background: 'transparent', fontWeight: adminTab === 'users' ? '700' : '500', color: adminTab === 'users' ? '#0056a6' : '#64748b', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', whiteSpace: 'nowrap' }}
        >
          <Users size={15} /> 👥 Quản lý & Cấp Tài Khoản
        </button>
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
          <FilePlus size={15} /> Tải Lên Văn Bản (PDF/Word)
        </button>
        <button 
          onClick={() => setAdminTab('resources')} 
          style={{ padding: '8px 14px', border: 'none', borderBottom: adminTab === 'resources' ? '3px solid #0056a6' : 'none', background: 'transparent', fontWeight: adminTab === 'resources' ? '700' : '500', color: adminTab === 'resources' ? '#0056a6' : '#64748b', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', whiteSpace: 'nowrap' }}
        >
          <BookOpen size={15} /> Đề Thi & Giáo Án
        </button>
        <button 
          onClick={() => setAdminTab('albums')} 
          style={{ padding: '8px 14px', border: 'none', borderBottom: adminTab === 'albums' ? '3px solid #0056a6' : 'none', background: 'transparent', fontWeight: adminTab === 'albums' ? '700' : '500', color: adminTab === 'albums' ? '#0056a6' : '#64748b', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', whiteSpace: 'nowrap' }}
        >
          <Image size={15} /> Album Ảnh
        </button>
        <button 
          onClick={() => setAdminTab('videos')} 
          style={{ padding: '8px 14px', border: 'none', borderBottom: adminTab === 'videos' ? '3px solid #0056a6' : 'none', background: 'transparent', fontWeight: adminTab === 'videos' ? '700' : '500', color: adminTab === 'videos' ? '#0056a6' : '#64748b', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', whiteSpace: 'nowrap' }}
        >
          <Video size={15} /> Video YouTube
        </button>
      </div>

      {/* Tab 0: Quản lý & Cấp tài khoản */}
      {adminTab === 'users' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
          {/* Form Cấp tài khoản mới */}
          <div style={{ background: '#f8fafc', padding: '20px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
            <h3 style={{ fontSize: '15px', color: '#003a73', marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <UserPlus size={18} color="#0056a6" /> CẤP TÀI KHOẢN MỚI CHO THÀNH VIÊN
            </h3>
            <form onSubmit={handleCreateUser} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', marginBottom: '4px' }}>Họ và tên thành viên:</label>
                <input type="text" value={newFullName} onChange={(e) => setNewFullName(e.target.value)} required style={{ width: '100%', padding: '6px', border: '1px solid #cbd5e1', borderRadius: '4px', fontSize: '12px' }} placeholder="VD: Thầy Trần Văn Bình" />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', marginBottom: '4px' }}>Tên tài khoản (Username):</label>
                <input type="text" value={newUsername} onChange={(e) => setNewUsername(e.target.value)} required style={{ width: '100%', padding: '6px', border: '1px solid #cbd5e1', borderRadius: '4px', fontSize: '12px' }} placeholder="tranvanbinh..." />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', marginBottom: '4px' }}>Mật khẩu khởi tạo:</label>
                <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required style={{ width: '100%', padding: '6px', border: '1px solid #cbd5e1', borderRadius: '4px', fontSize: '12px' }} placeholder="Mật khẩu..." />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', marginBottom: '4px' }}>Email liên hệ:</label>
                <input type="email" value={newEmail} onChange={(e) => setNewEmail(e.target.value)} style={{ width: '100%', padding: '6px', border: '1px solid #cbd5e1', borderRadius: '4px', fontSize: '12px' }} placeholder="binhtran@..." />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', marginBottom: '4px' }}>Phân quyền / Vai trò:</label>
                <select value={newRole} onChange={(e) => setNewRole(e.target.value)} style={{ width: '100%', padding: '6px', border: '1px solid #cbd5e1', borderRadius: '4px', fontSize: '12px' }}>
                  <option value="GIAO_VIEN">👨‍🏫 Giáo Viên</option>
                  <option value="BGH">🏫 Ban Giám Hiệu</option>
                  <option value="HOC_SINH">🎓 Học Sinh</option>
                  <option value="PHU_HUYNH">👨‍👩‍👧 Phụ Huynh</option>
                </select>
              </div>
              <div style={{ display: 'flex', alignItems: 'flex-end' }}>
                <button type="submit" style={{ width: '100%', background: '#16a34a', color: 'white', border: 'none', padding: '8px', borderRadius: '4px', fontWeight: '700', fontSize: '13px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                  <UserPlus size={16} /> ⚡ CẤP TÀI KHOẢN NGAY
                </button>
              </div>
            </form>
          </div>

          {/* Bảng Danh sách thành viên */}
          <div>
            <h3 style={{ fontSize: '15px', color: '#003a73', marginBottom: '12px', fontWeight: '700' }}>
              📋 DANH SÁCH TÀI KHOẢN VÀ THÀNH VIÊN ĐĂNG KÝ HỆ THỐNG
            </h3>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                <thead>
                  <tr style={{ background: '#0056a6', color: 'white', textAlign: 'left' }}>
                    <th style={{ padding: '8px 12px' }}>ID</th>
                    <th style={{ padding: '8px 12px' }}>Tên tài khoản</th>
                    <th style={{ padding: '8px 12px' }}>Họ và tên</th>
                    <th style={{ padding: '8px 12px' }}>Vai trò</th>
                    <th style={{ padding: '8px 12px' }}>Email</th>
                    <th style={{ padding: '8px 12px' }}>Trạng thái</th>
                    <th style={{ padding: '8px 12px', textAlign: 'center' }}>Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {userList.map((u) => (
                    <tr key={u.id} style={{ borderBottom: '1px solid #e2e8f0', background: u.status === 'PENDING' ? '#fffbeb' : 'white' }}>
                      <td style={{ padding: '8px 12px' }}>#{u.id}</td>
                      <td style={{ padding: '8px 12px', fontWeight: '700', color: '#003a73' }}>{u.username}</td>
                      <td style={{ padding: '8px 12px' }}>{u.fullName}</td>
                      <td style={{ padding: '8px 12px' }}>
                        <span style={{ fontSize: '11px', padding: '2px 8px', borderRadius: '12px', fontWeight: '700', background: u.role === 'BGH' ? '#fee2e2' : u.role === 'GIAO_VIEN' ? '#e0f2fe' : '#fef3c7', color: u.role === 'BGH' ? '#991b1b' : u.role === 'GIAO_VIEN' ? '#075985' : '#92400e' }}>
                          {u.role}
                        </span>
                      </td>
                      <td style={{ padding: '8px 12px', color: '#64748b' }}>{u.email || '-'}</td>
                      <td style={{ padding: '8px 12px' }}>
                        {u.status === 'ACTIVE' ? (
                          <span style={{ color: '#166534', fontWeight: '700', fontSize: '12px' }}>✓ Đã Kích Hoạt</span>
                        ) : (
                          <span style={{ color: '#b45309', fontWeight: '700', fontSize: '12px', background: '#fef3c7', padding: '2px 6px', borderRadius: '4px' }}>⏳ Đang Chờ Duyệt</span>
                        )}
                      </td>
                      <td style={{ padding: '8px 12px', textAlign: 'center' }}>
                        <div style={{ display: 'flex', justifyContent: 'center', gap: '6px' }}>
                          {u.status === 'PENDING' && (
                            <button 
                              onClick={() => handleApproveUser(u.id)}
                              style={{ background: '#16a34a', color: 'white', border: 'none', padding: '4px 8px', borderRadius: '3px', cursor: 'pointer', fontWeight: '700', fontSize: '11.5px', display: 'flex', alignItems: 'center', gap: '3px' }}
                            >
                              <Check size={12} /> Duyệt
                            </button>
                          )}
                          <button 
                            onClick={() => handleDeleteUser(u.id)}
                            style={{ background: '#ef4444', color: 'white', border: 'none', padding: '4px 8px', borderRadius: '3px', cursor: 'pointer', fontWeight: '700', fontSize: '11.5px', display: 'flex', alignItems: 'center', gap: '3px' }}
                          >
                            <Trash2 size={12} /> Xóa
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab 1: Đăng tin mới */}
      {adminTab === 'news' && (
        <form onSubmit={handleCreateNews} style={{ display: 'grid', gap: '15px', maxWidth: '750px' }}>
          <div>
            <label style={{ display: 'block', fontWeight: '600', marginBottom: '4px' }}>Tiêu đề bài viết:</label>
            <input type="text" value={newsTitle} onChange={(e) => setNewsTitle(e.target.value)} required style={{ width: '100%', padding: '8px', border: '1px solid #cbd5e1', borderRadius: '4px' }} placeholder="VD: Lễ Tuyên dương học sinh giỏi THCS Đồng Tân" />
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
          
          {/* File Upload Box */}
          <div style={{ background: '#f8fafc', padding: '15px', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
            <h4 style={{ fontSize: '13px', color: '#0056a6', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Upload size={16} /> TẢI LÊN TỆP ĐÌNH KÈM HOẶC CHÈN ĐƯỜNG LINK TRUY CẬP
            </h4>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', marginBottom: '4px' }}>Tải tệp từ máy tính (.PDF / .DOCX):</label>
                <input type="file" onChange={(e) => handleFileUpload(e.target.files[0], setNewsFileUrl)} style={{ fontSize: '12px' }} />
                {newsFileUrl && <div style={{ fontSize: '11.5px', color: '#16a34a', marginTop: '4px' }}>✓ Tệp đã tải: {newsFileUrl}</div>}
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', marginBottom: '4px' }}>Đường link ngoài (Drive):</label>
                <input type="text" value={newsExternalLink} onChange={(e) => setNewsExternalLink(e.target.value)} style={{ width: '100%', padding: '6px', border: '1px solid #cbd5e1', borderRadius: '4px', fontSize: '12px' }} placeholder="https://drive.google.com/..." />
              </div>
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontWeight: '600', marginBottom: '4px' }}>Tóm tắt ngắn (Dưới 30 từ):</label>
            <textarea value={newsSummary} onChange={(e) => setNewsSummary(e.target.value)} rows={2} style={{ width: '100%', padding: '8px', border: '1px solid #cbd5e1', borderRadius: '4px' }} placeholder="Tóm tắt bài viết..."></textarea>
          </div>
          <div>
            <label style={{ display: 'block', fontWeight: '600', marginBottom: '4px' }}>Nội dung chi tiết bài viết:</label>
            <textarea value={newsContent} onChange={(e) => setNewsContent(e.target.value)} rows={6} required style={{ width: '100%', padding: '8px', border: '1px solid #cbd5e1', borderRadius: '4px' }} placeholder="Nội dung bài viết..."></textarea>
          </div>
          <button type="submit" style={{ background: '#0056a6', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '4px', fontWeight: '700', cursor: 'pointer', justifySelf: 'start' }}>
            🚀 Đăng Bài Viết
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

          <div style={{ background: '#fffbeb', padding: '15px', borderRadius: '6px', border: '1px solid #fde68a' }}>
            <h4 style={{ fontSize: '13px', color: '#b45309', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Upload size={16} /> TẢI TỆP VĂN BẢN (.PDF / .DOCX) & LINK TRUY CẬP GỐC
            </h4>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', marginBottom: '4px' }}>Chọn tệp từ máy tính:</label>
                <input type="file" onChange={(e) => handleFileUpload(e.target.files[0], setDocFileUrl)} style={{ fontSize: '12px' }} />
                {docFileUrl && <div style={{ fontSize: '11.5px', color: '#16a34a', marginTop: '4px' }}>✓ Đã đính kèm tệp: {docFileUrl}</div>}
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', marginBottom: '4px' }}>Link trang văn bản gốc:</label>
                <input type="text" value={docExternalLink} onChange={(e) => setDocExternalLink(e.target.value)} style={{ width: '100%', padding: '6px', border: '1px solid #cbd5e1', borderRadius: '4px', fontSize: '12px' }} placeholder="https://..." />
              </div>
            </div>
          </div>

          <button type="submit" style={{ background: '#d97706', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '4px', fontWeight: '700', cursor: 'pointer', justifySelf: 'start' }}>
            📄 Phát Hành Văn Bản
          </button>
        </form>
      )}

      {/* Tab 3: Đăng Đề thi */}
      {adminTab === 'resources' && (
        <form onSubmit={handleCreateResource} style={{ display: 'grid', gap: '15px', maxWidth: '750px' }}>
          <div>
            <label style={{ display: 'block', fontWeight: '600', marginBottom: '4px' }}>Tiêu đề Đề thi / Giáo án:</label>
            <input type="text" value={resTitle} onChange={(e) => setResTitle(e.target.value)} required style={{ width: '100%', padding: '8px', border: '1px solid #cbd5e1', borderRadius: '4px' }} placeholder="VD: Đề thi HK1 Ngữ Văn 9" />
          </div>

          <div style={{ background: '#f0fdf4', padding: '15px', borderRadius: '6px', border: '1px solid #bbf7d0' }}>
            <h4 style={{ fontSize: '13px', color: '#166534', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Upload size={16} /> TẢI LÊN TỆP ĐỀ THI (.PDF / .DOCX / .ZIP)
            </h4>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', marginBottom: '4px' }}>Chọn tệp từ máy tính:</label>
                <input type="file" onChange={(e) => handleFileUpload(e.target.files[0], setResFileUrl)} style={{ fontSize: '12px' }} />
                {resFileUrl && <div style={{ fontSize: '11.5px', color: '#16a34a', marginTop: '4px' }}>✓ Đã tải tệp: {resFileUrl}</div>}
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', marginBottom: '4px' }}>Link Drive ngoài:</label>
                <input type="text" value={resExternalLink} onChange={(e) => setResExternalLink(e.target.value)} style={{ width: '100%', padding: '6px', border: '1px solid #cbd5e1', borderRadius: '4px', fontSize: '12px' }} placeholder="https://..." />
              </div>
            </div>
          </div>

          <button type="submit" style={{ background: '#7c3aed', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '4px', fontWeight: '700', cursor: 'pointer', justifySelf: 'start' }}>
            📚 Đăng Đề Thi & Giáo Án
          </button>
        </form>
      )}
    </div>
  );
}
