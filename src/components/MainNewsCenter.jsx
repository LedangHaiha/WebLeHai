import React from 'react';
import { Calendar, User, Eye, ArrowRight, BookOpen } from 'lucide-react';

export default function MainNewsCenter({ featuredArticle, secondaryArticles = [], allArticles = [], onSelectArticle }) {
  return (
    <main className="main-center-col">
      {/* 1. Tin tiêu điểm nổi bật chính */}
      {featuredArticle && (
        <div className="featured-news-card">
          <div className="featured-grid">
            <img 
              src={featuredArticle.image || 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=800&q=80'} 
              alt={featuredArticle.title} 
              className="featured-img" 
            />
            <div className="featured-info">
              <h2 className="featured-title" onClick={() => onSelectArticle(featuredArticle.id)}>
                {featuredArticle.title}
              </h2>
              <div className="featured-meta">
                <span><Calendar size={12} inline /> {featuredArticle.createdAt?.split(' ')[0] || '04/08/2026'}</span>
                <span><User size={12} inline /> {featuredArticle.author || 'Ban Biên Tập'}</span>
                <span><Eye size={12} inline /> {featuredArticle.views} lượt xem</span>
              </div>
              <p className="featured-summary">{featuredArticle.summary}</p>
              <a className="btn-readmore" onClick={() => onSelectArticle(featuredArticle.id)}>
                Xem tiếp... <ArrowRight size={14} />
              </a>
            </div>
          </div>
        </div>
      )}

      {/* 2. Grid 3 tin tiêu điểm bên dưới */}
      {secondaryArticles.length > 0 && (
        <div className="sub-news-grid">
          {secondaryArticles.slice(0, 3).map((article) => (
            <div key={article.id} className="sub-news-card" onClick={() => onSelectArticle(article.id)}>
              <img 
                src={article.image || 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=400&q=80'} 
                alt={article.title} 
                className="sub-news-img" 
              />
              <div className="sub-news-body">
                <div className="sub-news-title">{article.title}</div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 3. Khối Tin tức theo Chuyên mục */}
      <div className="widget-box" style={{ marginTop: '20px' }}>
        <div className="widget-header">
          <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <BookOpen size={16} /> Tin tức - Sự kiện Nổi bật Nhà trường
          </span>
        </div>
        <div className="widget-body">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {allArticles.slice(0, 6).map((item) => (
              <div 
                key={item.id} 
                style={{ 
                  display: 'flex', 
                  gap: '12px', 
                  borderBottom: '1px solid #f1f5f9', 
                  paddingBottom: '10px',
                  cursor: 'pointer' 
                }}
                onClick={() => onSelectArticle(item.id)}
              >
                <img 
                  src={item.image || 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=300&q=80'} 
                  alt={item.title} 
                  style={{ width: '110px', height: '75px', objectFit: 'cover', borderRadius: '4px' }} 
                />
                <div style={{ flex: 1 }}>
                  <span style={{ fontSize: '11px', background: '#e0f2fe', color: '#0369a1', padding: '2px 6px', borderRadius: '3px', fontWeight: '500' }}>
                    {item.categoryName || 'Tin tức'}
                  </span>
                  <h3 style={{ fontSize: '13.5px', fontWeight: '600', color: '#1e293b', margin: '4px 0', lineHeight: '1.3' }}>
                    {item.title}
                  </h3>
                  <p style={{ fontSize: '12px', color: '#64748b', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {item.summary}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
