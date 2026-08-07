import React, { useState, useEffect } from 'react';
import HeaderBanner from './components/HeaderBanner';
import Navbar from './components/Navbar';
import SubBar from './components/SubBar';
import LeftSidebar from './components/LeftSidebar';
import MainNewsCenter from './components/MainNewsCenter';
import RightSidebar from './components/RightSidebar';
import NewsDetailModal from './components/NewsDetailModal';
import DocumentDetailModal from './components/DocumentDetailModal';
import QuickUploadModal from './components/QuickUploadModal';
import RegisterModal from './components/RegisterModal';
import AdminPortal from './components/AdminPortal';
import IntroView from './components/IntroView';
import AlbumsView from './components/AlbumsView';
import VideosView from './components/VideosView';
import ResourcesView from './components/ResourcesView';
import ScheduleView from './components/ScheduleView';
import ContactView from './components/ContactView';
import Footer from './components/Footer';

// Initial Fallback Site Config
const INITIAL_SITE_CONFIG = {
  schoolName: 'TRƯỜNG THCS ĐỒNG TÂN',
  governingBody: 'ỦY BAN NHÂN DÂN XÃ HỮU LŨNG - TỈNH LẠNG SƠN',
  slogan: 'HỘI TỤ - KẾT TINH - TỎA SÁNG',
  address: 'Xã Hữu Lũng - Tỉnh Lạng Sơn',
  phone: '(0205) 3885.6789',
  email: 'thcsdongtan.huulung@langson.edu.vn',
  logoUrl: 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=300&q=80',
  bannerBg: ''
};

// Initial Fallback Data
const INITIAL_CATEGORIES = [
  { id: 1, name: 'Tin tức - Sự kiện', slug: 'tin-tuc-su-kien', articleCount: 3 },
  { id: 2, name: 'Hoạt động chuyên môn', slug: 'hoat-dong-chuyen-mon', articleCount: 2 },
  { id: 3, name: 'Hoạt động đoàn thể', slug: 'hoat-dong-doan-the', articleCount: 1 },
  { id: 4, name: 'Hoạt động ngoại khóa', slug: 'hoat-dong-ngoai-khoa', articleCount: 1 },
  { id: 5, name: 'Câu lạc bộ', slug: 'cau-lac-bo', articleCount: 1 }
];

const INITIAL_FEATURED_NEWS = {
  id: 1,
  title: 'Lễ kết nạp Đảng viên mới cho cán bộ giáo viên THCS Đồng Tân',
  slug: 'le-ket-nap-dang-vien-moi',
  categoryId: 1,
  categoryName: 'Tin tức - Sự kiện',
  summary: 'Vào lúc 14 giờ 00, Chi bộ trường THCS Đồng Tân đã long trọng tổ chức Lễ kết nạp Đảng viên cho giáo viên ưu tú có nhiều thành tích xuất sắc.',
  content: 'Chiều ngày 04/08/2026, Chi bộ Trường THCS Đồng Tân đã tiến hành Lễ kết nạp Đảng viên cho quần chúng ưu tú. Buổi lễ diễn ra trong không khí trang nghiêm, đúng trình tự, thủ tục của Điều lệ Đảng. Đồng chí Bí thư Chi bộ đã trao Quyết định kết nạp và phân công Đảng viên chính thức tiếp tục giúp đỡ đồng chí Đảng viên mới phát huy tinh thần trách nhiệm trong công tác giảng dạy và phong trào thi đua của nhà trường.',
  image: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=800&q=80',
  author: 'Ban Biên Tập THCS Đồng Tân',
  isFeatured: 1,
  views: 1250,
  createdAt: '2026-08-04 08:00:00'
};

