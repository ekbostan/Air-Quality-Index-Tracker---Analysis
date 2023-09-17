const express = require("express");
const uvIndexRouter = require("./routes/uvIndexRouter");
const aqiRouter = require("./routes/aqiRouter");

const app = express();
app.use(express.json());

// Use uvIndexRouter for all routes that start with '/api/uvindex'
app.use("/api/uvindex", uvIndexRouter);


module.exports = app;
