import express from 'express';
import { json } from 'body-parser';
import apiRoutes from './routes/api';

const app = express();
const port = 4000; // 백엔드 서버 포트 설정

app.use(json());
app.use('/api', apiRoutes); // API 엔드포인트 설정

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
