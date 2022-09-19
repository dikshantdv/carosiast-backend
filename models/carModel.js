const mongoose = require("mongoose");
const slugify = require("slugify");
const Company = require("./companyModel");

const carSchema = new mongoose.Schema(
  {
    _id: { type: String },
    name: {
      type: String,
      required: [true, "A Car must have a name"],
      unique: true,
      trim: true,
      maxlength: [40, "A car name must have less or equal then 40 characters"],
      minlength: [1, "A car name must have more or equal then 1 characters"],
    },
    company: {
      type: String,
      ref: "Company",
      required: [true, "A car must have a company"],
    },
    minPrice: { type: Number, required: true, default: 0 },
    maxPrice: { type: Number, required: true, default: 0 },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual populate
carSchema.virtual("variants", {
  ref: "Variant",
  foreignField: "car",
  localField: "_id",
});

// DOCUMENT MIDDLEWARE: runs before .save() and .create()

carSchema.pre(/^find/, function (next) {
  this.select("-__v");
  next();
});

carSchema.statics.addToCompany = async function (company, carId) {
  await Company.findByIdAndUpdate(company, {
    $push: { cars: carId },
  });
};

carSchema.post("save", function () {
  this.constructor.addToCompany(this.company, this._id);
});

const Car = mongoose.model("Car", carSchema);

module.exports = Car;
