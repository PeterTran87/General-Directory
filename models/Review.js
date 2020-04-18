const mongoose = require("mongoose");

// Acquire database connections and respective models
const databases = mongoose.connections.values();
const Models = {};

const ReviewSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      trim: true,
      required: [true, "Please add a course title"],
      maxLength: 100,
    },
    text: {
      type: String,
      required: [true, "Please add a text"],
    },
    rating: {
      type: Number,
      min: 1,
      max: 10,
      required: [true, "Please add a rating between 1 and 10"],
    },
    bootcamp: {
      type: mongoose.Schema.ObjectId,
      ref: "Bootcamp",
      required: true,
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: true,
    },
  },

  { timestamps: true }
);

// Prevent user from submitting more than 1 review per bootcamp
ReviewSchema.index({ bootcamp: 1, user: 1 }, { unique: true });

// Static method to get avg rating and save
ReviewSchema.statics.getAverageRating = async function (bootcampId) {
  const obj = await this.aggregate([
    {
      $match: { bootcamp: bootcampId },
    },
    {
      $group: {
        _id: "$bootcamp",
        averageRating: {
          $avg: "$rating",
        },
      },
    },
  ]);

  try {
    await this.model("Bootcamp").findByIdAndUpdate(bootcampId, {
      averageRating: obj[0].averageRating,
    });
  } catch (err) {
    console.error(err);
  }
};

// Call getAverageCost after save
ReviewSchema.post("save", function () {
  this.constructor.getAverageRating(this.bootcamp);
});

// Call getAverageCost after save
ReviewSchema.pre("remove", function () {
  this.constructor.getAverageRating(this.bootcamp);
});

for (const database of databases) {
  if (database.name === "devCamper")
    Models[`${database.name}`] = database.model("Review", ReviewSchema);
}

module.exports = Models;
