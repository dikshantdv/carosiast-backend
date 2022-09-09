const Showroom = require("../models/showroomModel");
const Company = require("../models/companyModel");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
const APIFeatures = require("../utils/apiFeatures");

exports.setCompanyId = catchAsync(async (req, res, next) => {
  if (req.params.companyName) {
    const company = await Company.findOne({
      slug: req.params.companyName,
    }).select("-__v");
    // Allow nested routes
    if (!req.body.company) {
      req.query.company = company._id;
      req.body.fullCompany = company;
    }
  }
  next();
});

exports.getAllShowrooms = catchAsync(async (req, res, next) => {
  let query = Showroom.find({ company: req.query.company });
  const features = new APIFeatures(query, req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();
  const doc = await features.query;
  res.status(200).json({
    status: "success",
    results: doc.length,
    data: {
      showrooms: doc,
      company: req.body.fullCompany,
    },
  });
});

exports.createShowroom = catchAsync(async (req, res, next) => {
  body = { ...req.body };
  if (req.query.company) body = { ...req.body, Company: req.query.company };
  const newShowroom = await Showroom.create(body);

  res.status(201).json({
    status: "success",
    data: {
      newShowroom,
    },
  });
});

exports.getOneShowroom = catchAsync(async (req, res, next) => {
  const showroom = await Showroom.findOne({
    slug: req.params.companyName,
    company: req.query.company,
  });

  if (!showroom) {
    return next(new AppError("No showroom found with that name", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      showroom,
      car: req.body.fullCompany,
    },
  });
});

exports.getShowroomsWithin = catchAsync(async (req, res, next) => {
  const { distance, latlng } = req.params;
  const [lat, lng] = latlng.split(",");
  const radius = distance / 6378.1;
  if (!lat || !lng) {
    next(
      new AppError(
        "Please provide latitute and longitude in the format lat,lng.",
        400
      )
    );
  }
  const Showrooms = await Showroom.find({
    company: req.query.company,
    location: { $geoWithin: { $centerSphere: [[lng, lat], radius] } },
  });
  res.status(200).json({
    status: "success",
    results: Showrooms.length,
    data: {
      data: Showrooms,
    },
  });
});
