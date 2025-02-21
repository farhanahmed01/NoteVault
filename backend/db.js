const mongoose = require("mongoose");
const mongoURI = "mongodb://localhost:27017/smartnotebook";
const connectToMongo = async () => {
  mongoose.set("strictQuery", false);
  await mongoose.connect(mongoURI, () => {
    console.log("Connected to Mongo Successfully");
  });
};
module.exports = connectToMongo;
