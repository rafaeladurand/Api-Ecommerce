const { GoogleGenerativeAI } = require("@google/generative-ai");
const dotenv = require("dotenv");

dotenv.config();

const geminiKey = process.env.GEMINI_API_KEY;
const genAi = new GoogleGenerativeAI(geminiKey);

const model = genAi.getGenerativeModel({
  model: "gemini-2.0-flash-thinking-exp-01-21"
});

const gemini = {
  prompt: async (prompt) => {
    try {
      const result = await model.generateContent(prompt);
      const response = await result.response;
      return response.text(); // aqui pegamos o texto da resposta
    } catch (error) {
      console.error("Erro ao gerar conteúdo com Gemini:", error);
      return "Erro ao gerar resposta.";
    }
  },

  analysisPrompt: () => {},
  synthesizeResponse: () => {}
};

module.exports = gemini;
