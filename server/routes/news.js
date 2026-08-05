import express from 'express';
import { query, get, run } from '../db/database.js';
import { authGuard } from '../middleware/auth.js';

const router = express.Router();

// GET /api/news/categories
router.get('/categories', async (req, res) => {
  try {
    const categories = await query(`
      SELECT c.*, COUNT(a.id) as articleCount 
      FROM categories c 
      LEFT JOIN articles a ON c.id = a.categoryId 
      GROUP BY c.id
      ORDER BY c.id ASC
    `);
    res.json({ success: true, data: categories });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Lỗi tải danh mục tin tức' });
  }
});

// GET /api/news/featured
router.get('/featured', async (req, res) => {
  try {
    let article = await get('SELECT * FROM articles WHERE isFeatured = 1 ORDER BY id DESC LIMIT 1');
    if (!article) {
      article = await get('SELECT * FROM articles ORDER BY id DESC LIMIT 1');
    }
    res.json({ success: true, data: article });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Lỗi tải bài viết nổi bật' });
  }
});

// GET /api/news
router.get('/', async (req, res) => {
  try {
    const { categoryId, q, limit } = req.query;
    let sql = 'SELECT * FROM articles WHERE 1=1';
    const params = [];

    if (categoryId) {
      sql += ' AND categoryId = ?';
      params.push(categoryId);
    }

    if (q) {
      sql += ' AND (title LIKE ? OR summary LIKE ?)';
      params.push(`%${q}%`, `%${q}%`);
    }

    sql += ' ORDER BY id DESC';

    if (limit) {
      sql += ' LIMIT ?';
      params.push(parseInt(limit));
    }

    const articles = await query(sql, params);
    res.json({ success: true, data: articles });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Lỗi tải danh sách tin tức' });
  }
});

// GET /api/news/:id (Detail + View Increment)
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const article = await get('SELECT * FROM articles WHERE id = ?', [id]);
    if (!article) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy bài viết' });
    }

    // Increment views count
    await run('UPDATE articles SET views = views + 1 WHERE id = ?', [id]);
    article.views += 1;

    res.json({ success: true, data: article });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Lỗi khi xem chi tiết bài viết' });
  }
});

// POST /api/news (Admin create)
router.post('/', authGuard, async (req, res) => {
  try {
    const { title, categoryId, summary, content, image, isFeatured } = req.body;
    if (!title || !content) {
      return res.status(400).json({ success: false, message: 'Vui lòng nhập tiêu đề và nội dung bài viết' });
    }

    const category = await get('SELECT name FROM categories WHERE id = ?', [categoryId || 1]);
    const categoryName = category ? category.name : 'Tin tức - Sự kiện';
    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') + '-' + Date.now();
    const author = req.user.fullName || 'Ban Biên Tập THCS Đồng Tân';

    const result = await run(
      `INSERT INTO articles (title, slug, categoryId, categoryName, summary, content, image, author, isFeatured, views) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [title, slug, categoryId || 1, categoryName, summary || '', content, image || 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=800&q=80', author, isFeatured ? 1 : 0, 1]
    );

    res.json({ success: true, message: 'Đăng bài viết mới thành công!', id: result.id });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Lỗi khi tạo bài viết mới', error: err.message });
  }
});

// DELETE /api/news/:id (Admin delete)
router.delete('/:id', authGuard, async (req, res) => {
  try {
    const { id } = req.params;
    await run('DELETE FROM articles WHERE id = ?', [id]);
    res.json({ success: true, message: 'Đã xóa bài viết' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Lỗi khi xóa bài viết' });
  }
});

export default router;
