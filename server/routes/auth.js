import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { get, query, run } from '../db/database.js';
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

    if (user.status === 'PENDING') {
      return res.status(403).json({ success: false, message: 'Tài khoản của bạn đang chờ Admin duyệt' });
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
        email: user.email,
        status: user.status
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Lỗi server khi đăng nhập', error: err.message });
  }
});

// POST /api/auth/register (Công khai - Đăng ký thành viên)
router.post('/register', async (req, res) => {
  try {
    const { username, password, fullName, email, role } = req.body;
    if (!username || !password || !fullName) {
      return res.status(400).json({ success: false, message: 'Vui lòng điền đầy đủ tên tài khoản, mật khẩu và họ tên' });
    }

    const existing = await get('SELECT id FROM users WHERE username = ?', [username]);
    if (existing) {
      return res.status(400).json({ success: false, message: 'Tên tài khoản này đã tồn tại trên hệ thống' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const userRole = role || 'HOC_SINH';
    const status = 'PENDING'; // Chờ Admin phê duyệt

    const result = await run(
      `INSERT INTO users (username, password, fullName, role, email, status) VALUES (?, ?, ?, ?, ?, ?)`,
      [username, hashedPassword, fullName, userRole, email || '', status]
    );

    res.json({
      success: true,
      message: 'Đăng ký thành viên thành công! Tài khoản đang chờ Ban Giám Hiệu duyệt.',
      id: result.id
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Lỗi khi đăng ký thành viên', error: err.message });
  }
});

// GET /api/auth/users (Admin - Danh sách thành viên)
router.get('/users', async (req, res) => {
  try {
    const users = await query('SELECT id, username, fullName, role, email, status, createdAt FROM users ORDER BY id DESC');
    res.json({ success: true, data: users });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Lỗi lấy danh sách thành viên' });
  }
});

// POST /api/auth/create-user (Admin - Cấp tài khoản trực tiếp)
router.post('/create-user', async (req, res) => {
  try {
    const { username, password, fullName, email, role } = req.body;
    if (!username || !password || !fullName) {
      return res.status(400).json({ success: false, message: 'Vui lòng điền tên tài khoản, mật khẩu và họ tên thành viên' });
    }

    const existing = await get('SELECT id FROM users WHERE username = ?', [username]);
    if (existing) {
      return res.status(400).json({ success: false, message: 'Tên tài khoản đã tồn tại' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const userRole = role || 'GIAO_VIEN';
    const status = 'ACTIVE';

    const result = await run(
      `INSERT INTO users (username, password, fullName, role, email, status) VALUES (?, ?, ?, ?, ?, ?)`,
      [username, hashedPassword, fullName, userRole, email || '', status]
    );

    res.json({
      success: true,
      message: `Cấp tài khoản mới thành công cho ${fullName} (${userRole})!`,
      id: result.id
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Lỗi khi cấp tài khoản mới' });
  }
});

// POST /api/auth/approve-user/:id (Admin - Phê duyệt tài khoản)
router.post('/approve-user/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await run("UPDATE users SET status = 'ACTIVE' WHERE id = ?", [id]);
    res.json({ success: true, message: 'Đã phê duyệt tài khoản thành viên thành công!' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Lỗi khi duyệt tài khoản' });
  }
});

// DELETE /api/auth/users/:id (Admin - Xóa tài khoản)
router.delete('/users/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await run('DELETE FROM users WHERE id = ?', [id]);
    res.json({ success: true, message: 'Đã xóa tài khoản thành viên' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Lỗi khi xóa tài khoản' });
  }
});

export default router;
