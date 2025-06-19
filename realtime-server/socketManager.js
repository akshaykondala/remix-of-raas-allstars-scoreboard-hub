// handles client connections, disconnections + maintains active connections

let io = null;

function socketManager(serverIO) {
    io = serverIO;

    io.on('connection', (socket) => {
        console.log('a user connected');

        socket.on('disconnect', () => {
            console.log('a user disconnected');
        });
    });
}

function getIO() {
    return io;
}

module.exports = {
    socketManager,
    getIO,
};