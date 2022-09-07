const express = require("express");
const morgan = require("morgan");
const carRouter = require("./routes/carRoute");
const variantRouter = require("./routes/variantRoute");

const AppError = require("./utils/appError");
const globalErrorHandler = require("./controllers/errorController");

const app = express();

app.use(morgan("dev"));

app.use(express.json({ limit: "10kb" }));

// // 3) ROUTES
app.use("/cars", carRouter);
app.use("/variants", variantRouter);
// app.use("/api/v1/users", userRouter);
// app.use("/api/v1/reviews", reviewRouter);

app.all("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
