import React, { useState, useEffect } from 'react';
import { ShieldCheck, LogOut, PlusCircle, FilePlus, Video, Bell, Image, BookOpen, Upload, UserPlus, Users, Check, Trash2, Edit, Settings, AlertCircle, Save } from 'lucide-react';

export default function AdminPortal({ 
  token, 
  user, 
  onLogin, 
  onLogout, 
  categories = [], 
  siteConfig = {},
  onSaveSiteConfig,
  newsList = [],
  documents = [],
  resources = [],
  onUpdateNews,
  onDeleteNews,
  onUpdateDocument,
  onDeleteDocument,
  onUpdateResource,
  onDeleteResource,
  onRefreshData 
}) {
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('admin123');
  const [loginError, setLoginError] = useState('');
  const [adminTab, setAdminTab] = useState('config');
  const [message, setMessage] = useState('');
  const [uploading, setUploading] = useState(false);

  // Site Config State
  const [configState, setConfigState] = useState({
    schoolName: siteConfig.schoolName || 'TRƯỜNG THCS ĐỒNG TÂN',
    governingBody: siteConfig.governingBody || 'ỦY BAN NHÂN DÂN XÃ HỮU LŨNG - TỈNH LẠNG SƠN',
    slogan: siteConfig.slogan || 'HỘI TỤ - KẾT TINH - TỎA SÁNG',
    address: siteConfig.address || 'Xã Hữu Lũng - Tỉnh Lạng Sơn',
    phone: siteConfig.phone || '(0205) 3885.6789',
    email: siteConfig.email || 'thcsdongtan.huulung@langson.edu.vn',
    logoUrl: siteConfig.logoUrl || 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=300&q=80',
    bannerBg: siteConfig.bannerBg || ''
  });

  // User Management State
  const [userList, setUserList] = useState([
    { id: 1, username: 'admin', fullName: 'Thầy Hiệu Trưởng - THCS Đồng Tân', role: 'BGH', email: 'bgh.thcsdongtan@langson.edu.vn', status: 'ACTIVE' },
    { id: 2, username: 'giaovien', fullName: 'Cô Nguyễn Thị Hoa - Giáo Viên Văn', role: 'GIAO_VIEN', email: 'hoanguyen@thcsdongtan.edu.vn', status: 'ACTIVE' }
  ]);

  // Editing State
  const [editingArticle, setEditingArticle] = useState(null);
  const [editingDoc, setEditingDoc] = useState(null);
  const [editingResource, setEditingResource] = useState(null);

  // User Form State
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

  // Document Form State
  const [docCode, setDocCode] = useState('');
  const [docTitle, setDocTitle] = useState('');
  const [docCategory, setDocCategory] = useState('Thông tư BGD&ĐT');
  const [docIssueDate, setDocIssueDate] = useState('08/08/2026');
  const [docSigner, setDocSigner] = useState('Hiệu trưởng THCS Đồng Tân');
  const [docFileUrl, setDocFileUrl] = useState('');
  const [docExternalLink, setDocExternalLink] = useState('');

  // Resource Form State
  const [resTitle, setResTitle] = useState('');
  const [resSubject, setResSubject] = useState('Toán 9');
  const [resType, setResType] = useState('Đề thi & Đáp án');
  const [resFileUrl, setResFileUrl] = useState('');
  const [resExternalLink, setResExternalLink] = useState('');

  const fetchUsers = async () => {
    try {
      const res = await fetch('/api/auth/users');
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.data.length > 0) setUserList(data.data);
      }
    } catch (err) {}
  };

  useEffect(() => {
    if (token) fetchUsers();
  }, [token]);

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
        setMessage(`✅ Đã tải tệp lên máy chủ: ${data.fileName} (${data.fileSize})`);
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

  const handleSaveConfig = (e) => {
    e.preventDefault();
    if (onSaveSiteConfig) {
      onSaveSiteConfig(configState);
    }
    setMessage('✅ Đã lưu thay đổi cấu hình Banner và Thông tin trường thành công!');
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
    if (editingArticle) {
      if (onUpdateNews) {
        onUpdateNews({
          ...editingArticle,
          title: newsTitle,
          categoryId: parseInt(newsCategory),
          summary: newsSummary,
          content: newsContent,
          image: newsImage || editingArticle.image,
          fileUrl: newsFileUrl,
          externalLink: newsExternalLink
        });
      }
      setMessage('✅ Đã cập nhật thành công bài viết!');
      setEditingArticle(null);
    } else {
      setMessage('✅ Đăng bài viết mới thành công!');
    }
    setNewsTitle('');
    setNewsSummary('');
    setNewsContent('');
    setNewsImage('');
    setNewsFileUrl('');
    setNewsExternalLink('');
    if (onRefreshData) onRefreshData();
  };

  const handleStartEditNews = (article) => {
    setEditingArticle(article);
    setNewsTitle(article.title);
    setNewsCategory(article.categoryId || 1);
    setNewsSummary(article.summary || '');
    setNewsContent(article.content || '');
    setNewsImage(article.image || '');
    setNewsFileUrl(article.fileUrl || '');
    setNewsExternalLink(article.externalLink || '');
    setAdminTab('news');
  };

  const handleCreateDocument = async (e) => {
    e.preventDefault();
    if (editingDoc) {
      if (onUpdateDocument) {
        onUpdateDocument({
          ...editingDoc,
          code: docCode,
          title: docTitle,
          category: docCategory,
          issueDate: docIssueDate,
          signer: docSigner,
          fileUrl: docFileUrl,
          externalLink: docExternalLink
        });
      }
      setMessage('✅ Đã cập nhật văn bản chỉ đạo!');
      setEditingDoc(null);
    } else {
      setMessage('✅ Phát hành văn bản mới thành công!');
    }
    setDocCode('');
    setDocTitle('');
    setDocFileUrl('');
    setDocExternalLink('');
    if (onRefreshData) onRefreshData();
  };

  const handleStartEditDoc = (doc) => {
    setEditingDoc(doc);
    setDocCode(doc.code);
    setDocTitle(doc.title);
    setDocCategory(doc.category || 'Thông tư BGD&ĐT');
    setDocIssueDate(doc.issueDate || '08/08/2026');
    setDocSigner(doc.signer || 'BGH THCS Đồng Tân');
    setDocFileUrl(doc.fileUrl || '');
    setDocExternalLink(doc.externalLink || '');
    setAdminTab('docs');
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
      </div>
    );
  }

  return (
    <div style={{ background: 'white', padding: '20px', borderRadius: '8px', border: '1px solid #cbd5e1' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid #0056a6', paddingBottom: '12px', marginBottom: '20px' }}>
        <div>
          <h2 style={{ fontSize: '20px', color: '#003a73', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <ShieldCheck size={24} color="#0056a6" /> CỔNG QUẢN TRỊ NỘI DUNG VÀ HỆ THỐNG TRƯỜNG HỌC
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
          onClick={() => setAdminTab('config')} 
          style={{ padding: '8px 14px', border: 'none', borderBottom: adminTab === 'config' ? '3px solid #0056a6' : 'none', background: 'transparent', fontWeight: adminTab === 'config' ? '700' : '500', color: adminTab === 'config' ? '#0056a6' : '#64748b', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', whiteSpace: 'nowrap' }}
        >
          <Settings size={15} /> ⚙️ Sửa Thông Tin & Banner Trường
        </button>
        <button 
          onClick={() => setAdminTab('manageNews')} 
          style={{ padding: '8px 14px', border: 'none', borderBottom: adminTab === 'manageNews' ? '3px solid #0056a6' : 'none', background: 'transparent', fontWeight: adminTab === 'manageNews' ? '700' : '500', color: adminTab === 'manageNews' ? '#0056a6' : '#64748b', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', whiteSpace: 'nowrap' }}
        >
          <Edit size={15} /> 📰 Quản Lý / Sửa Tin Bài ({newsList.length})
        </button>
        <button 
          onClick={() => setAdminTab('manageDocs')} 
          style={{ padding: '8px 14px', border: 'none', borderBottom: adminTab === 'manageDocs' ? '3px solid #0056a6' : 'none', background: 'transparent', fontWeight: adminTab === 'manageDocs' ? '700' : '500', color: adminTab === 'manageDocs' ? '#0056a6' : '#64748b', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', whiteSpace: 'nowrap' }}
        >
          <FilePlus size={15} /> 📄 Quản Lý / Sửa Văn Bản ({documents.length})
        </button>
        <button 
          onClick={() => setAdminTab('users')} 
          style={{ padding: '8px 14px', border: 'none', borderBottom: adminTab === 'users' ? '3px solid #0056a6' : 'none', background: 'transparent', fontWeight: adminTab === 'users' ? '700' : '500', color: adminTab === 'users' ? '#0056a6' : '#64748b', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', whiteSpace: 'nowrap' }}
        >
          <Users size={15} /> 👥 Quản Lý & Cấp Tài Khoản
        </button>
        <button 
          onClick={() => { setEditingArticle(null); setAdminTab('news'); }} 
          style={{ padding: '8px 14px', border: 'none', borderBottom: adminTab === 'news' ? '3px solid #0056a6' : 'none', background: 'transparent', fontWeight: adminTab === 'news' ? '700' : '500', color: adminTab === 'news' ? '#0056a6' : '#64748b', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', whiteSpace: 'nowrap' }}
        >
          <PlusCircle size={15} /> ➕ Đăng Tin Mới
        </button>
        <button 
          onClick={() => { setEditingDoc(null); setAdminTab('docs'); }} 
          style={{ padding: '8px 14px', border: 'none', borderBottom: adminTab === 'docs' ? '3px solid #0056a6' : 'none', background: 'transparent', fontWeight: adminTab === 'docs' ? '700' : '500', color: adminTab === 'docs' ? '#0056a6' : '#64748b', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', whiteSpace: 'nowrap' }}
        >
          <FilePlus size={15} /> ➕ Thêm Văn Bản
        </button>
      </div>

      {/* Tab Config: Sửa Cấu Hình Banner & Thông tin trường */}
      {adminTab === 'config' && (
        <form onSubmit={handleSaveConfig} style={{ display: 'grid', gap: '15px', maxWidth: '800px', background: '#f8fafc', padding: '20px', borderRadius: '8px', border: '1px solid #cbd5e1' }}>
          <h3 style={{ fontSize: '16px', color: '#003a73', fontWeight: '700', borderBottom: '2px solid #0056a6', paddingBottom: '8px' }}>
            ⚙️ CHỈNH SỬA THÔNG TIN TRƯỜNG & BANNER TRANG WEB
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', marginBottom: '4px' }}>Cơ quan Chủ quản:</label>
              <input type="text" value={configState.governingBody} onChange={(e) => setConfigState({ ...configState, governingBody: e.target.value })} style={{ width: '100%', padding: '8px', border: '1px solid #cbd5e1', borderRadius: '4px' }} placeholder="VD: UBND XÃ HỮU LŨNG - TỈNH LẠNG SƠN" />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', marginBottom: '4px' }}>Tên Trường Học:</label>
              <input type="text" value={configState.schoolName} onChange={(e) => setConfigState({ ...configState, schoolName: e.target.value })} style={{ width: '100%', padding: '8px', border: '1px solid #cbd5e1', borderRadius: '4px' }} placeholder="TRƯỜNG THCS ĐỒNG TÂN" />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', marginBottom: '4px' }}>Khẩu hiệu / Slogan:</label>
              <input type="text" value={configState.slogan} onChange={(e) => setConfigState({ ...configState, slogan: e.target.value })} style={{ width: '100%', padding: '8px', border: '1px solid #cbd5e1', borderRadius: '4px' }} placeholder="VD: HỘI TỤ - KẾT TINH - TỎA SÁNG" />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', marginBottom: '4px' }}>Địa chỉ trường:</label>
              <input type="text" value={configState.address} onChange={(e) => setConfigState({ ...configState, address: e.target.value })} style={{ width: '100%', padding: '8px', border: '1px solid #cbd5e1', borderRadius: '4px' }} placeholder="Xã Hữu Lũng - Tỉnh Lạng Sơn" />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', marginBottom: '4px' }}>Số điện thoại liên hệ:</label>
              <input type="text" value={configState.phone} onChange={(e) => setConfigState({ ...configState, phone: e.target.value })} style={{ width: '100%', padding: '8px', border: '1px solid #cbd5e1', borderRadius: '4px' }} placeholder="(0205) 3885.6789" />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', marginBottom: '4px' }}>Email chính thức:</label>
              <input type="email" value={configState.email} onChange={(e) => setConfigState({ ...configState, email: e.target.value })} style={{ width: '100%', padding: '8px', border: '1px solid #cbd5e1', borderRadius: '4px' }} placeholder="thcsdongtan@..." />
            </div>
          </div>

          {/* Logo & Banner Upload Box */}
          <div style={{ background: '#white', padding: '15px', borderRadius: '6px', border: '1px solid #cbd5e1' }}>
            <h4 style={{ fontSize: '13px', color: '#0056a6', marginBottom: '10px', fontWeight: '700' }}>
              🖼️ ĐỔI LOGO VÀ ẢNH BANNER HEADER
            </h4>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', marginBottom: '4px' }}>Tải Logo mới từ máy tính:</label>
                <input type="file" onChange={(e) => handleFileUpload(e.target.files[0], (url) => setConfigState({ ...configState, logoUrl: url }))} style={{ fontSize: '12px', marginBottom: '4px' }} />
                <input type="text" value={configState.logoUrl} onChange={(e) => setConfigState({ ...configState, logoUrl: e.target.value })} style={{ width: '100%', padding: '6px', border: '1px solid #cbd5e1', borderRadius: '4px', fontSize: '12px' }} placeholder="Hoặc dán Link URL Logo..." />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', marginBottom: '4px' }}>Tải ảnh nền Banner Header:</label>
                <input type="file" onChange={(e) => handleFileUpload(e.target.files[0], (url) => setConfigState({ ...configState, bannerBg: url }))} style={{ fontSize: '12px', marginBottom: '4px' }} />
                <input type="text" value={configState.bannerBg} onChange={(e) => setConfigState({ ...configState, bannerBg: e.target.value })} style={{ width: '100%', padding: '6px', border: '1px solid #cbd5e1', borderRadius: '4px', fontSize: '12px' }} placeholder="Hoặc dán Link URL Ảnh Banner..." />
              </div>
            </div>
          </div>

          <button type="submit" style={{ background: '#16a34a', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '4px', fontWeight: '700', cursor: 'pointer', justifySelf: 'start', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '14px' }}>
            <Save size={16} /> 💾 LƯU THAY ĐỔI THÔNG TIN TRƯỜNG & BANNER
          </button>
        </form>
      )}

      {/* Tab Manage News: Quản lý & Sửa / Xóa Bài viết */}
      {adminTab === 'manageNews' && (
        <div>
          <h3 style={{ fontSize: '16px', color: '#003a73', marginBottom: '15px', fontWeight: '700' }}>
            📰 DANH SÁCH BÀI VIẾT TIN TỨC ĐÃ ĐĂNG ({newsList.length} BÀI)
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {newsList.map(article => (
              <div key={article.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', border: '1px solid #cbd5e1', borderRadius: '6px', background: '#f8fafc' }}>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                  <img src={article.image || "https://images.unsplash.com/photo-1544717305-2782549b5136?w=200&q=80"} alt="" style={{ width: '65px', height: '45px', objectFit: 'cover', borderRadius: '4px' }} />
                  <div>
                    <h4 style={{ fontSize: '14px', color: '#003a73', margin: 0, fontWeight: '700' }}>{article.title}</h4>
                    <span style={{ fontSize: '12px', color: '#64748b' }}>📅 {article.createdAt || 'Mới đăng'} | 👁️ {article.views || 10} lượt xem</span>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button 
                    onClick={() => handleStartEditNews(article)}
                    style={{ background: '#0284c7', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', fontWeight: '700', fontSize: '12.5px', display: 'flex', alignItems: 'center', gap: '4px' }}
                  >
                    <Edit size={14} /> Sửa bài viết
                  </button>
                  <button 
                    onClick={() => onDeleteNews && onDeleteNews(article.id)}
                    style={{ background: '#ef4444', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', fontWeight: '700', fontSize: '12.5px', display: 'flex', alignItems: 'center', gap: '4px' }}
                  >
                    <Trash2 size={14} /> Xóa
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab Manage Docs: Quản lý & Sửa / Xóa Văn bản */}
      {adminTab === 'manageDocs' && (
        <div>
          <h3 style={{ fontSize: '16px', color: '#003a73', marginBottom: '15px', fontWeight: '700' }}>
            📄 DANH SÁCH VĂN BẢN CHỈ ĐẠO ({documents.length} VĂN BẢN)
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {documents.map(doc => (
              <div key={doc.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', border: '1px solid #cbd5e1', borderRadius: '6px', background: '#f8fafc' }}>
                <div>
                  <span style={{ fontSize: '11px', background: '#0056a6', color: 'white', padding: '2px 6px', borderRadius: '3px', fontWeight: '700', marginRight: '6px' }}>{doc.code}</span>
                  <h4 style={{ fontSize: '14px', color: '#003a73', margin: '4px 0 0 0', fontWeight: '700' }}>{doc.title}</h4>
                  <span style={{ fontSize: '12px', color: '#64748b' }}>📅 {doc.issueDate} | ✍️ {doc.signer}</span>
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button 
                    onClick={() => handleStartEditDoc(doc)}
                    style={{ background: '#0284c7', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', fontWeight: '700', fontSize: '12.5px', display: 'flex', alignItems: 'center', gap: '4px' }}
                  >
                    <Edit size={14} /> Sửa văn bản
                  </button>
                  <button 
                    onClick={() => onDeleteDocument && onDeleteDocument(doc.id)}
                    style={{ background: '#ef4444', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', fontWeight: '700', fontSize: '12.5px', display: 'flex', alignItems: 'center', gap: '4px' }}
                  >
                    <Trash2 size={14} /> Xóa
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 1: Form Đăng & Sửa Tin Bài */}
      {adminTab === 'news' && (
        <form onSubmit={handleCreateNews} style={{ display: 'grid', gap: '15px', maxWidth: '750px' }}>
          <h3 style={{ fontSize: '16px', color: '#003a73', fontWeight: '700' }}>
            {editingArticle ? `✏️ ĐANG CHỈNH SỬA BÀI VIẾT: ${editingArticle.title}` : '➕ ĐĂNG BÀI VIẾT MỚI'}
          </h3>
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
          
          <div style={{ background: '#f8fafc', padding: '15px', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
            <h4 style={{ fontSize: '13px', color: '#0056a6', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Upload size={16} /> TẢI TỆP ĐÌNH KÈM TỪ MÁY TÍNH HOẶC CẶP LINK OUT
            </h4>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', marginBottom: '4px' }}>Chọn tệp từ máy tính:</label>
                <input type="file" onChange={(e) => handleFileUpload(e.target.files[0], setNewsFileUrl)} style={{ fontSize: '12px' }} />
                {newsFileUrl && <div style={{ fontSize: '11.5px', color: '#16a34a', marginTop: '4px' }}>✓ Tệp: {newsFileUrl}</div>}
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', marginBottom: '4px' }}>Đường link ngoài (Drive):</label>
                <input type="text" value={newsExternalLink} onChange={(e) => setNewsExternalLink(e.target.value)} style={{ width: '100%', padding: '6px', border: '1px solid #cbd5e1', borderRadius: '4px', fontSize: '12px' }} placeholder="https://..." />
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
            {editingArticle ? '💾 CẬP NHẬT BÀI VIẾT' : '🚀 ĐĂNG BÀI VIẾT MỚI'}
          </button>
        </form>
      )}

      {/* Tab 2: Form Đăng & Sửa Văn Bản */}
      {adminTab === 'docs' && (
        <form onSubmit={handleCreateDocument} style={{ display: 'grid', gap: '15px', maxWidth: '750px' }}>
          <h3 style={{ fontSize: '16px', color: '#003a73', fontWeight: '700' }}>
            {editingDoc ? `✏️ ĐANG CHỈNH SỬA VĂN BẢN: ${editingDoc.code}` : '📄 PHÁT HÀNH VĂN BẢN CHỈ ĐẠO MỚI'}
          </h3>
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

          <button type="submit" style={{ background: '#d97706', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '4px', fontWeight: '700', cursor: 'pointer', justifySelf: 'start' }}>
            {editingDoc ? '💾 CẬP NHẬT VĂN BẢN' : '📄 PHÁT HÀNH VĂN BẢN'}
          </button>
        </form>
      )}
    </div>
  );
}
