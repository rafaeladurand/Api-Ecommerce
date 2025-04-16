const fs = require("fs");
const path = require("path");
const mongoose = require("mongoose");

const Product = require("./models/product");
const Purchase = require("./models/purchase");
const User = require("./models/user");

const MONGO_URI = "mongodb+srv://root:root@gomarketcluster.57qtd0e.mongodb.net/?retryWrites=true&w=majority&appName=GoMarketCluster";

async function connectDatabase() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("✅ Conectado ao MongoDB");
  } catch (error) {
    console.error("Erro ao conectar no MongoDB:", error);
  }
}

async function generateFiles() {
  try {
    const products = await Product.find();
    const users = await User.find();
    const purchases = await Purchase.find().populate("user").populate("finalPrices.productId");

    const contextDir = path.join(__dirname, "context");
    if (!fs.existsSync(contextDir)) {
      fs.mkdirSync(contextDir);
    }

    const productsText = products
      .map(
        (p) =>
          `ID: ${p._id}\nNome: ${p.name}\nPreço: R$ ${p.price.toFixed(2)}\nDescrição: ${p.description || "N/A"}\n`
      )
      .join("\n");
    fs.writeFileSync(path.join(contextDir, "products.txt"), productsText, "utf8");

    const usersText = users
      .map(
        (u) =>
          `ID: ${u._id}\nNome: ${u.name}\nEmail: ${u.email}\nCPF: ${u.cpf}\n`
      )
      .join("\n");
    fs.writeFileSync(path.join(contextDir, "users.txt"), usersText, "utf8");
      
    const ordersText = purchases
      .map((order) => {
        const userName = order.user?.name || "Desconhecido";
        const itemsText = order.finalPrices
          .map((item) => {
            const productName = item.productId?.name || "Produto removido";
            return `  - Produto: ${productName} | Quantidade: ${item.quantity} | Preço Unitário: R$ ${item.price.toFixed(2)}`;
          })
          .join("\n");

        return `PedidoID: ${order._id}\nClienteID: ${order.user?._id}\nNome do Cliente: ${userName}\nItens:\n${itemsText}\nTotal: R$ ${order.totalPrice.toFixed(2)}\nPago: ${order.isPaid ? "Sim" : "Não"}\n`;
      })
      .join("\n");

    fs.writeFileSync(path.join(contextDir, "orders.txt"), ordersText, "utf8");

    console.log("✅ Arquivos de contexto gerados com sucesso!");
  } catch (error) {
    console.error("Erro ao gerar arquivos:", error);
  } finally {
    mongoose.disconnect();
  }
}

(async () => {
  await connectDatabase();
  await generateFiles();
})();
