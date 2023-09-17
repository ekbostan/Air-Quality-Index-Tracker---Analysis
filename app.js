const express = require("express");
const dotenv = require('dotenv');
const uvIndexRouter = require("./routes/uvIndexRouter");

dotenv.config({ path: './config.env' }); // Load environment variables

const app = express();
app.use(express.json());

app.use("/api/uvindex", uvIndexRouter);

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

module.exports = app;
