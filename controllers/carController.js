const slugify = require("slugify");
const Car = require("../models/carModel");
const Company = require("../models/companyModel");
const APIFeatures = require("../utils/apiFeatures");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");

exports.getAllCars = catchAsync(async (req, res, next) => {
  filter = {};
  if (req.query.companyId) filter = { company: req.query.companyId };
  let query = Car.find(filter);
  let variantFilter = {};
  const excludedFields = ["price", "mileage", "transmission", "fuel"];
  excludedFields.forEach((el) => {
    if (req.query[el]) {
      variantFilter[el] = req.query[el];
      delete req.query[el];
    }
  });
  // 1B) Advanced filtering
  let queryStr = JSON.stringify(variantFilter);
  queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
  queryStr = JSON.parse(queryStr);
  query = query.populate({
    path: "variants",
    select: "name price",
    match: queryStr,
  });
  const features = new APIFeatures(query, req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();
  let doc = await features.query;
  // doc = doc.filter((car) => car.variants.length > 0);

  res.status(200).json({
    status: "success",
    results: doc.length,
    cars: doc,
  });
});

exports.createCar = catchAsync(async (req, res, next) => {
  const newCar = await Car.create({
    ...req.body,
    company: req.params.companyId,
    _id: slugify(`${req.params.companyId} ${req.body.name}`, { lower: true }),
  });

  res.status(201).json({
    status: "success",
    data: {
      data: newCar,
    },
  });
});

exports.getOneCar = catchAsync(async (req, res, next) => {
  const car = await Car.findById(req.params.carId).populate({
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
