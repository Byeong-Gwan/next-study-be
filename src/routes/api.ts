import express, { query } from 'express';
import { Database } from 'sqlite3';
import path from 'path';

const router = express.Router();

// SQLite 데이터베이스 연결
const dbPath = path.resolve(__dirname, '../database/tea_db.sqlite');
const db = new Database(dbPath, (err) => {
  if (err) {
    return console.error('SQLite 연결 실패:', err.message);
  }
  console.log('SQLite 연결 성공!');
});


router.get('/members', (req, res) => {
  db.all('SELECT * FROM members', (err, rows) => {
    if (err) {
      res.status(500).send({ error: '데이터베이스 조회 오류' });
    } else {
      console.log('rows1111111111',rows);
      res.send(rows);
    }
  });
});
// 멤버 데이터를 반환하는 라우터 (검색 및 기본 조회)
router.get('/members', (req, res) => {
  const { query = '', page = '1', itemsPerPage = '5' } = req.query;

  const searchQuery = `%${query}%`;
  const currentPage = parseInt(page as string, 10);
  const limit = parseInt(itemsPerPage as string, 10);
  const offset = (currentPage - 1) * limit;

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


      // countResult를 { totalCount: number }로 타입 단언
      const totalCount = (countResult as { totalCount: number }).totalCount;
      const totalPages = Math.ceil(totalCount / limit);

      res.json({
        members: rows,
        totalPages: totalPages,
      });
    });
  });
});





export default router;
