const mongoose = require("mongoose");
const Campaigns = new mongoose.Schema({
  title: { type: String, required: true },
  category: {
    id: { type: Number, required: true },
    name: { type: String, required: true },
    imgCate: { type: String },
  },
  desc: { type: String },
  goal: { type: String, required: true },
  amountPrefilled: { type: String },
  video: { type: String },
  campaignEndMethod: { type: String },
  country: { type: String },
  startDate: { type: Date },
  endDate: { type: Date },
  imageCampaign: { type: String },
  imageCampaign1: { type: String },
  imageCampaign2: { type: String },
  content: { type: String },
  arrImage: [{ type: String }],
  infoUser: {
    id: { type: Number, required: true },
    name: { type: String },
    avtUser: { type: String },
  },
  id: { type: Number },
  perk: [
    {
      type: Object,
    },
  ],
  raisedAmount: { type: Number },
  clickCampaign: { type: Number },
  supporter: { type: Number },
});

// Tạo mô hình Project từ Schema đã định nghĩa
const Campaign = mongoose.model("Campaign", Campaigns);

module.exports = Campaign;
