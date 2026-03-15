import 'dotenv/config';
import http from 'http';
import { Server } from 'socket.io';
import LiveKitService from './src/services/LiveKitService.js';
import SocketController from './src/controllers/SocketController.js';

/**
 * Dispatch Hub - SOLID/OOP entry point
 */

// 1. Initial configuration and validation
const LIVEKIT_API_KEY = process.env.LIVEKIT_API_KEY;
const LIVEKIT_API_SECRET = process.env.LIVEKIT_API_SECRET;
const LIVEKIT_URL = process.env.LIVEKIT_URL;
const PORT = process.env.SOCKET_SERVER_PORT || 3000;

if (!LIVEKIT_API_KEY || !LIVEKIT_API_SECRET || !LIVEKIT_URL) {
  console.error('CRITICAL ERROR: LiveKit configuration is incomplete in .env');
  process.exit(1);
}

// 2. Instantiate Services
const liveKitService = new LiveKitService(
  LIVEKIT_API_KEY, 
  LIVEKIT_API_SECRET, 
  LIVEKIT_URL
);

// 3. Set up Servers
const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('Dispatch Hub Socket Server is running.\n');
});

const io = new Server(server, {
  cors: {
    origin: '*', // Adjust based on security needs
    methods: ['GET', 'POST'],
  },
});

// 4. Instantiate and Initialize Controllers
const socketController = new SocketController(io, liveKitService);
socketController.init();

// 5. Start listening
server.listen(PORT, () => {
  console.log('====================================');
  console.log(`🚀 Dispatch Hub Server running on port ${PORT}`);
  console.log(`🔗 LiveKit URL: ${LIVEKIT_URL}`);
  console.log('====================================');
});
