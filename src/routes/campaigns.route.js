const express = require("express");

const router = express.Router();
// const paypal = require("@paypal/checkout-server-sdk");

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

// Tạo client PayPal

// const environment = new paypal.core.SandboxEnvironment(
//   "AbsuQWHyF68P2xTioYiXREERj3yxrJzg-9hTUjurNg7ljdN1EB2vklR3T16q9sGAx1O8cLVn8H7GNDgB",
//   "EL-La7f57w2r1jYBOsigwXLsx-620Bb1g8bbZbFm7Y3Iw21MZdpptz-gN3rgJWhSkV2NqUf-dXc8ZpiJ"
// );
// const client = new paypal.core.PayPalHttpClient(environment);

// // Route để tạo phiên thanh toán trên backend
// router.post("/create-payment", async (req, res) => {
//   const { goal, currency, price } = req.body;

//   try {
//     const request = new paypal.orders.OrdersCreateRequest();
//     request.prefer("return=representation");
//     request.requestBody({
//       intent: "CAPTURE",
//       purchase_units: [
//         {
//           amount: {
//             currency_code: currency,
//             value: goal,
//           },
//         },
//       ],
//     });

//     const response = await client.execute(request);
//     const orderID = response.result.id;

//     res.status(200).json({ orderID: orderID });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: "Server Error" });
//   }
// });

// // Route để lấy thông tin chi tiết đơn hàng dựa trên Order ID
// router.get("/order/:orderId", async (req, res) => {
//   const { orderId } = req.params;

//   try {
//     // Gọi hàm xử lý để lấy thông tin chi tiết đơn hàng dựa trên Order ID
//     const orderDetails = await getOrderDetails(orderId);

//     // Trả về thông tin chi tiết đơn hàng cho client
//     res.json(orderDetails);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: "Server Error" });
//   }
// });

// // Hàm xử lý lấy thông tin chi tiết đơn hàng dựa trên Order ID từ PayPal
// async function getOrderDetails(orderId) {
//   const request = new paypal.orders.OrdersGetRequest(orderId);
//   const response = await paypalClient.execute(request);
//   return response.result;
// }
module.exports = router;
