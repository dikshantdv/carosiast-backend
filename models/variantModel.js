const mongoose = require("mongoose");
const Car = require("./carModel");
const slugify = require("slugify");

const { priceAbbr } = require("../utils/priceAbbr");

const variantSchema = new mongoose.Schema(
  {
    _id: { type: String },
    name: {
      type: String,
      required: [true, "A variant must have a name"],
      trim: true,
      maxlength: [
        40,
        "A variant name must have less or equal then 40 characters",
      ],
      minlength: [
        1,
        "A variant name must have more or equal then 1 characters",
      ],
    },
    car: {
      type: String,
      ref: "Car",
      required: [true, "Variant must belong to a car."],
    },
    price: {
      type: Number,
      required: [true, "A variant must have a price"],
    },
    mileage: {
      type: Number,
      required: [true, "A variant must have a mileage"],
    },
    fuel: {
      type: String,
      required: [true, "Fuel is required"],
    },
    transmission: {
      type: String,
      required: [true, "transmission is required"],
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

variantSchema.statics.calcMinMaxPrice = async function (carId) {
  const stats = await this.aggregate([
    {
      $match: { car: carId },
    },
    {
      $group: {
        _id: "$car",
        minPrice: { $min: "$price" },
        maxPrice: { $max: "$price" },
      },
    },
  ]);
  if (stats.length > 0) {
    await Car.findByIdAndUpdate(carId, {
      minPrice: stats[0].minPrice,
      maxPrice: stats[0].maxPrice,
    });
  } else {
    await Car.findByIdAndUpdate(userId, {
      minPrice: stats[0].minPrice,
      maxPrice: stats[0].maxPrice,
    });
  }
};

// tourSchema.index({ price: 1 });
// tourSchema.index({ price: 1, ratingsAverage: -1 });
// tourSchema.index({ slug: 1 });
// tourSchema.index({ startLocation: "2dsphere" });

variantSchema.virtual("abbrPrice").get(function () {
  return priceAbbr(this.price);
});

variantSchema.pre(/^find/, function (next) {
  this.select("-__v");
  next();
});

variantSchema.post("save", function () {
  this.constructor.calcMinMaxPrice(this.car);
});

// findByIdAndUpdate
// findByIdAndDelete
variantSchema.pre(/^findOneAnd/, async function (next) {
  this.r = await this.clone().findOne();
  next();
});

variantSchema.post(/^findOneAnd/, async function () {
  await this.r.constructor.calcTotalPrice(this.r.car);
});

const Variant = mongoose.model("Variant", variantSchema);

module.exports = Variant;
