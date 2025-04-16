const fs = require("fs");
const { GoogleGenerativeAI } = require("@google/generative-ai");

const apiKey = "AIzaSyBm1SGctwmZ2MZfW06nsMYrxOtNDDckgWI";
//console.log("🔑 Chave atual da Gemini API:", apiKey);

const MODEL = "gemini-2.0-flash";
const ai = new GoogleGenerativeAI(apiKey);


const instructions = `Você é um assistente de consulta de banco de dados. Sua tarefa é responder perguntas com base EXCLUSIVAMENTE nos dados fornecidos a seguir, que foram extraídos de um banco de dados de produtos. Seja preciso e refira-se apenas às informações presentes no contexto.`;

const model = ai.getGenerativeModel({
  model: MODEL,
  systemInstruction: instructions,
});

async function getFormattedData() {
  const products = fs.readFileSync("./context/products.txt", "utf8");
  const purchases = fs.readFileSync("./context/orders.txt", "utf8");
  const users = fs.readFileSync("./context/users.txt", "utf8");

  const formattedData = `
    === PRODUTOS ===
    ${products}

    === PEDIDOS ===
    ${purchases}

    === USUÁRIOS ===
    ${users}`;

  return formattedData;
}

async function parsePrompt(prompt) {
  const response = await ai.generateContent({
    model: MODEL,
    contents: [
      { role: "system", content: "You are a helpful assistant." },
      { role: "user", content: prompt },
    ],
  });
  return response.response.text(); 
}

const aiService = {
  prompt: async (message) => {
    return await parsePrompt(message);
  },

  longContext: async (prompt) => {
    const formattedData = await getFormattedData();

    const configPrompt = `Você é um assistente de inteligência artificial especializado em atendimento ao cliente para uma loja online, especificamente um supermercado. Sua única fonte de verdade são os dados que serão fornecidos a seguir, extraídos diretamente do banco de dados da loja.
    Ignore qualquer contexto externo, histórico de conversa ou conhecimento geral que não esteja explicitamente presente nos dados entre as marcações [INÍCIO DOS DADOS DO BANCO] e [FIM DOS DADOS DO BANCO]. Foque exclusivamente nas informações disponíveis nesses dados.

    Seu objetivo é ajudar os clientes da loja a:
    - Consultar detalhes de um pedido específico, incluindo:
    - Lista de itens do pedido com os nomes dos produtos;
    - Quantidade e preço individual de cada item;
    - Valor total do pedido;
    - Status de pagamento (se o pedido foi pago ou não);
    - Descobrir quantos pedidos o cliente já realizou.

    Aqui estão os dados relevantes extraídos do banco de dados:

[INÍCIO DOS DADOS DO BANCO]
${formattedData}
[FIM DOS DADOS DO BANCO]

Agora, com base somente nesses dados, responda de forma clara, objetiva e detalhada a qualquer pergunta relacionada a pedidos feitos na loja.`;

    const chatBody = {
      contents: [
        {
          role: "user",
          parts: [{ text: configPrompt }],
        },
        {
          role: "user",
          parts: [{ text: prompt }],
        },
      ],
    };

    try {
      const result = await model.generateContent(chatBody);
      const response = result.response;
      const text = response.text();

      if (response.usageMetadata) {
        console.log("Uso de Tokens:");
        console.log(` - Prompt: ${response.usageMetadata.promptTokenCount}`);
        console.log(` - Total: ${response.usageMetadata.totalTokenCount}`);
      }

      return text;
    } catch (error) {
      console.error("\n--- Erro ao chamar a API Gemini ---");
      console.error(error);
      if (
        error.message.includes("400 Bad Request") ||
        error.message.includes("Quota")
      ) {
        console.error(
          "Verifique se o arquivo não é muito grande ou se você atingiu os limites de uso da API."
        );
      }
      if (error.message.includes("API key not valid")) {
        console.error("Verifique se sua GEMINI_API_KEY está correta e ativa.");
      }
      console.error("-----------------------------------\n");
      return "Erro ao chamar a API Gemini";
    }
  },
};

module.exports = aiService;
