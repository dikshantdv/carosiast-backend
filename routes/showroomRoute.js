const express = require("express");
const showroomController = require("../controllers/showroomController");

const router = express.Router({ mergeParams: true });

router
  .route("/")
  .get(showroomController.getAllShowrooms)
  .post(showroomController.createShowroom);
router.route("/:showroomId").get(showroomController.getOneShowroom);
router
  .route("/within/:distance/center/:latlng")
  .get(showroomController.getShowroomsWithin);

module.exports = router;
