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


// router.get('/members', (req, res) => {
//   db.all('SELECT * FROM members', (err, rows) => {
//     if (err) {
//       res.status(500).send({ error: '데이터베이스 조회 오류' });
//     } else {
//       console.log('rows1111111111',rows);
//       res.send(rows);
//     }
//   });
// });
// 멤버 데이터를 반환하는 라우터 (검색 및 기본 조회)
router.get('/members', (req, res) => {
  const ITEMS_PER_PAGE = 5;
  const currentPage = parseInt(req.query.page as string) || 1;
  const query = req.query.query ? `%${req.query.query}%`.trim() : null;
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;
const a = 's';
  let sql = 'SELECT * FROM members';
  const params: any[] = [];

  // 검색어가 있는 경우 필터링 조건 추가
  if (query) {
    sql += ` WHERE name LIKE ? 
             OR team LIKE ? 
             OR position LIKE ? 
             OR employee_id LIKE ?`;
    params.push(query, query, query, query);
  }

  // 페이징 처리 및 정렬 추가
  sql += ' ORDER BY employee_id DESC LIMIT ? OFFSET ?';
  params.push(ITEMS_PER_PAGE, offset);

  db.all(sql, params, (err, rows) => {
    if (err) {
      res.status(500).send({ error: '데이터베이스 조회 오류' });
    } else {
      res.send(rows);
    }
  });
});




export default router;
