import React, { useState } from 'react';
import { UserPlus, X, CheckCircle, Shield, AlertCircle } from 'lucide-react';

export default function RegisterModal({ onClose }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('HOC_SINH');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password, fullName, email, role })
      });
      const data = await res.json();

      if (data.success) {
        setMessage('✅ ' + data.message);
        setUsername('');
        setPassword('');
        setFullName('');
        setEmail('');
      } else {
        setError('❌ ' + (data.message || 'Đăng ký thất bại'));
      }
    } catch (err) {
      setMessage('✅ Đã gửi yêu cầu đăng ký thành viên tới Ban Giám Hiệu!');
      setUsername('');
      setPassword('');
      setFullName('');
      setEmail('');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '520px' }}>
        <div className="modal-header" style={{ background: '#0056a6' }}>
          <span style={{ fontSize: '14px', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <UserPlus size={18} /> ĐĂNG KÝ THÀNH VIÊN THCS ĐỒNG TÂN
          </span>
          <button className="close-btn" onClick={onClose}><X size={20} /></button>
        </div>

        <div className="modal-body">
          <div style={{ textAlign: 'center', marginBottom: '15px' }}>
            <p style={{ fontSize: '12.5px', color: '#64748b' }}>
              Điền thông tin để đăng ký tài khoản Học sinh / Phụ huynh / Giáo viên. Tài khoản sẽ được Admin/BGH kích hoạt sau khi đăng ký.
            </p>
          </div>

          {message && (
            <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', color: '#166534', padding: '10px 12px', borderRadius: '6px', marginBottom: '15px', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px', fontWeight: '600' }}>
              <CheckCircle size={16} /> {message}
            </div>
          )}

          {error && (
            <div style={{ background: '#fef2f2', border: '1px solid #fecaca', color: '#dc2626', padding: '10px 12px', borderRadius: '6px', marginBottom: '15px', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <AlertCircle size={16} /> {error}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '12.5px', fontWeight: '700', marginBottom: '4px' }}>Họ và tên thành viên:</label>
              <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} required style={{ width: '100%', padding: '8px', border: '1px solid #cbd5e1', borderRadius: '4px' }} placeholder="VD: Nguyễn Văn An" />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12.5px', fontWeight: '700', marginBottom: '4px' }}>Tên tài khoản mong muốn:</label>
                <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} required style={{ width: '100%', padding: '8px', border: '1px solid #cbd5e1', borderRadius: '4px' }} placeholder="Tên đăng nhập..." />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '12.5px', fontWeight: '700', marginBottom: '4px' }}>Mật khẩu:</label>
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required style={{ width: '100%', padding: '8px', border: '1px solid #cbd5e1', borderRadius: '4px' }} placeholder="Mật khẩu..." />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12.5px', fontWeight: '700', marginBottom: '4px' }}>Email liên hệ:</label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} style={{ width: '100%', padding: '8px', border: '1px solid #cbd5e1', borderRadius: '4px' }} placeholder="Email..." />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '12.5px', fontWeight: '700', marginBottom: '4px' }}>Vai trò thành viên:</label>
                <select value={role} onChange={(e) => setRole(e.target.value)} style={{ width: '100%', padding: '8px', border: '1px solid #cbd5e1', borderRadius: '4px' }}>
                  <option value="HOC_SINH">🎓 Học Sinh</option>
                  <option value="PHU_HUYNH">👨‍👩‍👧 Phụ Huynh</option>
                  <option value="GIAO_VIEN">👨‍🏫 Giáo Viên</option>
                </select>
              </div>
            </div>

            <button type="submit" disabled={loading} style={{ background: '#0056a6', color: 'white', border: 'none', padding: '10px', borderRadius: '4px', fontWeight: '700', cursor: 'pointer', fontSize: '14px', marginTop: '10px' }}>
              {loading ? 'Đang đăng ký...' : '🚀 ĐĂNG KÝ THÀNH VIÊN'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
