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
    // Tìm bài viết dựa trên id
    const campaign = await Campaigns.findById(id);

    if (!campaign) {
      return res.status(404).json({ message: "Không tìm thấy bài viết" });
    }

    // Cập nhật các thuộc tính bài viết từ req.body
    campaign.title = req.body.title;
    campaign.perk = req.body.perk;

    // Lưu bài viết đã chỉnh sửa
    const updatedCampaign = await campaign.save();

    res.json(updatedCampaign);
  } catch (error) {
    res.status(500).json({ message: "Đã xảy ra lỗi khi chỉnh sửa bài viết" });
  }
});

module.exports = router;
