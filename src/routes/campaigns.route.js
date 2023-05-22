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
  const camp = await Campaigns.find();

  const id = camp.length + 1;

  const data = new Campaigns({ id: id, ...req.body });
  await data.save();

  res.json(data);
});

router.get("/campaigns/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const data = await Campaigns.findOne({ id: id });
    if (!data) {
      return res.status(404).json({ error: "Campaign not found" });
    }

    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server Error" });
  }
});

module.exports = router;
