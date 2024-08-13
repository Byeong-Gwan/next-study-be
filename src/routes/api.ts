import express, { Request, Response } from 'express';
import { Database } from 'sqlite3';
import path from 'path';

// Express 앱과 Router 설정
const app = express();
const router = express.Router();

// SQLite 데이터베이스 연결
const dbPath = path.resolve(__dirname, '../database/tea_db.sqlite');
const db = new Database(dbPath, (err) => {
  if (err) {
    return console.error('SQLite 연결 실패:', err.message);
  }
  console.log('SQLite 연결 성공!');
});

// /members 경로에 대한 핸들러
router.get('/members', (req: Request, res: Response) => {
  const query = typeof req.query.query === 'string' ? req.query.query : '';
  const page = typeof req.query.page === 'string' ? req.query.page : '1';
  const itemsPerPage = typeof req.query.itemsPerPage === 'string' ? req.query.itemsPerPage : '10';

  const currentPage = parseInt(page, 10);
  const limit = parseInt(itemsPerPage, 10);
  const offset = (currentPage - 1) * limit;

  const searchQuery = `%${query}%`;

  const sql = `
      SELECT name, team, position, employee_id
      FROM members
      WHERE name LIKE ? OR team LIKE ? OR position LIKE ? OR employee_id LIKE ?
          LIMIT ? OFFSET ?`;

  const countSql = `
      SELECT COUNT(*) as totalCount
      FROM members
      WHERE name LIKE ? OR team LIKE ? OR position LIKE ? OR employee_id LIKE ?`;

  db.all(sql, [searchQuery, searchQuery, searchQuery, searchQuery, limit, offset], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }

    db.get(countSql, [searchQuery, searchQuery, searchQuery, searchQuery], (err, countResult) => {
      if (err) {
        return res.status(500).json({ error: 'Count query error' });
      }

      const totalCount = (countResult as { totalCount: number }).totalCount;
      const totalPages = Math.ceil(totalCount / limit);

      res.json({
        members: rows,
        totalPages: totalPages,
      });
    });
  });
});

// Express 앱에 Router 적용
app.use('/api', router);

// 서버 시작
const port = 4001;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});





export default router;
