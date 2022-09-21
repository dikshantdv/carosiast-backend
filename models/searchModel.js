const mongoose = require("mongoose");

const searchSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true }
);

searchSchema.index({ createdAt: 1 }, { expireAfterSeconds: 86400 });

const Search = mongoose.model("Search", searchSchema);

module.exports = Search;
