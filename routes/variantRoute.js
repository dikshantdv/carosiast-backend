const express = require("express");
const variantController = require("../controllers/variantController");

const router = express.Router({ mergeParams: true });

router
  .route("/")
  .get(variantController.getAllVariant)
  .post(variantController.createVariant);
router.route("/:variantId").get(variantController.getOneVariant);

module.exports = router;
