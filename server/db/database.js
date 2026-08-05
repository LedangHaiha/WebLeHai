import sqlite3 from 'sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';
import bcrypt from 'bcryptjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = path.join(__dirname, 'school.db');
const db = new sqlite3.Database(dbPath);

// Helper promise wrapper for sqlite queries
export const query = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
};

export const run = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function (err) {
      if (err) reject(err);
      else resolve({ id: this.lastID, changes: this.changes });
    });
  });
};

export const get = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });
};

// Initialize database tables & seed initial data
export const initDb = async () => {
  db.serialize(async () => {
    // 1. Users table
    db.run(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        fullName TEXT NOT NULL,
        role TEXT NOT NULL DEFAULT 'GIAO_VIEN',
        email TEXT,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // 2. Categories table
    db.run(`
      CREATE TABLE IF NOT EXISTS categories (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        slug TEXT UNIQUE NOT NULL,
        icon TEXT
      )
    `);

    // 3. Articles (Tin tức - Sự kiện) table
    db.run(`
      CREATE TABLE IF NOT EXISTS articles (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        slug TEXT UNIQUE NOT NULL,
        categoryId INTEGER,
        categoryName TEXT,
        summary TEXT,
        content TEXT,
        image TEXT,
        author TEXT DEFAULT 'Ban Biên Tập',
        isFeatured INTEGER DEFAULT 0,
        views INTEGER DEFAULT 120,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (categoryId) REFERENCES categories(id)
      )
    `);

    // 4. Documents (Văn bản chỉ đạo) table
    db.run(`
      CREATE TABLE IF NOT EXISTS documents (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        code TEXT NOT NULL,
        title TEXT NOT NULL,
        category TEXT DEFAULT 'Thông tư / Quy chế',
        issueDate TEXT NOT NULL,
        signer TEXT,
        fileUrl TEXT,
        views INTEGER DEFAULT 4500,
        downloads INTEGER DEFAULT 1700,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // 5. Media Videos table
    db.run(`
      CREATE TABLE IF NOT EXISTS videos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        youtubeId TEXT NOT NULL,
        thumbnailUrl TEXT,
        views INTEGER DEFAULT 890,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // 6. School Announcements table
    db.run(`
      CREATE TABLE IF NOT EXISTS announcements (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        content TEXT NOT NULL,
        link TEXT,
        priority INTEGER DEFAULT 1,
        isActive INTEGER DEFAULT 1,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Seed initial users if empty
    db.get('SELECT COUNT(*) as count FROM users', async (err, row) => {
      if (!err && row.count === 0) {
        const hashedPassword = await bcrypt.hash('admin123', 10);
        db.run(
          `INSERT INTO users (username, password, fullName, role, email) VALUES (?, ?, ?, ?, ?)`,
          ['admin', hashedPassword, 'Thầy Hiệu Trưởng - THCS Đồng Tân', 'BGH', 'bgh.thcsdongtan@hanoi.edu.vn']
        );
        db.run(
          `INSERT INTO users (username, password, fullName, role, email) VALUES (?, ?, ?, ?, ?)`,
          ['giaovien', hashedPassword, 'Cô Nguyễn Thị Hoa - Giáo Viên Văn', 'GIAO_VIEN', 'hoanguyen@thcsdongtan.edu.vn']
        );
      }
    });

    // Seed initial Categories if empty
    db.get('SELECT COUNT(*) as count FROM categories', (err, row) => {
      if (!err && row.count === 0) {
        const categories = [
          { name: 'Tin tức - Sự kiện', slug: 'tin-tuc-su-kien', icon: 'Newspaper' },
          { name: 'Hoạt động chuyên môn', slug: 'hoat-dong-chuyen-mon', icon: 'BookOpen' },
          { name: 'Hoạt động đoàn thể', slug: 'hoat-dong-doan-the', icon: 'Users' },
          { name: 'Hoạt động ngoại khóa', slug: 'hoat-dong-ngoai-khoa', icon: 'Sparkles' },
          { name: 'Câu lạc bộ', slug: 'cau-lac-bo', icon: 'Trophy' }
        ];
        categories.forEach(c => {
          db.run(`INSERT INTO categories (name, slug, icon) VALUES (?, ?, ?)`, [c.name, c.slug, c.icon]);
        });
      }
    });

    // Seed Articles if empty
    db.get('SELECT COUNT(*) as count FROM articles', (err, row) => {
      if (!err && row.count === 0) {
        const articles = [
          {
            title: 'Lễ kết nạp Đảng viên mới cho cán bộ giáo viên THCS Đồng Tân',
            slug: 'le-ket-nap-dang-vien-moi',
            categoryId: 1,
            categoryName: 'Tin tức - Sự kiện',
            summary: 'Vào lúc 14 giờ 00, Chi bộ trường THCS Đồng Tân đã long trọng tổ chức Lễ kết nạp Đảng viên cho giáo viên ưu tú có nhiều thành tích xuất sắc.',
            content: 'Chiều ngày 04/08/2026, Chi bộ Trường THCS Đồng Tân đã tiến hành Lễ kết nạp Đảng viên cho quần chúng ưu tú. Buổi lễ diễn ra trong không khí trang nghiêm, đúng trình tự, thủ tục của Điều lệ Đảng. Đồng chí Bí thư Chi bộ đã trao Quyết định kết nạp và phân công Đảng viên chính thức tiếp tục giúp đỡ đồng chí Đảng viên mới phát huy tinh thần trách nhiệm trong công tác giảng dạy và phong trào thi đua của nhà trường.',
            image: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=800&q=80',
            author: 'Ban Biên Tập THCS Đồng Tân',
            isFeatured: 1,
            views: 1250,
            createdAt: '2026-08-04 08:00:00'
          },
          {
            title: 'Bộ GD&ĐT ban hành Chỉ thị về nhiệm vụ trọng tâm năm học 2026 - 2027',
            slug: 'bo-gddt-ban-hanh-chi-thi-nhiem-vu-trong-tam',
            categoryId: 2,
            categoryName: 'Hoạt động chuyên môn',
            summary: 'Tập trung nâng cao chất lượng giáo dục toàn diện, đẩy mạnh chuyển đổi số trong công tác quản lý và giảng dạy tại các trường phổ thông.',
            content: 'Bộ Giáo dục và Đào tạo vừa chính thức ban hành Chỉ thị định hướng nhiệm vụ năm học mới. Trong đó nhấn mạnh đổi mới phương pháp dạy học lấy học sinh làm trung tâm, ứng dụng công nghệ thông tin và AI trong hỗ trợ dạy và học, chú trọng giáo dục đạo đức, kỹ năng sống cho học sinh.',
            image: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=800&q=80',
            author: 'Phòng Giáo Dục & Đào Tạo',
            isFeatured: 0,
            views: 940,
            createdAt: '2026-08-03 10:30:00'
          },
          {
            title: 'Tiếp nhận thiết bị dạy học môn Vật lý & Sinh học từ Ngân hàng hỗ trợ giáo dục',
            slug: 'tiep-nhan-thiet-bi-day-hoc-mon-vat-ly',
            categoryId: 2,
            categoryName: 'Hoạt động chuyên môn',
            summary: 'Trường THCS Đồng Tân vừa tiếp nhận lô thiết bị thí nghiệm hiện đại hỗ trợ thực hành môn Vật lý và Khoa học tự nhiên.',
            content: 'Sáng nay nhà trường đã tiếp nhận đầy đủ trang thiết bị thực hành phục vụ năm học mới. Ban Giám hiệu đã giao Tổ Tự nhiên kiểm kê, đưa vào phòng bộ môn để sẵn sàng phục vụ học sinh trải nghiệm sáng tạo.',
            image: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=800&q=80',
            author: 'Tổ KHTN',
            isFeatured: 0,
            views: 780,
            createdAt: '2026-08-02 14:15:00'
          },
          {
            title: 'Giao lưu văn hóa & Học thuật với đoàn Đại biểu Giáo dục quốc tế',
            slug: 'giao-luu-van-hoa-hoc-thuat',
            categoryId: 4,
            categoryName: 'Hoạt động ngoại khóa',
            summary: 'Chương trình giao lưu Tiếng Anh và trải nghiệm văn hóa truyền thống dành cho học sinh các khối 8 và 9.',
            content: 'Buổi giao lưu đã mang lại không khí vui tươi, hào hứng cho các em học sinh. Đây là cơ hội tuyệt vời để các em rèn luyện kỹ năng giao tiếp Tiếng Anh và tự tin thể hiện bản sắc văn hóa Việt Nam.',
            image: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800&q=80',
            author: 'Đoàn Đội THCS Đồng Tân',
            isFeatured: 0,
            views: 650,
            createdAt: '2026-08-01 09:00:00'
          },
          {
            title: 'Hội thi Giai điệu Tuổi hồng & Ngày hội Thể thao Trường THCS Đồng Tân',
            slug: 'hoi-thi-giai-dieu-tuoi-hong',
            categoryId: 3,
            categoryName: 'Hoạt động đoàn thể',
            summary: 'Sôi nổi các hoạt động văn nghệ, thể thao chào mừng các ngày lễ lớn của quê hương và đất nước.',
            content: 'Hội thi tụ hội hơn 20 tiết mục đặc sắc đến từ các chi đội. Ban Giám khảo đánh giá cao sự sáng tạo, tinh thần nhiệt huyết của các thầy cô chủ nhiệm và các em học sinh.',
            image: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800&q=80',
            author: 'Tổng Phụ Trách Đội',
            isFeatured: 0,
            views: 1120,
            createdAt: '2026-07-28 16:00:00'
          }
        ];

        articles.forEach(a => {
          db.run(
            `INSERT INTO articles (title, slug, categoryId, categoryName, summary, content, image, author, isFeatured, views, createdAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [a.title, a.slug, a.categoryId, a.categoryName, a.summary, a.content, a.image, a.author, a.isFeatured, a.views, a.createdAt]
          );
        });
      }
    });

    // Seed Documents if empty
    db.get('SELECT COUNT(*) as count FROM documents', (err, row) => {
      if (!err && row.count === 0) {
        const documents = [
          {
            code: 'TT07/2026/TT-BGDĐT',
            title: 'Thông tư 07/2026/TT-BGDĐT về Phổ cập giáo dục THCS và Xóa mù chữ năm 2026',
            category: 'Thông tư BGD&ĐT',
            issueDate: '04/08/2026',
            signer: 'Bộ trưởng BGD&ĐT',
            fileUrl: '#',
            views: 4830,
            downloads: 1722
          },
          {
            code: 'TT42/2025/TT-BGDĐT',
            title: 'Quy chế công nhận trường Trung học đạt chuẩn quốc gia cấp độ 2',
            category: 'Quy chế Nhà trường',
            issueDate: '15/12/2025',
            signer: 'Thứ trưởng BGD&ĐT',
            fileUrl: '#',
            views: 3410,
            downloads: 1205
          },
          {
            code: 'KH120/KH-THCSĐT',
            title: 'Kế hoạch công tác giảng dạy & Bồi dưỡng học sinh giỏi năm học 2026 - 2027',
            category: 'Kế hoạch Nhà trường',
            issueDate: '01/08/2026',
            signer: 'Hiệu trưởng THCS Đồng Tân',
            fileUrl: '#',
            views: 2900,
            downloads: 980
          },
          {
            code: 'HD05/HD-PGDĐT',
            title: 'Hướng dẫn tổ chức Lễ Khai giảng & Tuần sinh hoạt tập thể đầu năm học',
            category: 'Hướng dẫn Phòng GD&ĐT',
            issueDate: '02/08/2026',
            signer: 'Trưởng Phòng GD&ĐT',
            fileUrl: '#',
            views: 1850,
            downloads: 640
          }
        ];

        documents.forEach(d => {
          db.run(
            `INSERT INTO documents (code, title, category, issueDate, signer, fileUrl, views, downloads) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            [d.code, d.title, d.category, d.issueDate, d.signer, d.fileUrl, d.views, d.downloads]
          );
        });
      }
    });

    // Seed Videos if empty
    db.get('SELECT COUNT(*) as count FROM videos', (err, row) => {
      if (!err && row.count === 0) {
        const videos = [
          {
            title: 'Phim tư liệu: 40 năm truyền thống Dạy tốt - Học tốt THCS Đồng Tân',
            youtubeId: 'dQw4w9WgXcQ',
            thumbnailUrl: 'https://images.unsplash.com/photo-1577896851231-70ef18881754?w=600&q=80',
            views: 1540
          },
          {
            title: 'Hoạt động trải nghiệm sáng tạo STEM môn Sinh - Hóa lớp 9',
            youtubeId: 'L_LUpnjgPso',
            thumbnailUrl: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&q=80',
            views: 920
          }
        ];

        videos.forEach(v => {
          db.run(
            `INSERT INTO videos (title, youtubeId, thumbnailUrl, views) VALUES (?, ?, ?, ?)`,
            [v.title, v.youtubeId, v.thumbnailUrl, v.views]
          );
        });
      }
    });

    // Seed Announcements if empty
    db.get('SELECT COUNT(*) as count FROM announcements', (err, row) => {
      if (!err && row.count === 0) {
        const announcements = [
          { content: 'Chào mừng các bạn đến với trang Web chính thức của trường THCS Đồng Tân, Huyện Ứng Hòa, Hà Nội!', link: '' },
          { content: 'Thông báo: Lịch tập trung học sinh toàn trường chuẩn bị cho Lễ Khai giảng năm học 2026 - 2027.', link: '' },
          { content: 'Danh sách xếp lớp học sinh khối 6 mới trúng tuyển năm học 2026 - 2027 đã được niêm yết.', link: '' }
        ];

        announcements.forEach(a => {
          db.run(`INSERT INTO announcements (content, link) VALUES (?, ?)`, [a.content, a.link]);
        });
      }
    });
  });
};

export default db;
