const jwt = require("jsonwebtoken");
const User = require("../models/user");

async function createUser(req, res) {
  try {
    const { fullName, cpf, login, password } = req.body;

    const userExists = await User.findOne({ $or: [{ login }, { cpf }] });
    if (userExists) {
      return res
        .status(400)
        .json({ message: "Login ou identificador já existe." });
    }

    const newUser = new User({
      fullName,
      cpf,
      login,
      password,
    });

    await newUser.save();
    res.status(201).json({ message: "Usuário criado com sucesso." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erro interno do servidor." });
  }
}

//  /gustavo
async function loginUser(req, res) {
  try {
    const { login, password } = req.body;

    const user = await User.findOne({ login });
    if (!user) {
      return res.status(401).json({ message: "Credenciais inválidas." });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: "Credenciais inválidas." });
    }

    const token = jwt.sign(
      { userId: user._id, login: user.login },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || "1d" }
    );

    res.json({
      token,
      user: {
        id: user._id,
        login: user.login,
        fullName: user.fullName,
      },
    });
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
    const { fullName, login, password } = req.body;
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "Usuário não encontrado." });
    }

    user.fullName = fullName || user.fullName;
    user.login = login || user.login;
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

module.exports = {
  createUser,
  loginUser,
  getUser,
  getAllUsers,
  updateUser,
  deleteUser,
  getUserPurchases,
};
