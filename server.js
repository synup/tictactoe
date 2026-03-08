const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const startTime = Date.now();

app.use(express.static(path.join(__dirname, 'public')));

app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    uptime: Math.floor((Date.now() - startTime) / 1000),
    timestamp: new Date().toISOString(),
  });
});

app.listen(PORT, () => {
  console.log(`Tic Tac Toe running on http://localhost:${PORT}`);
});
