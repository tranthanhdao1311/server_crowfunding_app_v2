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

router.put("/campaigns/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const campaign = await Campaigns.findOneAndUpdate(
      { id: id },
      { ...req.body },
      { new: true }
    );

    if (!campaign) {
      return res.status(404).json({ error: "Campaign not found" });
    }

    res.json(campaign);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

router.get("/campaigns/:id", async (req, res) => {
  const id = req.params.id;

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

router.delete("/campaigns/:id", async (req, res) => {
  const id = req.params.id;

  try {
    const campaign = await Campaigns.findOneAndDelete({ id: id });

    if (!campaign) {
      return res.status(404).json({ error: "Campaign not found" });
    }

    res.json({ message: "Campaign deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server Error" });
  }
});

module.exports = router;
