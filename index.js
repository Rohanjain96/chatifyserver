const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv")
dotenv.config(".env")
const connection = require("./db/db.js");
const userrouter = require("./Routes/userroutes")
const messagerouter = require("./Routes/messageroutes")
const chatrouter = require("./Routes/chatroutes")

const app = express();
const corsoptions = { credentials: true};
const PORT = process.env.PORT || 5000
app.use(cors(corsoptions));
app.use(express.json());
app.use(express.urlencoded({ extended: false }))
app.use("/api/users", userrouter);
app.use("/api/chats", chatrouter);
app.use("/api/messages", messagerouter);

connection();

const server =app.listen(PORT, () => { console.log(`listening on port:${PORT}`); })
const io = require("socket.io")(server, {
  cors: {
    origin:"exp://192.168.1.37:19000"
  }
})

io.on("connection", (socket) => {
  socket.on("setup", (userId) => {
    socket.join(userId)
  })

  socket.on("joinchat", (chatId) => {
    socket.join(chatId)
  })

  socket.on("createdChat",(data,User)=>{
    data.users.forEach((user) => {
      if (user === User._id) return;
      socket.in(user._id).emit("updateChat", data)
    });
  })

  socket.on("acceptGroupRequest",(data,User)=>{
    data.users.forEach((user) => {
      if (user === User._id) return;
      socket.in(user._id).emit("recievedResponse", data)
    });
  })

  socket.on("createdGroupChat",(data,User)=>{
    data.pendingusers.forEach((user) => {
      if (user === User._id) return;
      socket.in(user).emit("updateChat", data)
    });
  })

  socket.on("addedToGroupChat",(data,User)=>{
    data.pendingusers.forEach((user) => {
      if (user === User._id) return;
      socket.in(user).emit("updateChat", data)
    });
  })

  socket.on("sendMessage", (message) => {
    message.chat.users.forEach((user) => {
      if (user === message.sender._id) return;
      socket.in(user).emit("recievedMessage", message)
    });
  })

  socket.on("sendResponse", (User,data) => {
    data.users.forEach((user) => {
      if (user === User._id) return;
      socket.in(user._id).emit("recievedResponse",data)
    });
  })

  socket.on("disconnect", (userId) => {
    console.log("USER DISCONNECTED");
    socket.disconnect(userId);
  });

})