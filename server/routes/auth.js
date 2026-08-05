import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { get } from '../db/database.js';
import { JWT_SECRET, authGuard } from '../middleware/auth.js';

const router = express.Router();

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ success: false, message: 'Vui lòng nhập tên đăng nhập và mật khẩu' });
    }

    const user = await get('SELECT * FROM users WHERE username = ?', [username]);
    if (!user) {
      return res.status(400).json({ success: false, message: 'Tài khoản hoặc mật khẩu không chính xác' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: 'Tài khoản hoặc mật khẩu không chính xác' });
    }

    const token = jwt.sign(
      { id: user.id, username: user.username, role: user.role, fullName: user.fullName },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      success: true,
      message: 'Đăng nhập hệ thống thành công!',
      token,
      user: {
        id: user.id,
        username: user.username,
        fullName: user.fullName,
        role: user.role,
        email: user.email
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Lỗi server khi đăng nhập', error: err.message });
  }
});

// GET /api/auth/me
router.get('/me', authGuard, async (req, res) => {
  try {
    const user = await get('SELECT id, username, fullName, role, email FROM users WHERE id = ?', [req.user.id]);
    res.json({ success: true, user });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Lỗi lấy thông tin người dùng' });
  }
});

export default router;
