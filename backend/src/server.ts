// src/server.ts

import { ChatServer } from './ChatServer';

let app = new ChatServer().app;

app.get('/test', (req, res) => {
  res.sendFile('../client/build/index.html');
});

export { app };
