const mongoose = require("mongoose");

//connect mongoose
const initDb = () => {
  const MONGO_URI =
    "mongodb+srv://tranthanhdao1311:tranthanhdao1311@cluster0.m8meqia.mongodb.net/?retryWrites=true&w=majority";
  mongoose
    .connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      dbName: "crowfunding",
    })
    .then((_) => console.log("Connected mongoose success!..."))
    .catch((err) => console.error(`Error: connect:::`, err));

  const db = mongoose.connection;
  db.once("open", function () {
    db.db
      .listCollections({ name: "mycollection" })
      .next(function (err, collinfo) {
        if (!collinfo) {
          db.createCollection("mycollection");
          console.log("Cơ sở dữ liệu đã được tạo!");
        }
      });
  });
};
module.exports = initDb;
