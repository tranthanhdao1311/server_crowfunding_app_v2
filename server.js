require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");

app.use(express.json());
app.use(cors());

const initRouter = require("./src/routes/index");
initRouter(app);
const initDb = require("./src/database/init.db");
initDb();

const Users = require("./src/database/user.model");
const Campaigns = require("./src/database/campaigns.model");
// Error Handling Middleware called
app.use((req, res, next) => {
  const error = new Error("Not found");
  error.status = 404;
  next(error);
});

// error handler middleware
app.use((error, req, res, next) => {
  res.status(error.status || 500).send({
    error: {
      status: error.status || 500,
      message: error.message || "Internal Server Error",
    },
  });
});

app.listen(4001, () => console.log("Server started on port 4001"));
