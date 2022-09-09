const express = require("express");
const variantController = require("../controllers/variantController");

const router = express.Router({ mergeParams: true });

router
  .route("/")
  .post(variantController.setCarId, variantController.createVariant);
router
  .route("/:variantName")
  .get(variantController.setCarId, variantController.getOneVariant);

module.exports = router;
