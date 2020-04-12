const connectDB_DEV = require("./databases/devCamper");

const connectDB = () => {
  connectDB_DEV();
};

module.exports = connectDB;
