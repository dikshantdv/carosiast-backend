const express = require("express");
const showroomController = require("../controllers/showroomController");
const variantRouter = require("../routes/variantRoute");

const router = express.Router({ mergeParams: true });
router.use("/:carName/variants", variantRouter);

router
  .route("/")
  .get(showroomController.getAllShowrooms)
  .post(showroomController.setCompanyId, showroomController.createShowroom);

router
  .route("/within/:distance/center/:latlng")
  .get(showroomController.setCompanyId, showroomController.getShowroomsWithin);

module.exports = router;
