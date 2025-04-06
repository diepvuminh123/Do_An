// controllers/accountController.js
const Account = require("../models/Account");
const jwt = require("jsonwebtoken");

// Tạo tài khoản mới
exports.createAccount = async (req, res) => {
  try {
    const { username, password, name, remainingPages } = req.body;

    // Kiểm tra xem tài khoản đã tồn tại chưa
    const existingAccount = await Account.findOne({ username });
    if (existingAccount) {
      return res.status(400).json({ message: "Username already exists" });
    }

    // Tạo tài khoản mới
    const newAccount = new Account({
      username,
      password,
      name,
      remainingPages,
    });
    await newAccount.save();

    // Tạo token xác thực JWT
    const token = newAccount.generateToken();

    res.status(201).json({ message: "Account created successfully", token });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Đăng nhập
exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Tìm tài khoản theo username
    const account = await Account.findOne({ username });
    if (!account) {
      return res.status(404).json({ message: "Account not found" });
    }

    // Kiểm tra mật khẩu
    const isMatch = await account.matchPassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid password" });
    }

    // Tạo token xác thực JWT
    const token = account.generateToken();

    res.status(200).json({ message: "Login successful", token });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Xác thực tài khoản (middleware)
exports.authenticate = async (req, res, next) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.account = await Account.findById(decoded.id);
    if (!req.account) {
      return res.status(404).json({ message: "Account not found" });
    }
    next();
  } catch (err) {
    res.status(401).json({ message: "Invalid token" });
  }
};
