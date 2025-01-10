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
const schema = new mongoose.Schema({ msg: String });
const Model = mongoose.model('messages', schema);

io.on('connection', (socket) => {
    console.log('a user connected');
    const id = socket.id;
    socket.emit('id', id)
    socket.on('message', (message) => {
        io.emit('message-emit', (id, message));
        const doc = new Model({ msg: message });
        doc.save();
    });
    socket.on('disconnect', () => {
        console.log('user disconnected');
    });
});

app.get('/get', async (req, res) => {
    try {
        const message = await Model.find({}, { msg: 1, _id: 0 });
        res.status(200).json(message)
    } catch (error) {
        console.error(error)
        throw error;
    }
})

httpServer.listen(3000, () => {
    console.log('Server started on port 3000');
});
