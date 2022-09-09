const express = require("express");
const companyController = require("../controllers/companyController");
const showroomRouter = require("../routes/showroomRoute");
const carRouter = require("./carRoute");

const router = express.Router();
router.use("/:companyName/showrooms", showroomRouter);
router.use("/:companyName/cars", carRouter);

router
  .route("/")
  .get(companyController.getAllCompanies)
  .post(companyController.createCompany);
router.route("/:carName").get(companyController.getOneCompany);

module.exports = router;
