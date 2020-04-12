const mongoose = require("mongoose");

// Acquire database connections and respective models
const databases = mongoose.connections.values();
const Models = {};

const CourseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      trim: true,
      required: [true, "Please add a course title"],
    },
    description: {
      type: String,
      required: [true, "Please add a description"],
    },
    weeks: {
      type: String,
      required: [true, "Please add number of weeks"],
    },
    tuition: {
      type: Number,
      required: [true, "Please add a tuition cost"],
    },
    minimumSkill: {
      type: String,
      required: [true, "Please add a minimum skill"],
      enum: ["beginner", "intermediate", "advanced"],
    },
    scholarshipAvailable: {
      type: Boolean,
      default: false,
    },
    bootcamp: {
      type: mongoose.Schema.ObjectId,
      ref: "Bootcamp",
      required: true,
    },
  },

  { timestamps: true }
);

// Static method to get avg of course tuition
CourseSchema.statics.getAverageCost = async function (bootcampId) {
  const obj = await this.aggregate([
    {
      $match: { bootcamp: bootcampId },
    },
    {
      $group: {
        _id: "$bootcamp",
        averageCost: {
          $avg: "$tuition",
        },
      },
    },
  ]);

  try {
    await this.model("Bootcamp").findByIdAndUpdate(bootcampId, {
      averageCost: Math.ceil(obj[0].averageCost / 10) * 10,
    });
  } catch (err) {
    console.error(err);
  }
};

// Call getAverageCost after save
CourseSchema.post("save", function () {
  this.constructor.getAverageCost(this.bootcamp);
});

// Call getAverageCost after save
CourseSchema.pre("remove", function () {
  this.constructor.getAverageCost(this.bootcamp);
});

for (const database of databases) {
  if (database.name === "devCamper")
    Models[`${database.name}`] = database.model("Course", CourseSchema);
}

module.exports = Models;
