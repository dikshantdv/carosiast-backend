const mongoose = require("mongoose");
const slugify = require("slugify");

const { priceAbbr } = require("../utils/priceAbbr");

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
    company: {
      type: String,
      required: [true, "A Car must have a company"],
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
    slug: String,
    minPrice: { type: Number, required: true, default: 0 },
    maxPrice: { type: Number, required: true, default: 0 },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

carSchema.virtual("abbrPrice").get(function () {
  return priceAbbr(this.price);
});

// Virtual populate
carSchema.virtual("variants", {
  ref: "Variant",
  foreignField: "car",
  localField: "_id",
});

// DOCUMENT MIDDLEWARE: runs before .save() and .create()
carSchema.pre("save", function (next) {
  this.slug = slugify(`${this.company} ${this.name}`, { lower: true });
  next();
});

// tourSchema.pre('save', async function(next) {
//   const guidesPromises = this.guides.map(async id => await User.findById(id));
//   this.guides = await Promise.all(guidesPromises);
//   next();
// });

// QUERY MIDDLEWARE
// tourSchema.pre('find', function(next) {
// tourSchema.pre(/^find/, function (next) {
//   this.find({ secretTour: { $ne: true } });

//   this.start = Date.now();
//   next();
// });

// carSchema.pre(/^find/, function (next) {
//   this.select("-__v");
//   next();
// });

// tourSchema.post(/^find/, function (docs, next) {
//   console.log(`Query took ${Date.now() - this.start} milliseconds!`);
//   next();
// });

// AGGREGATION MIDDLEWARE
// tourSchema.pre('aggregate', function(next) {
//   this.pipeline().unshift({ $match: { secretTour: { $ne: true } } });

//   console.log(this.pipeline());
//   next();
// });

const Car = mongoose.model("Car", carSchema);

module.exports = Car;
