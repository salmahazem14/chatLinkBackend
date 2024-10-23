const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const connectDB = require("./config/db");

const app = express();
const server = http.createServer(app);
// Routes
const groupRoutes = require("./routes/groupRoutes");
const chatRoutes = require("./routes/chatRoutes");
const messageRoutes = require("./routes/messageRoutes");
const notificationRoutes = require("./routes/notificationRoutes");
const userRoutes = require("./routes/userRoutes");
const authRoutes = require("./routes/authRoutes");
const authMiddleware = require("./controllers/authMiddleware");

connectDB();

// Set up Socket.IO server
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000", // Frontend URL
  },
});

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/group", authMiddleware, groupRoutes);
app.use("/api/chats", authMiddleware, chatRoutes);
app.use("/api/messages", authMiddleware, messageRoutes);
app.use("/api/notifications", authMiddleware, notificationRoutes);
app.use("/api/user", authMiddleware, userRoutes);

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("joinRoom", (roomName) => {
    socket.join(roomName);
    console.log(`User ${socket.id} joined room: ${roomName}`);
  });

  socket.on("typing", ({ roomName, user }) => {
    socket.to(roomName).emit("userTyping", { user });
    console.log(`User ${user.firstName} is typing in room: ${roomName}`);
  });

  socket.on("stoppedTyping", ({ roomName, user }) => {
    socket.to(roomName).emit("userStoppedTyping", { user });
    console.log(`User ${user.firstName} stopped typing in room: ${roomName}`);
  });

  socket.on("sendMessage", (data) => {
    const { _id, content } = data;
    io.to(_id).emit("receiveMessage", data);
    console.log(`Message from ${socket.id} in room ${_id}: ${content}`);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

server.listen(5000, () => {
  console.log("Server listening on port 5000");
});
