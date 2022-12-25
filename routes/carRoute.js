const express = require("express");
const carController = require("../controllers/carController");
const variantRouter = require("../routes/variantRoute");

const router = express.Router({ mergeParams: true });
router.use("/:carId/variants", variantRouter);

router.route("/").get(carController.getAllCars).post(carController.createCar);
router.route("/getLatest").get(carController.getLatestCars);
router.route("/getSearchResult/:keyword").get(carController.getSearchResults);
router.route("/getTrending").get(carController.getTrendingCars);
router.route("/:carId").get(carController.getOneCar);

module.exports = router;