const INITIAL_NEWS_LIST = [
  INITIAL_FEATURED_NEWS,
  {
    id: 2,
    title: 'Bộ GD&ĐT ban hành Chỉ thị về nhiệm vụ trọng tâm năm học 2026 - 2027',
    slug: 'bo-gddt-ban-hanh-chi-thi-nhiem-vu-trong-tam',
    categoryId: 2,
    categoryName: 'Hoạt động chuyên môn',
    summary: 'Tập trung nâng cao chất lượng giáo dục toàn diện, đẩy mạnh chuyển đổi số trong công tác quản lý và giảng dạy tại các trường phổ thông.',
    content: 'Bộ Giáo dục và Đào tạo vừa chính thức ban hành Chỉ thị định hướng nhiệm vụ năm học mới. Trong đó nhấn mạnh đổi mới phương pháp dạy học lấy học sinh làm trung tâm, ứng dụng công nghệ thông tin và AI trong hỗ trợ dạy và học, chú trọng giáo dục đạo đức, kỹ năng sống cho học sinh.',
    image: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=800&q=80',
    author: 'Phòng Giáo Dục & Đào Tạo',
    views: 940,
    createdAt: '2026-08-03 10:30:00'
  },
  {
    id: 3,
    title: 'Tiếp nhận thiết bị dạy học môn Vật lý & Sinh học từ Ngân hàng hỗ trợ giáo dục',
    slug: 'tiep-nhan-thiet-bi-day-hoc-mon-vat-ly',
    categoryId: 2,
    categoryName: 'Hoạt động chuyên môn',
    summary: 'Trường THCS Đồng Tân vừa tiếp nhận lô thiết bị thí nghiệm hiện đại hỗ trợ thực hành môn Vật lý và Khoa học tự nhiên.',
    content: 'Sáng nay nhà trường đã tiếp nhận đầy đủ trang thiết bị thực hành phục vụ năm học mới. Ban Giám hiệu đã giao Tổ Tự nhiên kiểm kê, đưa vào phòng bộ môn để sẵn sàng phục vụ học sinh trải nghiệm sáng tạo.',
    image: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=800&q=80',
    author: 'Tổ KHTN',
    views: 780,
    createdAt: '2026-08-02 14:15:00'
  }
];

const INITIAL_DOCUMENTS = [
  {
    id: 1,
    code: 'TT07/2026/TT-BGDĐT',
    title: 'Thông tư 07/2026/TT-BGDĐT về Phổ cập giáo dục THCS và Xóa mù chữ năm 2026',
    category: 'Thông tư BGD&ĐT',
    issueDate: '04/08/2026',
    signer: 'Bộ trưởng BGD&ĐT',
    views: 4830,
    downloads: 1722,
    fileUrl: '#'
  },
  {
    id: 2,
    code: 'TT42/2025/TT-BGDĐT',
    title: 'Quy chế công nhận trường Trung học đạt chuẩn quốc gia cấp độ 2',
    category: 'Quy chế Nhà trường',
    issueDate: '15/12/2025',
    signer: 'Thứ trưởng BGD&ĐT',
    views: 3410,
    downloads: 1205,
    fileUrl: '#'
  }
];

const INITIAL_VIDEOS = [
  {
    id: 1,
    title: 'Phim tư liệu: 40 năm truyền thống Dạy tốt - Học tốt THCS Đồng Tân',
    youtubeId: 'dQw4w9WgXcQ',
    thumbnailUrl: 'https://images.unsplash.com/photo-1577896851231-70ef18881754?w=600&q=80',
    views: 1540
  }
];

const INITIAL_ALBUMS = [
  {
    id: 1,
    title: 'Album: Lễ Khai giảng năm học 2026 - 2027 THCS Đồng Tân',
    date: '05/09/2026',
    photosCount: 18,
    cover: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=600&q=80',
    description: 'Hình ảnh rực rỡ cờ hoa trong ngày hội Khai trường.'
  }
];

const INITIAL_RESOURCES = [
  {
    id: 1,
    title: 'Đề thi Học kỳ 1 môn Ngữ Văn lớp 9 năm học 2026 - 2027 (Có đáp án)',
    type: 'Đề thi & Đáp án',
    subject: 'Ngữ Văn 9',
    author: 'Tổ Xã Hội',
    date: '02/01/2027',
    downloads: 450,
    fileUrl: '#',
    externalLink: 'https://drive.google.com'
  }
];

const INITIAL_SCHEDULES = [
  { day: 'Thứ Hai (08/02)', time: '07:30 - 08:15', content: 'Lễ Chào cờ đầu tuần & Tuyên dương thi đua tuần qua', leader: 'Toàn trường' }
];

