const mongoose = require("mongoose");
const slugify = require("slugify");

const showroomSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "A Showroom must have a name"],
      unique: true,
      trim: true,
      maxlength: [40, "A car name must have less or equal then 40 characters"],
      minlength: [1, "A car name must have more or equal then 1 characters"],
    },
    company: {
      type: mongoose.Schema.ObjectId,
      ref: "Company",
    },
    slug: String,
    location: {
      // GeoJSON
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

showroomSchema.pre("save", function (next) {
  this.slug = slugify(`${this.name}`, { lower: true });

  next();
});

const Showroom = mongoose.model("Showroom", showroomSchema);

module.exports = Showroom;
