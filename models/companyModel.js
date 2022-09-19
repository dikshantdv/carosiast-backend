const mongoose = require("mongoose");

const companySchema = new mongoose.Schema(
  {
    _id: { type: String },
    name: {
      type: String,
      required: [true, "A Company must have a name"],
      unique: true,
      trim: true,
      maxlength: [
        40,
        "A company name must have less or equal then 40 characters",
      ],
      minlength: [
        1,
        "A company name must have more or equal then 1 characters",
      ],
    },
    cars: {
      type: String,
      ref: "Car",
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

const Company = mongoose.model("Companys", companySchema);

module.exports = Company;