const INITIAL_ANNOUNCEMENTS = [
  { id: 1, content: 'Chào mừng quý phụ huynh và học sinh đến với trang Web chính thức của trường THCS Đồng Tân, Xã Hữu Lũng, Lạng Sơn!' }
];

export default function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [selectedCategory, setSelectedCategory] = useState(null);

  // Dynamic Site Config
  const [siteConfig, setSiteConfig] = useState(() => {
    const saved = localStorage.getItem('siteConfig');
    return saved ? JSON.parse(saved) : INITIAL_SITE_CONFIG;
  });
  
  // Dynamic State List
  const [categories, setCategories] = useState(INITIAL_CATEGORIES);
  const [featuredNews, setFeaturedNews] = useState(INITIAL_FEATURED_NEWS);
  const [newsList, setNewsList] = useState(INITIAL_NEWS_LIST);
  const [documents, setDocuments] = useState(INITIAL_DOCUMENTS);
  const [videos, setVideos] = useState(INITIAL_VIDEOS);
  const [albums, setAlbums] = useState(INITIAL_ALBUMS);
  const [resources, setResources] = useState(INITIAL_RESOURCES);
  const [schedules, setSchedules] = useState(INITIAL_SCHEDULES);
  const [announcements, setAnnouncements] = useState(INITIAL_ANNOUNCEMENTS);

  // Modal States
  const [selectedArticleId, setSelectedArticleId] = useState(null);
  const [activeArticle, setActiveArticle] = useState(null);
  
  const [selectedDocumentId, setSelectedDocumentId] = useState(null);
  const [activeDocument, setActiveDocument] = useState(null);

  // Quick Upload & Register Modal States
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadDefaultTab, setUploadDefaultTab] = useState('docs');
  const [showRegisterModal, setShowRegisterModal] = useState(false);

  // Admin Auth State
  const [token, setToken] = useState(localStorage.getItem('adminToken') || '');
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('adminUser') || 'null'));

  const handleSaveSiteConfig = (newConfig) => {
    setSiteConfig(newConfig);
    localStorage.setItem('siteConfig', JSON.stringify(newConfig));
  };

  const handleUpdateNews = (updatedArticle) => {
    setNewsList(prev => prev.map(a => a.id === updatedArticle.id ? updatedArticle : a));
    if (featuredNews?.id === updatedArticle.id) {
      setFeaturedNews(updatedArticle);
    }
  };

  const handleDeleteNews = (articleId) => {
    setNewsList(prev => prev.filter(a => a.id !== articleId));
  };

  const handleUpdateDocument = (updatedDoc) => {
    setDocuments(prev => prev.map(d => d.id === updatedDoc.id ? updatedDoc : d));
  };

  const handleDeleteDocument = (docId) => {
    setDocuments(prev => prev.filter(d => d.id !== docId));
  };

  const fetchData = async () => {
    try {
      const catRes = await fetch('/api/news/categories');
      if (catRes.ok) {
        const catData = await catRes.json();
        if (catData.success && catData.data.length > 0) setCategories(catData.data);
      }

      const featRes = await fetch('/api/news/featured');
      if (featRes.ok) {
        const featData = await featRes.json();
        if (featData.success && featData.data) setFeaturedNews(featData.data);
      }

      let newsUrl = '/api/news';
      if (selectedCategory) newsUrl += `?categoryId=${selectedCategory}`;
      const newsRes = await fetch(newsUrl);
      if (newsRes.ok) {
        const newsData = await newsRes.json();
        if (newsData.success && newsData.data.length > 0) setNewsList(newsData.data);
      }

      const docRes = await fetch('/api/documents');
      if (docRes.ok) {
        const docData = await docRes.json();
        if (docData.success && docData.data.length > 0) setDocuments(docData.data);
      }

      const vidRes = await fetch('/api/media/videos');
      if (vidRes.ok) {
        const vidData = await vidRes.json();
        if (vidData.success && vidData.data.length > 0) setVideos(vidData.data);
      }

      const annRes = await fetch('/api/announcements');
      if (annRes.ok) {
        const annData = await annRes.json();
        if (annData.success && annData.data.length > 0) setAnnouncements(annData.data);
      }

    } catch (err) {
      console.log('API sync status: Using fallback state when offline.');
    }
  };

  useEffect(() => {
    fetchData();
  }, [selectedCategory]);

  const handleAddNewItem = (type, newItem) => {
    if (type === 'docs') {
      setDocuments(prev => [newItem, ...prev]);
      setActiveTab('documents');
    } else if (type === 'resources') {
      setResources(prev => [newItem, ...prev]);
      setActiveTab('resources');
    } else if (type === 'news') {
      setNewsList(prev => [newItem, ...prev]);
      setFeaturedNews(newItem);
      setActiveTab('home');
    } else if (type === 'albums') {
      setAlbums(prev => [newItem, ...prev]);
      setActiveTab('albums');
    } else if (type === 'videos') {
      setVideos(prev => [newItem, ...prev]);
      setActiveTab('videos');
    } else if (type === 'schedule') {
      setSchedules(prev => [newItem, ...prev]);
      setActiveTab('schedule');
    }
  };

  const handleOpenUpload = (tab = 'docs') => {
    setUploadDefaultTab(tab);
    setShowUploadModal(true);
  };

  const handleSelectArticle = async (id) => {
    try {
      const res = await fetch(`/api/news/${id}`);
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.data) {
          setActiveArticle(data.data);
          setSelectedArticleId(id);
          return;
        }
      }
    } catch (err) {}
    const found = newsList.find(n => n.id === id);
    if (found) {
      setActiveArticle(found);
      setSelectedArticleId(id);
    }
  };

  const handleSelectDocument = async (id) => {
    try {
      const res = await fetch(`/api/documents/${id}`);
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.data) {
          setActiveDocument(data.data);
          setSelectedDocumentId(id);
          return;
        }
      }
    } catch (err) {}
    const found = documents.find(d => d.id === id);
    if (found) {
      setActiveDocument(found);
      setSelectedDocumentId(id);
    }
  };

  const handleDownloadDocument = async (id) => {
    try {
      await fetch(`/api/documents/${id}/download`, { method: 'POST' });
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleLoginSuccess = (newToken, newUser) => {
    setToken(newToken);
    setUser(newUser);
    localStorage.setItem('adminToken', newToken);
    localStorage.setItem('adminUser', JSON.stringify(newUser));
  };

  const handleLogout = () => {
    setToken('');
    setUser(null);
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
  };

  const handleSearch = async (query) => {
    if (!query) {
      fetchData();
      return;
    }
    try {
      const res = await fetch(`/api/news?q=${encodeURIComponent(query)}`);
      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          setNewsList(data.data);
          return;
        }
      }
    } catch (err) {
      console.error(err);
    }
    const filtered = newsList.filter(n => n.title.toLowerCase().includes(query.toLowerCase()));
    setNewsList(filtered);
  };

  return (
    <div className="site-container">
      <HeaderBanner siteConfig={siteConfig} />

      <Navbar 
        activeTab={activeTab} 
        setActiveTab={(tab) => {
          setActiveTab(tab);
          setSelectedCategory(null);
        }} 
        onOpenAdmin={() => setActiveTab('admin')} 
        onOpenUpload={() => handleOpenUpload('docs')}
        onOpenRegister={() => setShowRegisterModal(true)}
      />

      <SubBar announcements={announcements} onSearch={handleSearch} />

      {/* View Switcher per Navbar item */}
      {activeTab === 'admin' ? (
        <div style={{ padding: '20px' }}>
          <AdminPortal 
            token={token} 
            user={user} 
            onLogin={handleLoginSuccess} 
            onLogout={handleLogout} 
            categories={categories}
            siteConfig={siteConfig}
            onSaveSiteConfig={handleSaveSiteConfig}
            newsList={newsList}
            documents={documents}
            resources={resources}
            onUpdateNews={handleUpdateNews}
            onDeleteNews={handleDeleteNews}
            onUpdateDocument={handleUpdateDocument}
            onDeleteDocument={handleDeleteDocument}
            onRefreshData={fetchData}
          />
        </div>
      ) : activeTab === 'intro' ? (
        <IntroView siteConfig={siteConfig} />
      ) : activeTab === 'albums' ? (
        <AlbumsView albums={albums} />
      ) : activeTab === 'videos' ? (
        <VideosView videos={videos} />
      ) : activeTab === 'resources' ? (
        <ResourcesView resources={resources} onOpenUpload={handleOpenUpload} />
      ) : activeTab === 'schedule' ? (
        <ScheduleView schedule={schedules} />
      ) : activeTab === 'contact' ? (
        <ContactView siteConfig={siteConfig} />
      ) : activeTab === 'documents' ? (
        <div style={{ padding: '20px' }}>
          <div className="widget-box">
            <div className="widget-header orange" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>📄 TRA CỨU VĂN BẢN CHỈ ĐẠO & QUY CHẾ THCS ĐỒNG TÂN</span>

              <button 
                style={{ background: '#16a34a', color: 'white', border: 'none', padding: '5px 12px', borderRadius: '4px', cursor: 'pointer', fontWeight: '700', fontSize: '12px' }}
                onClick={() => handleOpenUpload('docs')}
              >
                📤 TẢI VĂN BẢN MỚI LÊN
              </button>
            </div>
            <div className="widget-body">
              <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                {documents.map((doc) => (
                  <div key={doc.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #e2e8f0', paddingBottom: '12px' }}>
                    <div>
                      <span style={{ fontSize: '12px', background: '#0056a6', color: 'white', padding: '2px 8px', borderRadius: '3px', fontWeight: '700' }}>
                        {doc.code}
                      </span>
                      <h3 style={{ fontSize: '15px', color: '#003a73', marginTop: '6px', cursor: 'pointer' }} onClick={() => handleSelectDocument(doc.id)}>
                        {doc.title}
                      </h3>
                      <div style={{ fontSize: '12px', color: '#64748b', marginTop: '4px' }}>
                        📅 Ban hành: {doc.issueDate} | ✍️ Người ký: {doc.signer} | 📂 {doc.category}
                      </div>
                    </div>
                    <button 
                      style={{ background: '#0284c7', color: 'white', border: 'none', padding: '6px 14px', borderRadius: '4px', cursor: 'pointer', fontWeight: '600', whiteSpace: 'nowrap' }}
                      onClick={() => handleSelectDocument(doc.id)}
                    >
                      Xem & Tải về
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Home / News Standard 3 Column Portal Layout */
        <div className="main-layout">
          <LeftSidebar 
            categories={categories} 
            latestNews={newsList} 
            selectedCategory={selectedCategory} 
            onSelectCategory={(catId) => setSelectedCategory(catId)}
            onSelectArticle={handleSelectArticle}
          />

          <MainNewsCenter 
            featuredArticle={featuredNews || newsList[0]} 
            secondaryArticles={newsList.slice(1, 4)} 
            allArticles={newsList}
            onSelectArticle={handleSelectArticle}
          />

          <RightSidebar 
            videos={videos} 
            documents={documents} 
            onSelectDocument={handleSelectDocument}
          />
        </div>
      )}

      {/* Modal View Detail News */}
      {selectedArticleId && activeArticle && (
        <NewsDetailModal 
          article={activeArticle} 
          onClose={() => {
            setSelectedArticleId(null);
            setActiveArticle(null);
          }} 
        />
      )}

      {/* Modal View Detail Document */}
      {selectedDocumentId && activeDocument && (
        <DocumentDetailModal 
          document={activeDocument} 
          onClose={() => {
            setSelectedDocumentId(null);
            setActiveDocument(null);
          }}
          onDownload={handleDownloadDocument}
        />
      )}

      {/* Quick Upload Popup Modal */}
      {showUploadModal && (
        <QuickUploadModal 
          defaultTab={uploadDefaultTab} 
          categories={categories} 
          onClose={() => setShowUploadModal(false)}
          onAddNewItem={handleAddNewItem}
        />
      )}

      {/* Member Registration Modal */}
      {showRegisterModal && (
        <RegisterModal 
          onClose={() => setShowRegisterModal(false)} 
        />
      )}

      <Footer siteConfig={siteConfig} />
    </div>
  );
}
