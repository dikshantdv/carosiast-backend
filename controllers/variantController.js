const Variant = require("../models/variantModel");
const Car = require("../models/carModel");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
const APIFeatures = require("../utils/apiFeatures");

exports.setCarId = catchAsync(async (req, res, next) => {
  if (req.params.carName) {
    const car = await Car.findOne({ slug: req.params.carName }).select("-__v");
    // Allow nested routes
    if (!req.body.car) {
      req.query.car = car._id;
      req.body.fullCar = car;
    }
  }
  next();
});

exports.createVariant = catchAsync(async (req, res, next) => {
  body = { ...req.body, car: req.query.car };
  const newCar = await Variant.create(body);

  res.status(201).json({
    status: "success",
    data: {
      data: newCar,
    },
  });
});

exports.getOneVariant = catchAsync(async (req, res, next) => {
  const variant = await Variant.findOne({
    slug: req.params.variantName,
    car: req.query.car,
  });

  if (!variant) {
    return next(new AppError("No variant found with that name", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      variant,
      car: req.body.fullCar,
    },
  });
});
