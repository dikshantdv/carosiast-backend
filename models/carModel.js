const mongoose = require("mongoose");
const slugify = require("slugify");
const Company = require("./companyModel");

const carSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "A Car must have a name"],
      unique: true,
      trim: true,
      maxlength: [40, "A car name must have less or equal then 40 characters"],
      minlength: [1, "A car name must have more or equal then 1 characters"],
    },
    companyName: {
      type: mongoose.Schema.ObjectId,
      ref: "Company",
    },
    slug: String,
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
carSchema.pre("save", function (next) {
  this.slug = slugify(`${this.companyName} ${this.name}`, { lower: true });
  next();
});

carSchema.pre(/^find/, function (next) {
  this.select("-__v");
  next();
});

carSchema.statics.addToCompany = async function (companyName, carId) {
  const company = await Company.findOne({
    slug: slugify(companyName, { lower: true }),
  });
  await Company.findByIdAndUpdate(company._id, {
    $push: { cars: carId },
  });
};

carSchema.post("save", function () {
  this.constructor.addToCompany(this.companyName, this._id);
});

const Car = mongoose.model("Car", carSchema);

module.exports = Car;
