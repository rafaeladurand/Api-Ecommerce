require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const productRoutes = require("./routes/productRoutes");
const purchaseRoutes = require("./routes/purchaseRoutes");
const userRoutes = require("./routes/userRoutes");
const connectDatabase = require("./database/db.js");
const perfilRoutes = require("./routes/perfilRoutes.js");


const app = express();
connectDatabase();

app.use(bodyParser.json());

app.use("/api/products", productRoutes);
app.use("/api/purchases", purchaseRoutes);
app.use("/api/users", userRoutes);
app.use("/api/perfis", perfilRoutes);


const port = 3000;
app.listen(port, () => {
  console.log(`Aplicação rodando na porta ${port}`);
});
