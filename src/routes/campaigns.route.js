const express = require("express");

const router = express.Router();
const paypal = require("@paypal/checkout-server-sdk");

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

    res.json({ message: "Xóa chiến dịch thành công!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server Error" });
  }
});

router.put("/campaigns/:id/add-amount", async (req, res) => {
  const { id } = req.params;
  const { amount } = req.body;

  try {
    const campaign = await Campaigns.findOne({ id: id });

    if (!campaign) {
      return res.status(404).json({ error: "Campaign not found" });
    }

    // Cộng tổng tiền vào raisedAmount
    campaign.raisedAmount += amount;
    campaign.supporter += 1;

    // Lưu thay đổi vào cơ sở dữ liệu
    await campaign.save();

    res.json(campaign);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server Error" });
  }
});

router.post("/campaign/:id/click", async (req, res) => {
  const { id } = req.params;

  try {
    const post = await Campaigns.findOne({ id: id });

    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    // Tăng giá trị của clickCampaign lên 1
    post.clickCampaign += 1;

    // Lưu thay đổi vào cơ sở dữ liệu
    await post.save();

    res.json({ message: "Đã ghi nhận việc click vào bài viết" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server Error" });
  }
});

router.get("/popular-posts", async (req, res) => {
  try {
    const popularPosts = await Campaigns.find({
      clickCampaign: { $gt: 0 },
    }).sort({ clickCampaign: -1 });

    res.json(popularPosts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server Error" });
  }
});

module.exports = router;
