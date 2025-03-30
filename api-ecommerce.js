const express = require("express");
const bodyParser = require("body-parser");
const productRoutes = require("./routes/product-route.js");
const purchaseRoutes = require("./routes/purchase-route.js");
const userRoutes = require("./routes/user-route.js");
const connectDatabase = require("./database/db.js");
const dotenv = require("dotenv");
const cors = require("cors");


dotenv.config();

const app = express();
app.use(cors()); 

connectDatabase();

app.use(bodyParser.json());

app.use("/api/products", productRoutes);
app.use("/api/purchases", purchaseRoutes);
app.use("/api/users", userRoutes);


const port = 3000;
app.listen(port, () => {
  console.log(`Aplicação rodando na porta ${port}`);
});
