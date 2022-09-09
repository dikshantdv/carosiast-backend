const express = require("express");
const carController = require("../controllers/carController");
const variantRouter = require("../routes/variantRoute");

const router = express.Router({ mergeParams: true });
router.use("/:carName/variants", variantRouter);

router
  .route("/")
  .get(carController.setCompanyId, carController.getAllCars)
  .post(carController.setCompanyId, carController.createCar);
router
  .route("/:carName")
  .get(carController.setCompanyId, carController.getOneCar);

module.exports = router;
