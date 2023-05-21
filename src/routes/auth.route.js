const express = require("express");
const router = express.Router();

const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const verifyToken = require("../middleware/auth");

const Users = require("../database/user.model");

//auth
const generateTokens = (payload) => {
  const { id, name } = payload;
  const accessToken = jwt.sign({ id, name }, "ACCESS_TOKEN_SECRET", {
    expiresIn: "5m",
  });
  const refreshToken = jwt.sign({ id, name }, "REFRESH_TOKEN_SECRET", {
    expiresIn: "48h",
  });

  return { accessToken, refreshToken };
};

const updateRefreshToken = async (id, refreshToken) => {
  try {
    const user = await Users.findOneAndUpdate(
      { id },
      { refreshToken: refreshToken },
      { new: true }
    );
    return user;
  } catch (error) {
    // Xử lý lỗi
    console.error(error);
    throw error;
  }
};
router.get("/me", verifyToken, async (req, res) => {
  const user = await Users.findOne({ id: req.userId });
  if (!user) return res.sendStatus(401);
  return res.json(user);
});

router.post("/login", async (req, res) => {
  const email = req.body.email;

  const user = await Users.findOne({ email: email });

  if (!user) return res.sendStatus(401);
  const dbPassword = user.password;
  bcrypt.compare(req.body.password, dbPassword, (err, hash) => {
    if (err || !hash) {
      return res.status(403).json({
        statusCode: 403,
        error: {
          message: "Password does not match",
        },
      });
    }
    const tokens = generateTokens(user);

    updateRefreshToken(user.id, tokens.refreshToken);
    return res.json(tokens);
  });
});

router.post("/token", async (req, res) => {
  const refreshToken = req.body.refreshToken;
  if (!refreshToken) return res.sendStatus(401);

  const user = await Users.findOne({ refreshToken: refreshToken });

  if (!user) return res.sendStatus(403);
  try {
    jwt.verify(refreshToken, "REFRESH_TOKEN_SECRET");
    const tokens = generateTokens(user);
    updateRefreshToken(user.id, tokens.refreshToken);
    return res.json(tokens);
  } catch (err) {
    console.log(err);
    return res.sendStatus(403);
  }
});

router.post("/register", async (req, res) => {
  const { name, password, email, permissions, avtUser } = req.body;
  const user = await Users.findOne({ email: email });
  if (user) {
    return res.sendStatus(409).json({ error: "User already exists" });
  }
  bcrypt.hash(password, 10, async (err, hash) => {
    if (err) {
      return res.send(err);
    }
    const l = await Users.find();

    const newUser = new Users({
      id: l.length + 1,
      name,
      password: hash,
      email,
      avtUser,
      refreshToken: null,
      permissions,
    });
    await newUser.save();

    return res.sendStatus(201);
  });
});

router.delete("/logout", verifyToken, async (req, res) => {
  const user = await Users.findOne({ id: req.userId });
  updateRefreshToken(user.id, "");
  return res.sendStatus(204);
});

module.exports = router;
