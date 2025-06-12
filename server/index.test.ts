import express from 'express';

export function startServer() {
  const app = express();

  app.get('/health', (_req, res) => {
    res.send('🟢 Server is up!');
  });

  const port = 3001;
  app.listen(port, () => {
    console.log(`Backend listening on port ${port}`);
  });
}
