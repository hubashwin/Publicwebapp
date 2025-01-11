const http = require('http');
const mongoose = require('mongoose')
const uri = "mongodb+srv://ashwinmongo:ashwinmongo911@ashwincluster.ujjhi.mongodb.net/ChatApp?retryWrites=true&w=majority&appName=ashwincluster"
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
mongoose.connect(uri);
const db = mongoose.connection;
if (mongoose.model.Model) {
    delete mongoose.model.Model;
}

const schema = new mongoose.Schema({ id: String, msg: String });
const Model = mongoose.model('messages', schema);

io.on('connection', (socket) => {
    console.log('a user connected');
    const id = socket.id;
    socket.emit('id', id)
    socket.on('message', (message) => {
        io.emit('message-emit', (id, message));
        const doc = Model.create({ id: id, msg: message });
    });
    socket.on('disconnect', () => {
        console.log('user disconnected');
    });
});

httpServer.listen(3000, () => {
    console.log('Server started on port 3000');
});
