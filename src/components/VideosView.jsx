import React, { useState } from 'react';
import { Video, Eye, Play } from 'lucide-react';

export default function VideosView({ videos = [] }) {
  const [activeVid, setActiveVid] = useState(null);

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
    },
    {
      id: 3,
      title: 'Video Lễ Khai Giảng Năm học mới 2026 - 2027 THCS Đồng Tân, Lạng Sơn',
      youtubeId: 'dQw4w9WgXcQ',
      thumbnailUrl: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=600&q=80',
      views: 2100
    }
  ];

  const currentVid = activeVid || videoList[0];

  return (
    <div style={{ padding: '20px', maxWidth: '1100px', margin: '0 auto' }}>
      <div className="widget-box">
        <div className="widget-header">
          <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Video size={18} /> THƯ VIỆN VIDEOS HOẠT ĐỘNG NHÀ TRƯỜNG
          </span>
        </div>
        <div className="widget-body" style={{ padding: '20px' }}>
          
          <div style={{ marginBottom: '25px' }}>
            <div className="video-player-container" style={{ height: '420px', borderRadius: '8px' }}>
              <iframe
                src={`https://www.youtube.com/embed/${currentVid.youtubeId}?rel=0&autoplay=1`}
                title={currentVid.title}
                allowFullScreen
              ></iframe>
            </div>
            <h2 style={{ fontSize: '18px', color: '#003a73', marginTop: '12px', fontWeight: '700' }}>
              🎬 {currentVid.title}
            </h2>
            <span style={{ fontSize: '12px', color: '#64748b' }}>
              <Eye size={12} inline /> {currentVid.views || 0} lượt xem
            </span>
          </div>

          <h3 style={{ fontSize: '15px', color: '#003a73', marginBottom: '12px', borderBottom: '1px solid #cbd5e1', paddingBottom: '6px' }}>
            Danh sách Video khác
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '15px' }}>
            {videoList.map(v => (
              <div 
                key={v.id} 
                style={{ border: '1px solid #cbd5e1', borderRadius: '6px', overflow: 'hidden', cursor: 'pointer', background: '#ffffff' }}
                onClick={() => setActiveVid(v)}
              >
                <div style={{ position: 'relative' }}>
                  <img src={v.thumbnailUrl} alt={v.title} style={{ width: '100%', height: '140px', objectFit: 'cover' }} />
                  <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', background: 'rgba(0,0,0,0.6)', borderRadius: '50%', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Play size={20} color="white" fill="white" />
                  </div>
                </div>
                <div style={{ padding: '10px' }}>
                  <h4 style={{ fontSize: '13px', color: '#1e293b', lineHeight: '1.3' }}>{v.title}</h4>
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </div>
  );
}
