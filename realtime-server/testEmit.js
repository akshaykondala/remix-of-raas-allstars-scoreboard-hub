// testEmit.js

const { publishScoreUpdate, publishProjectionUpdate } = require('./eventPublisher');
const { socketManager } = require('./socketManager');
const { Server } = require('socket.io');
const http = require('http');

// Set up minimal HTTP server just for this test
const server = http.createServer();
const io = new Server(server, {
  cors: {
    origin: "*",  // Allow all origins for testing
    methods: ["GET", "POST"]
  }
});
socketManager(io);

// Start WebSocket server on same port for test
server.listen(3000, () => {
  console.log('Test WebSocket Server running on port 3000');
});

// Add connection logging
io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);
  
  // Log when the client disconnects
  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });

  // Log any errors
  socket.on('error', (error) => {
    console.error('Socket error:', error);
  });
});

// Emit test event after small delay to ensure server is ready
setTimeout(() => {
  try {
    console.log('Emitting test events...');
    
    // Test score update for CMU Raasta (id: '2')
    console.log('Sending score update for team 2 (CMU Raasta) with score 95');
    publishScoreUpdate('2', 95);
    console.log('Score update emitted for CMU Raasta (id: 2)');
    
    // Test projection update for Texas Raas (id: '1')
    console.log('Sending projection update for team 1 (Texas Raas) with projection 182.4');
    publishProjectionUpdate('1', 182.4);
    console.log('Projection update emitted for Texas Raas (id: 1)');
    
  } catch (error) {
    console.error('Error emitting test events:', error);
  }
}, 1000);

// Keep the server running
process.on('SIGINT', () => {
  console.log('Shutting down test server...');
  server.close(() => {
    console.log('Test server closed');
    process.exit(0);
  });
});
