const path = require("path");
const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
const fileupload = require("express-fileupload");
const cookieParser = require("cookie-parser");
const errorHandler = require("./middlewares/error");
const connectDB = require("./config/db");
require("colors");

// Load env vars
dotenv.config({ path: "./config/config.env" });

// Connect DB
connectDB();

const app = express();

// Body parser
app.use(express.json());

// Cookie parser
app.use(cookieParser());

// Dev Logging Middleware
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// File upload
app.use(fileupload());

// Set static folder
app.use(express.static(path.join(__dirname, "public")));

// Import routes
const bootcampRouter = require("./routes/bootcamps");
const courseRouter = require("./routes/courses");
const authRouter = require("./routes/auth");

// Mount routers
app.use("/api/v1/bootcamps", bootcampRouter);
app.use("/api/v1/courses", courseRouter);
app.use("/api/v1/auth", authRouter);

// Handle all errors
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(
    `Server running in ${process.env.NODE_ENV} node on port ${PORT}`.yellow.bold
  );
});

// Handle unhandled promise ejections
process.on("unhandledRejection", (err, promise) => {
  console.log(`Error: ${err.message}`.red);
  // Close server & exit process
  server.close(() => {
    process.exit(1);
  });
});
