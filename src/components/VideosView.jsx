import React, { useState } from 'react';
import { Video, Play, Eye, ExternalLink, Upload } from 'lucide-react';

export default function VideosView({ videos = [], onOpenUpload }) {
  const videoList = videos.length > 0 ? videos : [
    {
      id: 1,
      title: 'Phim tư liệu: 40 năm truyền thống Dạy tốt - Học tốt THCS Đồng Tân',
      youtubeId: 'dQw4w9WgXcQ',
      thumbnailUrl: 'https://images.unsplash.com/photo-1577896851231-70ef18881754?w=600&q=80',
      views: 1540
    },
    {
      id: 2,
      title: 'Hoạt động trải nghiệm sáng tạo STEM môn Sinh - Hóa lớp 9',
      youtubeId: 'L_LUpnjgPso',
      thumbnailUrl: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&q=80',
      views: 920
    }
  ];

  const [activeVideo, setActiveVideo] = useState(videoList[0]);

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
              {activeVideo.videoUrl ? (
                <video 
                  controls 
                  src={activeVideo.videoUrl} 
                  style={{ width: '100%', height: '450px', objectFit: 'contain', background: '#000' }}
                  poster={activeVideo.thumbnailUrl}
                  autoPlay
                />
              ) : activeVideo.youtubeId ? (
                <iframe
                  width="100%"
                  height="450"
                  src={`https://www.youtube.com/embed/${activeVideo.youtubeId}?autoplay=1`}
                  title={activeVideo.title}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              ) : (
                <div style={{ padding: '40px', color: 'white', textAlign: 'center' }}>
                  Không tìm thấy nguồn video
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

                {activeVideo.externalLink && (
                  <a 
                    href={activeVideo.externalLink}
                    target="_blank"
                    rel="noreferrer"
                    style={{ background: '#ef4444', color: 'white', textDecoration: 'none', padding: '6px 14px', borderRadius: '4px', fontSize: '12.5px', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '4px' }}
                  >
                    <ExternalLink size={14} /> Mở YouTube
                  </a>
                )}
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
                onClick={() => setActiveVideo(vid)}
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
