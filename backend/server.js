const http = require('http');
const express = require('express');
const { Server } = require('socket.io');
const app = express();
const path = require('path');
const httpServer = http.createServer(app);
const io = new Server(httpServer);
app.use(express.static(path.resolve("./hello")))
app.get('/', (req, res) => {
    return res.sendFile('/hello/index.html')
});

io.on('connection', (socket) => {
    console.log('a user connected');
    const id = socket.id;
    socket.emit('id', id)
    socket.on('message', (message) => {
        io.emit('message-emit', (id, message));
    });
    socket.on('disconnect', () => {
        console.log('user disconnected');
    });
});

httpServer.listen(3000, () => {
    console.log('Server started on port 3000');
});