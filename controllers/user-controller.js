const jwt = require("jsonwebtoken");
const User = require("../models/user");
const aiService = require("../services/aiService");;

async function createUser(req, res) {
  try {
    const { name, email, cpf, password } = req.body;

    const userExists = await User.findOne({ $or: [{ email }, { cpf }] });
    if (userExists) {
      return res.status(400).json({ message: "Email ou CPF já cadastrados." });
    }

    const newUser = new User({ name, email, cpf, password });
    await newUser.save();

    res.status(201).json({ message: "Usuário criado com sucesso.", user: newUser });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erro interno do servidor." });
  }
}

//  /gustavo
async function loginUser(req, res) {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Credenciais inválidas." });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: "Credenciais inválidas." });
    }

    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({ token, user: { id: user._id, email: user.email, name: user.name } });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erro interno do servidor." });
  }
}

async function getUser(req, res) {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "Usuário não encontrado." });
    }
    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erro interno do servidor." });
  }
}

async function getAllUsers(req, res) {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erro interno do servidor." });
  }
}

async function updateUser(req, res) {
  try {
    const { name, email, password } = req.body;
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "Usuário não encontrado." });
    }

    user.name = name || user.name;
    user.email = email || user.email;
    if (password) {
      user.password = password;
    }

    await user.save();
    res.json({ message: "Usuário atualizado com sucesso." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erro interno do servidor." });
  }
}

async function deleteUser(req, res) {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "Usuário não encontrado." });
    }
    res.json({ message: "Usuário excluído com sucesso." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erro interno do servidor." });
  }
}

async function getUserPurchases(req, res) {
  try {
    const user = await User.findById(req.params.userId).populate({
      path: "purchases",
      populate: { path: "products" },
    });

    if (!user) {
      return res.status(404).json({ message: "Usuário não encontrado." });
    }

    res.json(user.purchases);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erro interno do servidor." });
  }
}
async function updatePassword(req, res) {
  try {
    const userId = req.params.id;
    const { currentPassword, newPassword } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "Usuário não encontrado." });
    }

    const isMatch = await user.matchPassword(currentPassword);
    if (!isMatch) {
      return res.status(400).json({ message: "Senha atual incorreta." });
    }

    user.password = newPassword;
    await user.save();

    res.json({ message: "Senha atualizada com sucesso." });
  } catch (error) {
    console.error("Erro ao atualizar senha:", error);
    res.status(500).json({ message: "Erro ao atualizar senha." });
  }
}

async function talkWithGemini(req, res) {
  try {
    const text = await aiService.prompt(req.body.prompt);
    res.status(200).json({ response: text });
  } catch (error) {
    console.error("Erro ao conversar com Gemini:", error);
    res.status(500).json({ message: "Erro ao gerar resposta." });
  }
}



module.exports = {createUser, loginUser,getUser,getAllUsers,  updateUser,deleteUser,getUserPurchases, updatePassword, talkWithGemini};
