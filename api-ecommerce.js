const express = require("express");
const bodyParser = require("body-parser");
const productRoutes = require("./routes/product-route.js");
const purchaseRoutes = require("./routes/purchase-route.js");
const userRoutes = require("./routes/user-route.js");
const connectDatabase = require("./database/db.js");
const dotenv = require("dotenv");
const cors = require("cors");
const { v4: uuidv4 } = require("uuid");
const http = require("http");
const socketIo = require("socket.io");

dotenv.config();
connectDatabase();

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {});

app.use(bodyParser.json());
app.use(cors());

app.use("/api/products", productRoutes);
app.use("/api/purchases", purchaseRoutes);
app.use("/api/users", userRoutes);

const messages = [];

io.on("connection", (socket) => {
  socket.on("authenticate", (name) => {
    socket.name = name;
  });

  socket.on("chat message", (msg) => {
    const messageWithId = {
      id: uuidv4(),
      content: msg.content,
      sentBy: msg.sentBy,
      timestamp: new Date().toISOString(),
    };
    messages.push(messageWithId);
    io.emit("chat message", messageWithId);
  });

  socket.on("edit message", (updatedMsg) => {
    const index = messages.findIndex((msg) => msg.id === updatedMsg.id);
    if (index !== -1) {
      messages[index].content = updatedMsg.content;
      io.emit("edit message", messages[index]);
    }
  });

  socket.on("delete message", (messageId) => {
    const index = messages.findIndex((msg) => msg.id === messageId);
    if (index !== -1) {
      messages.splice(index, 1);
      io.emit("delete message", messageId);
    }
  });

  socket.on("typing", (userName) => {
    socket.broadcast.emit("user typing", userName);
  });
});

const port = 3000;
server.listen(port, () => {
  console.log(`Aplicação rodando na porta ${port}`);
});
