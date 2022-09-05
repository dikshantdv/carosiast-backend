const express = require("express");
const morgan = require("morgan");

const app = express();

app.use(morgan("dev"));

app.use(express.json({ limit: "10kb" }));

// // 3) ROUTES
// app.use("/api/v1/tours", tourRouter);
// app.use("/api/v1/users", userRouter);
// app.use("/api/v1/reviews", reviewRouter);
app.get("/", (req, res) => {
  res.send("cd");
});

// app.all("*", (req, res, next) => {
//   next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
// });

module.exports = app;
