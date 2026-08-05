import express from 'express';
import { query, run } from '../db/database.js';
import { authGuard } from '../middleware/auth.js';

const router = express.Router();

// GET /api/media/videos
router.get('/videos', async (req, res) => {
  try {
    const videos = await query('SELECT * FROM videos ORDER BY id DESC');
    res.json({ success: true, data: videos });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Lỗi tải danh sách video hoạt động' });
  }
});

// POST /api/media/videos (Admin Create)
router.post('/videos', authGuard, async (req, res) => {
  try {
    const { title, youtubeId, thumbnailUrl } = req.body;
    if (!title || !youtubeId) {
      return res.status(400).json({ success: false, message: 'Vui lòng nhập tiêu đề và ID YouTube' });
    }

    const thumb = thumbnailUrl || `https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg`;
    const result = await run(
      `INSERT INTO videos (title, youtubeId, thumbnailUrl, views) VALUES (?, ?, ?, ?)`,
      [title, youtubeId, thumb, 100]
    );

    res.json({ success: true, message: 'Thêm video mới thành công!', id: result.id });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Lỗi khi thêm video' });
  }
});

// DELETE /api/media/videos/:id (Admin Delete)
router.delete('/videos/:id', authGuard, async (req, res) => {
  try {
    const { id } = req.params;
    await run('DELETE FROM videos WHERE id = ?', [id]);
    res.json({ success: true, message: 'Đã xóa video' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Lỗi khi xóa video' });
  }
});

export default router;
