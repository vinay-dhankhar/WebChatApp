const express = require("express");
const app = express();
const cors = require('cors');
const chats = require('./data');
const { connectDB } = require("./config/db");
const userRoutes = require('./routes/userRoutes');
const chatRoutes = require('./routes/chatRoutes');
const messageRoutes = require('./routes/messageRoutes');
// const { connection } = require("mongoose");

// const { notFound, errorHandler } = require("./middleware/errorHandler");

require("dotenv").config();

app.use(cors ({
  origin:'http://localhost:3000',
  // credentials:true
}))

app.use(express.json());

app.get("/", (req, res) => {
  res.send("API Running!"); 
});

// app.get("/api/chat/:id" , (req , res) => {
//   // console.log(req.params.id);
//   // important point
//   const chat = chats.find((c) => c._id === req.params.id);
//   res.send(chat);
// })

app.use('/api/user' , userRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/message" , messageRoutes);

const server = app.listen(4000 , ()=> {
  console.log("Server started at port 4000");
})

// socket.io setup : 

const io = require('socket.io')(server , {
  pingTimeout:60000,
  cors:{
    origin : 'http://localhost:3000',
  },
})

// connection establishing
io.on("connection" , (socket) => {
  console.log("Connected to socket.io");

  // here we are creating a new socket where the frontend will send some data and will join the room
  socket.on('setup' , (userData) => {
    // here we  will create a new room with the id of the user data
    socket.join(userData._id);
    console.log(userData._id);
    console.log(userData);
    // this will emit/output into the socket named 'connected'.
    socket.emit('connected');
  })

  // new similar socket
  socket.on('join chat' , (room) => {
    socket.join(room);
    console.log("User joined room: " , room);
  }) 

  socket.on('new message' , (newMessageReceived) => {
    var chat = newMessageReceived.chat;

    if(!chat.users) return console.log('chat.users Not defined');

    chat.users.forEach( user => {
      if(user._id === newMessageReceived.sender._id) return;

      socket.in(user._id).emit("message received", newMessageReceived);

    });
  })

  // socket.on('disconnectUser' , (userData) => {
  //   console.log("USer disconnected");
  //   socket.leave(userData._id);
  // });

})

connectDB();