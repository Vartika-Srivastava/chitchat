const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const socketio = require('socket.io');
const io = socketio(server);
const path = require('path');
const formatMessage = require('./utils/messages');
const { userJoin, getCrntUser, userLeave, roomUsers } = require('./utils/users');

app.use(express.static(path.join(__dirname, 'public')));

// app.get('/', (req,res)=>{
//     res.sendFile("index");
// })

io.on('connection', socket => {
    socket.on('joinRoom', ({username, room}) => {
        const user = userJoin(socket.id, username, room);
        socket.join(user.room);

        socket.emit('update','Welcome in ChitChat Room');

        socket.broadcast.to(user.room).emit('update', `${user.username} joined the chat room`);

        io.to(user.room).emit('roomUsers',{
            room: user.room,
            users: roomUsers(user.room)
        });
    });

    // socket.on('send',(msg) => {
    //     const user = getCrntUser(socket.id);
    //     socket.broadcast.to(user.room).emit('receive',formatMessage(user.username,msg));
    // })

    // listen for chat message
    socket.on('chatMsg', (msg) => {
        const user = getCrntUser(socket.id);
        io.to(user.room).emit('message',formatMessage(user.username,msg))
    });

    socket.on('disconnect', () => {
        const user = userLeave(socket.id);
        if(user){
            io.to(user.room).emit('update',`${user.username} left the chat room`);

            io.to(user.room).emit('roomUsers',{
                room: user.room,
                users: roomUsers(user.room)
            });
        }
    });
});

const PORT = process.env.PORT || 8080;

server.listen(PORT, () => console.log(`server running on port ${PORT}`));