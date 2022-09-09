const Company = require("../models/companyModel");
const APIFeatures = require("../utils/apiFeatures");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");

exports.getAllCompanies = catchAsync(async (req, res, next) => {
  // To allow for nested GET reviews on tour (hack)

  let query = Company.find();
  // query = query.populate({
  // path: "showrooms",
  // select: "name price",
  // match: queryStr,
  // });
  const features = new APIFeatures(query, req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();
  let doc = await features.query;
  //   doc = doc.filter((car) => car.variants.length > 0);

  res.status(200).json({
    status: "success",
    results: doc.length,
    data: {
      data: doc,
    },
  });
});

exports.createCompany = catchAsync(async (req, res, next) => {
  const newCompany = await Company.create(req.body);

  res.status(201).json({
    status: "success",
    data: {
      data: newCompany,
    },
  });
});

exports.getOneCompany = catchAsync(async (req, res, next) => {
  const company = await Company.find({ slug: req.params.companyName }).populate(
    "cars"
  );
  //   .populate({
  //     path: "variants",
  //     select: "name price abbrPrice fuel -_id -__v -car",
  //   });

  if (!company) {
    return next(new AppError("No company found with that name", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      data: company,
    },
  });
});
