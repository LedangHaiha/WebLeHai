import express from 'express';
import { query, run } from '../db/database.js';

const router = express.Router();

// Helper to extract 11-char YouTube ID from any YouTube URL or string
function extractYouTubeId(urlOrId) {
  if (!urlOrId) return '';
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = urlOrId.match(regExp);
  return (match && match[2].length === 11) ? match[2] : urlOrId.trim();
}

// GET /api/media/videos
router.get('/videos', async (req, res) => {
  try {
    const videos = await query('SELECT * FROM videos ORDER BY id DESC');
    res.json({ success: true, data: videos });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Lỗi tải danh sách video hoạt động' });
  }
});

// POST /api/media/videos (Add Video)
router.post('/videos', async (req, res) => {
  try {
    const { title, youtubeId, thumbnailUrl, videoUrl, externalLink } = req.body;
    if (!title) {
      return res.status(400).json({ success: false, message: 'Vui lòng nhập tiêu đề Video' });
    }

    const cleanYoutubeId = extractYouTubeId(youtubeId || externalLink || '');
    const thumb = thumbnailUrl || (cleanYoutubeId ? `https://img.youtube.com/vi/${cleanYoutubeId}/hqdefault.jpg` : 'https://images.unsplash.com/photo-1577896851231-70ef18881754?w=600&q=80');

    const result = await run(
      `INSERT INTO videos (title, youtubeId, thumbnailUrl, videoUrl, externalLink, views) VALUES (?, ?, ?, ?, ?, ?)`,
      [title, cleanYoutubeId, thumb, videoUrl || '', externalLink || '', 100]
    );

    res.json({
      success: true,
      message: 'Thêm Video mới thành công!',
      id: result.id,
      video: {
        id: result.id,
        title,
        youtubeId: cleanYoutubeId,
        thumbnailUrl: thumb,
        videoUrl: videoUrl || '',
        externalLink: externalLink || '',
        views: 100
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Lỗi khi thêm video', error: err.message });
  }
});

// DELETE /api/media/videos/:id (Delete Video)
router.delete('/videos/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await run('DELETE FROM videos WHERE id = ?', [id]);
    res.json({ success: true, message: 'Đã xóa video' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Lỗi khi xóa video' });
  }
});

export default router;
