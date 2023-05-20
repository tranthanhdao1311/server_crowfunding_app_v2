const mongoose = require("mongoose");

// Định nghĩa Schema cho mô hình User
const Users = new mongoose.Schema({
  id: { type: Number, required: true },
  name: { type: String, required: true },
  password: { type: String, required: true },
  email: { type: String, required: true },
  avtUser: { type: String },
  refreshToken: { type: String },
});

// Tạo mô hình User từ Schema đã định nghĩa
const User = mongoose.model("User", Users);

module.exports = User;
