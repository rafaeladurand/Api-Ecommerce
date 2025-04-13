const express = require("express");
const bodyParser = require("body-parser");
const productRoutes = require("./routes/product-route.js");
const purchaseRoutes = require("./routes/purchase-route.js");
const userRoutes = require("./routes/user-route.js");
const app = express();
const connectDatabase = require("./database/db.js");
const http = require("http");
const dotenv = require("dotenv");
const cors = require("cors");
const socketIo = require('socket.io');
const server = http.createServer(app);
const io = socketIo(server, {});


dotenv.config();
connectDatabase();

app.use(bodyParser.json());
app.use(cors());

app.use("/api/products", productRoutes);
app.use("/api/purchases", purchaseRoutes);
app.use("/api/users", userRoutes);


io.on('connection', socket => {

  socket.on('authenticate', name => {
    socket.name = name;
  });

  socket.on('chat message', msg => {
    console.log('Received message:', msg);
    io.emit('chat message', { sentBy: msg.sentBy, content: msg.content });
  });

  socket.on('disconnect', () => {});
});


const port = 3000;
server.listen(port, () => {
  console.log(`Aplicação rodando na porta ${port}`);
});
