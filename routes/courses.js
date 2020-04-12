const express = require("express");
const router = express.Router({ mergeParams: true });
const { protect, authorise } = require("../middlewares/auth");

// Get All Controllers
const {
  getCourses,
  getCourse,
  addCourse,
  updateCourse,
  deleteCourse,
} = require("../controllers/courses");

const { devCamper: Course } = require("../models/Course");
const advancedResults = require("../middlewares/advancedResults");

router
  .route("/")
  .get(
    advancedResults(Course, { path: "bootcamp", select: "name description" }),
    getCourses
  )
  .post(protect, authorise("publisher", "admin"), addCourse);
router
  .route("/:id")
  .get(getCourse)
  .put(protect, authorise("publisher", "admin"), updateCourse)
  .delete(protect, authorise("publisher", "admin"), deleteCourse);

module.exports = router;
