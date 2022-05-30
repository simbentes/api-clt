const express = require("express");
const path = require("path");
require("dotenv").config();

const indexRouter = require("./routes/index");
const usersRouter = require("./routes/users");

const port = process.env.PORT || 3000;

const app = express();

app.get("/", (req, res) => {
  res.send("Hello World!");
});

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/", indexRouter);
app.use("/users", usersRouter);

app.listen(port, () => console.log(`Example app listening on port ${port}!`));

module.exports = app;
