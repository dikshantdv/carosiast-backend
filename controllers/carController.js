const Car = require("../models/carModel");
const Company = require("../models/companyModel");
const APIFeatures = require("../utils/apiFeatures");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");

exports.setCompanyId = catchAsync(async (req, res, next) => {
  if (req.params.companyName) {
    const company = await Company.findOne({
      slug: req.params.companyName,
    }).select("-__v");
    if (!company) {
      return next(new AppError("No company found with that name", 404));
    }

    if (!req.body.companyName) {
      // Allow nested routes
      req.query.companyName = company._id;
      req.body.fullCompany = company;
    }
  }
  next();
});

exports.getAllCars = catchAsync(async (req, res, next) => {
  filter = {};
  if (req.query.companyName) filter = { companyName: req.query.companyName };
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
  console.log(queryStr);
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
    data: {
      data: doc,
    },
  });
});

exports.createCar = catchAsync(async (req, res, next) => {
  const newCar = await Car.create({
    ...req.body,
    companyName: req.query.companyName,
  });

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
