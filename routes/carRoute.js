const express = require("express");
const carController = require("../controllers/carController");
const variantRouter = require("../routes/variantRoute");

const router = express.Router();
router.use("/:carName/variants", variantRouter);

router.route("/").get(carController.getAllCars).post(carController.createCar);
router.route("/:carName").get(carController.getOneCar);

module.exports = router;
