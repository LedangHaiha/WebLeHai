import React, { useState } from 'react';
import { Video, Play, Eye, ExternalLink, Upload, AlertTriangle } from 'lucide-react';

export default function VideosView({ videos = [], onOpenUpload }) {
  const videoList = videos.length > 0 ? videos : [
    {
      id: 1,
      title: 'Phim tư liệu: 40 năm truyền thống Dạy tốt - Học tốt THCS Đồng Tân',
      youtubeId: 'k8F4q_N-g_w',
      thumbnailUrl: 'https://images.unsplash.com/photo-1577896851231-70ef18881754?w=600&q=80',
      views: 1540
    },
    {
      id: 2,
      title: 'Hoạt động trải nghiệm sáng tạo STEM môn Sinh - Hóa lớp 9',
      youtubeId: 'dQw4w9WgXcQ',
      thumbnailUrl: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&q=80',
      views: 920
    }
  ];

  const [activeVideo, setActiveVideo] = useState(videoList[0]);
  const [iframeError, setIframeError] = useState(false);

  const handleSelectVideo = (vid) => {
    setActiveVideo(vid);
    setIframeError(false);
  };

  const isLocalVideo = activeVideo?.videoUrl || (activeVideo?.fileUrl && (activeVideo.fileUrl.endsWith('.mp4') || activeVideo.fileUrl.startsWith('/uploads')));
  const videoSrc = activeVideo?.videoUrl || activeVideo?.fileUrl;

  return (
    <div style={{ padding: '20px', maxWidth: '1100px', margin: '0 auto' }}>
      <div className="widget-box">
        <div className="widget-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Video size={18} /> THƯ VIỆN VIDEO HOẠT ĐỘNG THCS ĐỒNG TÂN
          </span>

          <button 
            style={{ background: '#16a34a', color: 'white', border: 'none', padding: '5px 12px', borderRadius: '4px', cursor: 'pointer', fontWeight: '700', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '5px' }}
            onClick={() => onOpenUpload && onOpenUpload('videos')}
          >
            <Upload size={14} /> 📤 ĐĂNG / TẢI VIDEO MỚI LÊN
          </button>
        </div>

        <div className="widget-body" style={{ padding: '20px' }}>
          
          {/* Main Active Video Player */}
          {activeVideo && (
            <div style={{ marginBottom: '25px', background: '#000', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 4px 15px rgba(0,0,0,0.2)' }}>
              {isLocalVideo ? (
                <video 
                  controls 
                  src={videoSrc} 
                  style={{ width: '100%', height: '450px', objectFit: 'contain', background: '#000' }}
                  poster={activeVideo.thumbnailUrl}
                  autoPlay
                />
              ) : activeVideo.youtubeId ? (
                <iframe
                  width="100%"
                  height="450"
                  src={`https://www.youtube.com/embed/${activeVideo.youtubeId}?autoplay=1&rel=0`}
                  title={activeVideo.title}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  onError={() => setIframeError(true)}
                ></iframe>
              ) : (
                <div style={{ padding: '60px 20px', color: 'white', textAlign: 'center', background: '#1e293b' }}>
                  <AlertTriangle size={40} color="#f59e0b" style={{ marginBottom: '10px' }} />
                  <h3 style={{ fontSize: '16px', color: '#f59e0b' }}>Không thể tự phát trực tiếp Video này trong trình duyệt</h3>
                  <p style={{ fontSize: '13px', color: '#94a3b8', marginBottom: '15px' }}>Vui lòng mở xem trực tiếp trên YouTube bằng nút bên dưới:</p>
                  <a 
                    href={activeVideo.externalLink || `https://www.youtube.com/watch?v=${activeVideo.youtubeId}`} 
                    target="_blank" 
                    rel="noreferrer"
                    style={{ background: '#ef4444', color: 'white', textDecoration: 'none', padding: '10px 20px', borderRadius: '6px', fontWeight: '700', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                  >
                    <ExternalLink size={16} /> Mở Trực Tiếp Trên YouTube
                  </a>
                </div>
              )}
              
              <div style={{ padding: '15px', background: '#0f172a', color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h2 style={{ fontSize: '17px', color: '#38bdf8', margin: '0 0 4px 0', fontWeight: '700' }}>
                    🎬 {activeVideo.title}
                  </h2>
                  <span style={{ fontSize: '12px', color: '#94a3b8' }}>
                    👁️ {activeVideo.views || 100} lượt xem | THCS Đồng Tân Channel
                  </span>
                </div>

                <a 
                  href={activeVideo.externalLink || (activeVideo.youtubeId ? `https://www.youtube.com/watch?v=${activeVideo.youtubeId}` : '#')}
                  target="_blank"
                  rel="noreferrer"
                  style={{ background: '#ef4444', color: 'white', textDecoration: 'none', padding: '8px 16px', borderRadius: '4px', fontSize: '13px', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '6px' }}
                >
                  <ExternalLink size={15} /> Mở Trang YouTube Gốc
                </a>
              </div>
            </div>
          )}

          {/* List of Available Videos */}
          <h3 style={{ fontSize: '15px', color: '#003a73', marginBottom: '12px', fontWeight: '700' }}>
            DANH SÁCH VIDEO CỤM HOẠT ĐỘNG
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '15px' }}>
            {videoList.map(vid => (
              <div 
                key={vid.id}
                onClick={() => handleSelectVideo(vid)}
                style={{ 
                  border: activeVideo?.id === vid.id ? '2px solid #0056a6' : '1px solid #cbd5e1', 
                  borderRadius: '6px', 
                  overflow: 'hidden', 
                  cursor: 'pointer',
                  background: 'white',
                  boxShadow: '0 2px 6px rgba(0,0,0,0.05)'
                }}
              >
                <div style={{ position: 'relative', height: '135px' }}>
                  <img 
                    src={vid.thumbnailUrl || (vid.youtubeId ? `https://img.youtube.com/vi/${vid.youtubeId}/hqdefault.jpg` : 'https://images.unsplash.com/photo-1577896851231-70ef18881754?w=600&q=80')} 
                    alt={vid.title} 
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                  <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', background: 'rgba(239, 68, 68, 0.9)', color: 'white', padding: '10px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Play size={20} />
                  </div>
                </div>
                <div style={{ padding: '10px' }}>
                  <h4 style={{ fontSize: '13px', color: '#003a73', margin: '0 0 6px 0', lineHeight: '1.3', fontWeight: '700', height: '34px', overflow: 'hidden' }}>
                    {vid.title}
                  </h4>
                  <div style={{ fontSize: '11.5px', color: '#64748b', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Eye size={12} /> {vid.views || 100} lượt xem
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </div>
  );
}
