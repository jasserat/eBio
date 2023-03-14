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
const WasteFormRouter = require("./routes/WasteFormR");

const app = express();
app.use(
  cors({
    origin: "*",
  })
);
app.use(logger("dev"));
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));

//app.use('/cxpForm', cxpFormRouter);
//app.use('/order', orderRouter);
//app.use('/product', productRouter);
app.use("/user", userRouter);
//app.use('/wasteForm', WasteFormRouter);

app.use((req, res, next) => {
  next(createError(404));
});

mongoose.set("strictQuery", true);
mongoose.connect(dbConfig.mongo.uri);

module.exports = app;
