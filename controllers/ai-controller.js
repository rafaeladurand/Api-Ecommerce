const aiService = require("../services/aiService.js");

async function defaultPrompt(req, res) {
    const { prompt } = req.body;
    const response = await aiService.prompt(prompt);

    if (response === 'Erro ao chamar a API Gemini') {
        return res.status(500).json({ error: 'Erro ao chamar a API Gemini' });
    }

    return res.status(200).json(response);
}

async function longContext(req, res) {
    const { prompt, userId } = req.body;
  
    const userPrefix = userId
      ? `IMPORTANTE: O ID do cliente que está perguntando é: ${userId}. Use apenas os dados relacionados a esse usuário para responder.`
      : "";
  
    const fullPrompt = `${userPrefix}\n${prompt}`;
  
    const response = await aiService.longContext(fullPrompt);
  
    if (response === 'Erro ao chamar a API Gemini') {
      return res.status(500).json({ error: 'Erro ao chamar a API Gemini' });
    }
  
    return res.status(200).json(response);
  }
  

module.exports = {defaultPrompt,longContext,};