const slugify = require("slugify");
const Company = require("../models/companyModel");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");

exports.getAllCompanies = catchAsync(async (req, res, next) => {
  let companies = await Company.find();
  if (!companies) {
    return next(new AppError("No companies found", 404));
  }
  res.status(200).json({
    status: "success",
    results: companies.length,
    data: {
      data: companies,
    },
  });
});

exports.createCompany = catchAsync(async (req, res, next) => {
  const newCompany = await Company.create({
    ...req.body,
    _id: slugify(req.body.name, { lower: true }),
  });

  res.status(201).json({
    status: "success",
    data: {
      data: newCompany,
    },
  });
});

exports.getOneCompany = catchAsync(async (req, res, next) => {
  const company = await Company.findById(req.params.companyName).populate(
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
