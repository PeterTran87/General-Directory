const express = require("express");
const router = express.Router({ mergeParams: true });
const { devCamper: Bootcamp } = require("../models/Bootcamp");

// Get All Controllers
const {
  getBootcamp,
  getBootcamps,
  createBootcamp,
  updateBootcamp,
  deleteBootcamp,
  getBootcampsInRadius,
  bootcampPhotoUpload,
} = require("../controllers/bootcamps");

const advancedResults = require("../middlewares/advancedResults");
const { protect, authorise } = require("../middlewares/auth");

// Include other resource routers
const courseRouter = require("./courses");
const reviewRouter = require("./reviews");

// Re-route into other resource routers
router.use("/:bootcampId/courses", courseRouter);
router.use("/:bootcampId/reviews", reviewRouter);

// Routes
router.route("/radius/:zipcode/:distance").get(getBootcampsInRadius);

router
  .route("/:id/photo")
  .put(protect, authorise("publisher", "admin"), bootcampPhotoUpload);

router
  .route("/")
  .get(advancedResults(Bootcamp, "courses"), getBootcamps)
  .post(protect, authorise("publisher", "admin"), createBootcamp);

router
  .route("/:id")
  .get(getBootcamp)
  .put(protect, authorise("publisher", "admin"), updateBootcamp)
  .delete(protect, authorise("publisher", "admin"), deleteBootcamp);

module.exports = router;
