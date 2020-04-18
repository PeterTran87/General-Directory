const express = require("express");
const { devCamper: Review } = require("../models/Review");
const {
  getReviews,
  getReview,
  addReview,
  updateReview,
  deleteReview,
} = require("../controllers/reviews");

const router = express.Router({ mergeParams: true });

const advancedResults = require("../middlewares/advancedResults");
const { protect, authorise } = require("../middlewares/auth");

router
  .route("/")
  .get(
    advancedResults(Review, { path: "bootcamp", select: "name description" }),
    getReviews
  )
  .post(protect, authorise("user", "admin"), addReview);

router
  .route("/:id")
  .get(getReview)
  .put(protect, authorise("user", "admin"), updateReview)
  .delete(protect, authorise("user", "admin"), deleteReview);

module.exports = router;
