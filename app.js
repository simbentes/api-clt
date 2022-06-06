const express = require("express");
const path = require("path");
require("dotenv").config();
const authMiddleware = require("./middlewares/authMiddleware");
const { error } = require("./utils/apiResponse");

const indexRouter = require("./routes/index");
const memoriaRouter = require("./routes/memoria");
const articleRouter = require("./routes/article");

const port = process.env.PORT || 3000;
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(authMiddleware);

app.use("/", indexRouter);
app.use("/memoria", memoriaRouter);
app.use("/article", articleRouter);

app.use((err, req, res, next) => {
  if (err && !res.headersSent) {
    res.status(err.statusCode || 500).send(error(err.message, err.statusCode || 500, err.errors));
  }
  next();
});

app.listen(port, () => console.log(`App listening on port ${port}!`));

module.exports = app;
