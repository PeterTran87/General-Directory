const mongoose = require("mongoose");

const connectDev = () => {
  const conn = mongoose.createConnection(process.env.MONGO_URI_DEVCAMPER, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  });

  conn.name = "devCamper";

  conn
    .on("connected", () => {
      console.log(
        `MongoDB for DevCamper Connected: ${conn.host}`.cyan.underline.bold
      );
    })
    .on("error", (err) => {
      console.error(err);
    });

  return conn;
};

module.exports = connectDev;
