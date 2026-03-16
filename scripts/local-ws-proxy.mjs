import { WebSocketServer } from 'ws';
import net from 'net';

const WS_PORT = parseInt(process.env.WS_PROXY_PORT || '5433', 10);
const PG_HOST = process.env.PG_HOST || 'localhost';
const PG_PORT = parseInt(process.env.PG_PORT || '5432', 10);

const wss = new WebSocketServer({ port: WS_PORT });

wss.on('connection', (ws, req) => {
  console.log(`[proxy] New WS connection from ${req.url}`);

  const socket = net.createConnection({ host: PG_HOST, port: PG_PORT }, () => {
    console.log(`[proxy] Connected to PostgreSQL ${PG_HOST}:${PG_PORT}`);
  });

  ws.on('message', (data, isBinary) => {
    const buf = Buffer.isBuffer(data) ? data : Buffer.from(data);
    socket.write(buf);
  });

  socket.on('data', (data) => {
    if (ws.readyState === ws.OPEN) {
      ws.send(data);
    }
  });

  socket.on('error', (err) => {
    console.error(`[proxy] PG socket error: ${err.message}`);
    ws.close();
  });
  socket.on('close', () => {
    console.log('[proxy] PG socket closed');
    ws.close();
  });
  ws.on('close', () => {
    console.log('[proxy] WS closed');
    socket.destroy();
  });
  ws.on('error', (err) => {
    console.error(`[proxy] WS error: ${err.message}`);
    socket.destroy();
  });
});

wss.on('error', (err) => {
  console.error(`[proxy] Server error: ${err.message}`);
});

console.log(`WebSocket-to-PostgreSQL proxy listening on ws://localhost:${WS_PORT} → ${PG_HOST}:${PG_PORT}`);
