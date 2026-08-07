import React from 'react';
import { Calendar, Clock, UserCheck } from 'lucide-react';

export default function ScheduleView({ schedule = [] }) {
  const scheduleList = schedule.length > 0 ? schedule : [
    { day: 'Thứ Hai (08/02)', time: '07:30 - 08:15', content: 'Lễ Chào cờ đầu tuần & Tuyên dương thi đua tuần qua', leader: 'Toàn trường' },
    { day: 'Thứ Ba (09/02)', time: '14:00 - 16:30', content: 'Họp Chuyên môn Tổ Tự Nhiên & Kiểm tra giáo án tuần 22', leader: 'Tổ trưởng Tự nhiên' },
    { day: 'Thứ Tư (10/02)', time: '08:00 - 11:30', content: 'Tập huấn Chuyển đổi số & Ứng dụng AI trong giảng dạy năm 2026', leader: 'BGH & Phòng GD&ĐT' },
    { day: 'Thứ Năm (11/02)', time: '14:00 - 16:00', content: 'Sinh hoạt Chi bộ định kỳ tháng 2 & Rà soát chỉ tiêu nhiệm vụ', leader: 'Bí thư Chi bộ' },
    { day: 'Thứ Sáu (12/02)', time: '15:00 - 17:00', content: 'Hội nghị Công đoàn & Tổng vệ sinh quang cảnh trường học', leader: 'Chủ tịch Công đoàn' },
    { day: 'Thứ Bảy (13/02)', time: '07:30 - 11:00', content: 'Bồi dưỡng Học sinh giỏi môn Toán & Ngữ văn khối 9', leader: 'Giáo viên bộ môn' }
  ];

  return (
    <div style={{ padding: '20px', maxWidth: '1100px', margin: '0 auto' }}>
      <div className="widget-box">
        <div className="widget-header orange">
          <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Calendar size={18} /> LỊCH CÔNG TÁC TUẦN & LỊCH LÀM VIỆC BAN GIÁM HIỆU
          </span>
        </div>
        <div className="widget-body" style={{ padding: '20px' }}>
          
          <div style={{ background: '#fffbeb', border: '1px solid #fde68a', padding: '10px 15px', borderRadius: '6px', marginBottom: '20px', fontSize: '13px', color: '#92400e', fontWeight: '600' }}>
            📌 Lịch công tác áp dụng cho Tuần 22 (Áp dụng từ ngày 08/02/2026 đến hết ngày 14/02/2026).
          </div>

          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
            <thead>
              <tr style={{ background: '#0056a6', color: 'white', textTransform: 'uppercase' }}>
                <th style={{ padding: '10px', border: '1px solid #cbd5e1', width: '160px' }}>Thứ / Ngày</th>
                <th style={{ padding: '10px', border: '1px solid #cbd5e1', width: '130px' }}>Thời gian</th>
                <th style={{ padding: '10px', border: '1px solid #cbd5e1' }}>Nội dung công việc</th>
                <th style={{ padding: '10px', border: '1px solid #cbd5e1', width: '160px' }}>Chủ trì / Thành phần</th>
              </tr>
            </thead>
            <tbody>
              {scheduleList.map((item, idx) => (
                <tr key={idx} style={{ background: idx % 2 === 0 ? '#ffffff' : '#f8fafc' }}>
                  <td style={{ padding: '10px', border: '1px solid #cbd5e1', fontWeight: '700', color: '#003a73' }}>
                    {item.day}
                  </td>
                  <td style={{ padding: '10px', border: '1px solid #cbd5e1', color: '#d97706', fontWeight: '600' }}>
                    <Clock size={12} inline /> {item.time}
                  </td>
                  <td style={{ padding: '10px', border: '1px solid #cbd5e1', color: '#1e293b', fontWeight: '500' }}>
                    {item.content}
                  </td>
                  <td style={{ padding: '10px', border: '1px solid #cbd5e1', color: '#16a34a', fontWeight: '600' }}>
                    <UserCheck size={12} inline /> {item.leader}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

        </div>
      </div>
    </div>
  );
}
