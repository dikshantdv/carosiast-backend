const Showroom = require("../models/showroomModel");
const Company = require("../models/companyModel");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
const slugify = require("slugify");

exports.getAllShowrooms = catchAsync(async (req, res, next) => {
  const showrooms = await Showroom.find({ company: req.params.companyId });
  if (showrooms.length === 0) {
    const company = Company.findById(req.params.companyId);
    if (!company) {
      return next(new AppError("No company found with that name", 404));
    } else {
      return next(new AppError("No showroom found for this company", 404));
    }
  }
  res.status(200).json({
    status: "success",
    results: showrooms.length,
    showrooms,
  });
});

exports.createShowroom = catchAsync(async (req, res, next) => {
  body = {
    ...req.body,
    company: req.params.companyId,
    _id: slugify(`${req.params.companyId} ${req.body.name}`, { lower: true }),
  };
  const newShowroom = await Showroom.create(body);

  res.status(201).json({
    status: "success",
    data: {
      newShowroom,
    },
  });
});

exports.getOneShowroom = catchAsync(async (req, res, next) => {
  const showroom = await Showroom.findById(req.params.showroomId);

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
  const { distance, latlng, companyId } = req.params;
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
  const showrooms = await Showroom.find({
    company: companyId,
    location: { $geoWithin: { $centerSphere: [[lng, lat], radius] } },
  });

  if (!showrooms) {
    return next(new AppError(`No showroom found within ${distance} KMs`, 404));
  }

  res.status(200).json({
    status: "success",
    results: showrooms.length,
    showrooms,
  });
});
