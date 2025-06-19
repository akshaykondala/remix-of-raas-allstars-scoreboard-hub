// sets up http server, hooks in socket.io, applies cors

// import dependencies
const express = require('express');
const http = require('http');
const cors = require('cors');
const { Server } = require('socket.io');
const { socketManager } = require('./socketManager');

// create express app
const app = express();
app.use(cors());

// create http server
const server = http.createServer(app);

// initialize socket.io
const io = new Server(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST'],
        credentials: true,
    }, 
});

// pass io instance to socketmanager
socketManager(io);

// start server on port 3000
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});