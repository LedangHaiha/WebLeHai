import React, { useState, useEffect } from 'react';
import { Clock, Search } from 'lucide-react';

export default function SubBar({ announcements = [], onSearch }) {
  const [timeStr, setTimeStr] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const time = now.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
      const date = now.toLocaleDateString('vi-VN', { weekday: 'long', day: '2-digit', month: '2-digit', year: 'numeric' });
      setTimeStr(`${time} +07 ${date}`);
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (onSearch) onSearch(searchQuery);
  };

  const tickerContent = announcements.length > 0
    ? announcements.map(a => a.content).join('  ❖  ')
    : 'Chào mừng quý thầy cô, phụ huynh và các em học sinh đến với trang Web chính thức của trường THCS Đồng Tân, Hà Nội!';

  return (
    <div className="sub-bar">
      <div className="realtime-clock">
        <Clock size={13} />
        <span>{timeStr}</span>
      </div>

      <div className="announcement-marquee">
        <span className="marquee-text">{tickerContent}</span>
      </div>

      <form className="search-box" onSubmit={handleSearchSubmit}>
        <input 
          type="text" 
          placeholder="Tìm kiếm bài viết, văn bản..." 
          className="search-input"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button type="submit" className="search-btn">
          <Search size={14} />
        </button>
      </form>
    </div>
  );
}
