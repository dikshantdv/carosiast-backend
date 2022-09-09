const mongoose = require("mongoose");
const slugify = require("slugify");

const companySchema = new mongoose.Schema(
  {
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
      type: mongoose.Schema.ObjectId,
      ref: "Car",
    },
    slug: String,
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

companySchema.pre("save", function (next) {
  this.slug = slugify(`${this.name}`, { lower: true });
  next();
});

// companySchema.virtual("showrooms", {
//   ref: "Showroom",
//   foreignField: "company",
//   localField: "_id",
// });

const Company = mongoose.model("Companys", companySchema);

module.exports = Company;
