import express from 'express';
import { query, get, run } from '../db/database.js';
import { authGuard } from '../middleware/auth.js';

const router = express.Router();

// GET /api/documents
router.get('/', async (req, res) => {
  try {
    const { q, category } = req.query;
    let sql = 'SELECT * FROM documents WHERE 1=1';
    const params = [];

    if (q) {
      sql += ' AND (title LIKE ? OR code LIKE ? OR signer LIKE ?)';
      params.push(`%${q}%`, `%${q}%`, `%${q}%`);
    }

    if (category) {
      sql += ' AND category = ?';
      params.push(category);
    }

    sql += ' ORDER BY id DESC';
    const docs = await query(sql, params);
    res.json({ success: true, data: docs });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Lỗi tải danh sách văn bản chỉ đạo' });
  }
});

// GET /api/documents/:id
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const doc = await get('SELECT * FROM documents WHERE id = ?', [id]);
    if (!doc) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy văn bản' });
    }

    await run('UPDATE documents SET views = views + 1 WHERE id = ?', [id]);
    doc.views += 1;

    res.json({ success: true, data: doc });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Lỗi tải chi tiết văn bản' });
  }
});

// POST /api/documents/:id/download
router.post('/:id/download', async (req, res) => {
  try {
    const { id } = req.params;
    await run('UPDATE documents SET downloads = downloads + 1 WHERE id = ?', [id]);
    res.json({ success: true, message: 'Đã cập nhật lượt tải tệp' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Lỗi khi cập nhật lượt tải' });
  }
});

// POST /api/documents (Admin Create)
router.post('/', authGuard, async (req, res) => {
  try {
    const { code, title, category, issueDate, signer, fileUrl, externalLink } = req.body;
    if (!code || !title || !issueDate) {
      return res.status(400).json({ success: false, message: 'Vui lòng nhập số hiệu, trích yếu tiêu đề và ngày ban hành văn bản' });
    }

    const result = await run(
      `INSERT INTO documents (code, title, category, issueDate, signer, fileUrl, externalLink, views, downloads) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [code, title, category || 'Thông tư BGD&ĐT', issueDate, signer || 'THCS Đồng Tân', fileUrl || '', externalLink || '', 10, 1]
    );

    res.json({ success: true, message: 'Thêm văn bản mới thành công!', id: result.id, fileUrl, externalLink });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Lỗi khi phát hành văn bản mới' });
  }
});

// DELETE /api/documents/:id (Admin Delete)
router.delete('/:id', authGuard, async (req, res) => {
  try {
    const { id } = req.params;
    await run('DELETE FROM documents WHERE id = ?', [id]);
    res.json({ success: true, message: 'Đã xóa văn bản' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Lỗi khi xóa văn bản' });
  }
});

export default router;
