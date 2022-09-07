const mongoose = require("mongoose");

exports.Connection = async () => {
  try {
    await mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true });
    console.log("Database connection successful");
  } catch (err) {
    console.log(err.message);
  }
};
