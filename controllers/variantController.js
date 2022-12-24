const Variant = require("../models/variantModel");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
const APIFeatures = require("../utils/apiFeatures");
const slugify = require("slugify");

exports.getAllVariant = catchAsync(async (req, res, next) => {
  filter = {};
  if (req.query.carId) filter = { car: req.query.carId };
  let query = Variant.find(filter);

  // 1B) Advanced filtering
  const features = new APIFeatures(query, req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();
  let doc = await features.query;

  res.status(200).json({
    status: "success",
    results: doc.length,
    variants: doc,
  });
});

exports.createVariant = catchAsync(async (req, res, next) => {
  body = {
    ...req.body,
    car: req.params.carId,
    _id: slugify(
      `${req.params.carId} ${req.body.name} ${req.body.fuel} ${req.body.transmission}`,
      {
        lower: true,
      }
    ),
  };
  const newCar = await Variant.create(body);

  res.status(201).json({
    status: "success",
    data: {
      data: newCar,
    },
  });
});

exports.getOneVariant = catchAsync(async (req, res, next) => {
  const variant = await Variant.findById(req.params.variantId);

  if (!variant) {
    return next(new AppError("No variant found with that name", 404));
  }

  res.status(200).json({
    status: "success",
    variant,
  });
});
