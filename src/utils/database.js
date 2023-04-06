const mongoose = require("mongoose");

module.exports = function mongoConnect(callback) {
  mongoose
    .connect(
      `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0.jjsj0ke.mongodb.net/?retryWrites=true&w=majority`
    )
    .then((client) => {
      console.info("Database Connected!");
      callback();
    })
    .catch((err) => {
      console.info("Database Connection Error!");
      console.error(err);
      throw err;
    });
};
