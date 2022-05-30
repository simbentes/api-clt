const express = require("express");
const path = require("path");
require("dotenv").config();

const indexRouter = require("./routes/index");
const memoriaRouter = require("./routes/memoria");

const port = process.env.PORT || 3000;

const app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/", indexRouter);
app.use("/memoria", memoriaRouter);

app.listen(port, () => console.log(`Example app listening on port ${port}!`));

module.exports = app;
