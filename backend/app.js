const express = require("express");
const logger = require("morgan");
const createError = require("http-errors");
require("dotenv").config();
const mongoose = require("mongoose");
const dbConfig = require("./DB/mongodb.json");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const cxpFormRouter = require("./routes/cxpFormR");
const orderRouter = require("./routes/orderR");
const productRouter = require("./routes/productR");
const userRouter = require("./routes/userR");
const basketRouter = require("./routes/basketR")
const wasteFormRouter = require("./routes/wasteFormR");
const questionRouter = require("./routes/questionsR");
const appointmentRouter = require("./routes/appointmentR");
const app = express();
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  next();
});
app.use(logger("dev"));
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

app.use('/cxpForm', cxpFormRouter);
//app.use('/order', orderRouter);
app.use("/product", productRouter);
app.use("/user", userRouter);
app.use("/basket", basketRouter);
app.use("/order", orderRouter);
app.use('/wasteForm', wasteFormRouter);
app.use("/questions", questionRouter);
app.use("/appointments", appointmentRouter);
app.use((req, res, next) => {
  next(createError(404));
});

mongoose.set("strictQuery", true);
mongoose.connect(dbConfig.mongo.uri);

module.exports = app;
