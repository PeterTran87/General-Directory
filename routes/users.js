const express = require("express");
const { devCamper: User } = require("../models/User");
const {
  getUser,
  getUsers,
  createUser,
  updateUser,
  deleteUser,
} = require("../controllers/users");

const router = express.Router();

const advancedResults = require("../middlewares/advancedResults");
const { protect, authorise } = require("../middlewares/auth");

router.use(protect);
router.use(authorise("admin"));

router.route("/").get(advancedResults(User), getUsers).post(createUser);

router.route("/:id").get(getUser).put(updateUser).delete(deleteUser);

module.exports = router;
