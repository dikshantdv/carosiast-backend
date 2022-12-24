const slugify = require("slugify");
const Car = require("../models/carModel");
const Company = require("../models/companyModel");
const Search = require("../models/searchModel");
const APIFeatures = require("../utils/apiFeatures");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");

exports.getAllCars = catchAsync(async (req, res, next) => {
  let query = Car.find(req.query);
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
    // select: "name price fuel transmission",
    match: queryStr,
  });
  const features = new APIFeatures(query, req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();
  let doc = await features.query;
  doc = doc.filter((car) => car.variants.length > 0);
  if (doc.length === 0) {
    return next(new AppError("No cars found", 404));
  }
  res.status(200).json({
    status: "success",
    results: doc.length,
    cars: doc,
  });
});

exports.createCar = catchAsync(async (req, res, next) => {
  if (req.params.companyId) {
    req.body.company = req.params.companyId;
  }
  const newCar = await Car.create({
    ...req.body,
    _id: slugify(`${req.body.company} ${req.body.name}`, { lower: true }),
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
    select: "name price abbrPrice fuel transmission -_id -__v -car",
  });

  if (!car) {
    return next(new AppError("No car found with that name", 404));
  }
  await Search.create({ name: req.params.carId });

  const search = await Search.aggregate([
    {
      $group: {
        _id: "$name",
        totalSearches: { $sum: 1 },
      },
    },
    { $sort: { totalSearches: -1 } },
    { $limit: 5 },
  ]);
  console.log(search);
  res.status(200).json({
    status: "success",
    data: {
      data: car,
    },
  });
});
