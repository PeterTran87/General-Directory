// @desc			Logs Request to Console
const logger = (req, res, next) => {
  console.log(
    `${req.method} ${req.protocol}: //${req.get("host")}${req.originalUrl}`
  );
  next();
};

module.exports = logger;
