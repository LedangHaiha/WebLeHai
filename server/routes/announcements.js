import express from 'express';
import { query, run } from '../db/database.js';
import { authGuard } from '../middleware/auth.js';

const router = express.Router();

// GET /api/announcements
router.get('/', async (req, res) => {
  try {
    const announcements = await query('SELECT * FROM announcements WHERE isActive = 1 ORDER BY priority DESC, id DESC');
    res.json({ success: true, data: announcements });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Lỗi tải danh sách thông báo trường' });
  }
});

// POST /api/announcements (Admin Create)
router.post('/', authGuard, async (req, res) => {
  try {
    const { content, link, priority } = req.body;
    if (!content) {
      return res.status(400).json({ success: false, message: 'Vui lòng nhập nội dung thông báo' });
    }

    const result = await run(
      `INSERT INTO announcements (content, link, priority, isActive) VALUES (?, ?, ?, ?)`,
      [content, link || '', priority || 1, 1]
    );

    res.json({ success: true, message: 'Thêm thông báo mới thành công!', id: result.id });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Lỗi khi phát thông báo mới' });
  }
});

// DELETE /api/announcements/:id (Admin Delete)
router.delete('/:id', authGuard, async (req, res) => {
  try {
    const { id } = req.params;
    await run('DELETE FROM announcements WHERE id = ?', [id]);
    res.json({ success: true, message: 'Đã xóa thông báo' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Lỗi khi xóa thông báo' });
  }
});

export default router;
