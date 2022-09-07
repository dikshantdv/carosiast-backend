const Car = require("../models/carModel");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
const handlerFactory = require("./handlerFactory");

exports.getAllCars = handlerFactory.getAll(Car);

exports.createCar = catchAsync(async (req, res, next) => {
  const newCar = await Car.create(req.body);

  res.status(201).json({
    status: "success",
    data: {
      data: newCar,
    },
  });
});

exports.getOneCar = catchAsync(async (req, res, next) => {
  const car = await Car.find({ slug: req.params.carName }).populate({
    path: "variants",
    select: "name price abbrPrice fuel -_id -__v -car",
  });

  if (!car) {
    return next(new AppError("No car found with that name", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      data: car,
    },
  });
});
