const express = require("express");

const router = express.Router();
const verifyToken = require("../middleware/auth");

const Campaigns = require("../database/campaigns.model");
//verifyToken
router.get("/campaigns", async (req, res) => {
  const data = await Campaigns.find();

  res.json(data);
});

router.post("/campaigns", async (req, res) => {
  const data = new Campaigns(req.body);
  await data.save();

  res.json(data);
});

module.exports = router;
