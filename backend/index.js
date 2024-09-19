const express = require('express');
const cors = require('cors');
const app = express();
const path = require('path');
const PORT = 3000;

// CORS 설정 (React와 Express 간의 통신 허용)
app.use(cors());
// app.use(cors({ origin: 'http://localhost:3000' })); // React 앱의 URL
app.use(express.json());

// 예시 API 엔드포인트
app.get('/api/message', (req, res) => {
  res.json({ message: 'Hello from Express! 잘 도착했나???' });
});

app.post('/api/data', (req, res) => {
  const data = req.body;
  console.log('Received data:', data);
  res.json({ status: 'Data received' });
});

// 서버 실행
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// React의 build 폴더를 정적 파일로 서빙
// app.use(express.static(path.join(__dirname, 'frontend/build')));

// 모든 요청에 대해 React의 index.html을 반환
// app.get('*', (req, res) => {
//   res.sendFile(path.join(__dirname, 'frontend/build', 'index.html'));
// });

//https://stackoverflow.com/questions/74356508/error-enoent-no-such-file-or-directory-stat-app-backend-frontend-build-inde
