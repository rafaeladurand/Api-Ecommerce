const mongoose = require("mongoose");

const connectDatabase = () => {
  console.log("Wait for connection to database...");

  mongoose
    .connect(
      "mongodb+srv://root:root@gomarketcluster.57qtd0e.mongodb.net/?retryWrites=true&w=majority&appName=GoMarketCluster",
    )
    .then(() => console.log("MongoDB Atlas Connected"))
    .catch((error) => console.log(error));
};

module.exports = connectDatabase;
