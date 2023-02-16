const mongoose = require("mongoose");

mongoose.set("strictQuery", false);

const connect = async () => {
  return mongoose.connect(
    "mongodb+srv://salemes:salemes@cluster0.8hhyd86.mongodb.net/91mobiles?retryWrites=true&w=majority"
  );
};
module.exports = connect;
