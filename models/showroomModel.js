const mongoose = require("mongoose");

const showroomSchema = new mongoose.Schema(
  {
    _id: { type: String },
    name: {
      type: String,
      required: [true, "A Showroom must have a name"],
      unique: true,
      trim: true,
      maxlength: [40, "A car name must have less or equal then 40 characters"],
      minlength: [1, "A car name must have more or equal then 1 characters"],
    },
    company: {
      type: String,
      ref: "Company",
    },
    location: {
      type: {
        type: String,
        default: "Point",
        enum: ["Point"],
      },
      coordinates: [Number],
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

const Showroom = mongoose.model("Showroom", showroomSchema);

module.exports = Showroom;
