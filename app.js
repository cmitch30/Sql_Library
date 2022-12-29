var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var indexRouter = require("./routes/index");
const sequelize = require("./models/index").sequelize;
const bookRouter = require('./routes/books')

var app = express();

sequelize.authenticate().then(() => {
    console.log("Connection has been established successfully.");
  })
  .catch((err) => {
    console.log("Error connecting:", err);
  });

sequelize.sync();
// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/books", bookRouter);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  const err = new Error("Not Found");
  err.status = 404;
  next(err);
});

// error handler
app.use((err, req, res, next) => {
  if (err) {
    console.log("Global error handler called", err);
  }
  if (err.status === 404) {
    res.status(404).render("page-not-found", { err });
  } else {
    err.status = res.statusCode === 200 ? 500 : res.statusCode;
    res.status(err.status).render("error", { err });
  }
});

module.exports = app;
