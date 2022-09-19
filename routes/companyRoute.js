const express = require("express");
const companyController = require("../controllers/companyController");
const showroomRouter = require("../routes/showroomRoute");
const carRouter = require("./carRoute");

const router = express.Router();
router.use("/:companyId/showrooms", showroomRouter);
router.use("/:companyId/cars", carRouter);

router
  .route("/")
  .get(companyController.getAllCompanies)
  .post(companyController.createCompany);
router.route("/:companyName").get(companyController.getOneCompany);

module.exports = router;
