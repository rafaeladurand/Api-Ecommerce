const mongoose = require("mongoose");

const connectDatabase = () => {
  console.log("Wait for connection to database...");

  mongoose
    .connect(
      "mongodb+srv://root:root@fase1.0fpkd.mongodb.net/?retryWrites=true&w=majority&appName=Fase1",
      { useNewUrlParser: true, useUnifiedTopology: true } 
      // Usa o novo parser de URL do MongoDB
      // Habilita o novo mecanismo de gerenciamento de conexões
    )
    .then(() => console.log("MongoDB Atlas Connected"))
    .catch((error) => console.log(error));
};

module.exports = connectDatabase;
