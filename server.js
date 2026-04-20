const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// ── 미들웨어 ──
app.use(cors());
app.use(express.json());

// ── 정적 파일 서빙 (index.html 등) ──
app.use(express.static(path.join(__dirname, 'public')));

// ── API 프록시 엔드포인트 ──
// 프론트엔드가 /api/chat 을 호출하면 여기서 Anthropic 에 전달
app.post('/api/chat', async (req, res) => {
  const { messages, max_tokens = 800 } = req.body;

  // 필수값 검사
  if (!messages || !Array.isArray(messages) || messages.length === 0) {
    return res.status(400).json({ error: '메시지가 필요합니다.' });
  }

  // API 키 확인
  if (!process.env.ANTHROPIC_API_KEY) {
    return res.status(500).json({ error: 'API 키가 설정되지 않았습니다.' });
  }

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens,
        messages,
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      console.error('Anthropic API 오류:', err);
      return res.status(response.status).json({ error: 'API 호출 실패' });
    }

    const data = await response.json();
    res.json(data);
  } catch (err) {
    console.error('서버 오류:', err);
    res.status(500).json({ error: '서버 내부 오류' });
  }
});

// ── 모든 라우트를 index.html 로 fallback ──
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`✅ 서버 실행 중: http://localhost:${PORT}`);
});
