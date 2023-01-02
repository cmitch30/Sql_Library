var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var indexRouter = require("./routes/index");
const sequelize = require("./models/index").sequelize
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
  const err = new Error();
  err.statusCode = 404;
  err.message = "Hmm... that page doesn't seem to exist :/";
  res.render("page-not-found", { title: "Page Not Found", err });
});

// error handler
app.use((err, req, res, next) => {
  err.status = err.status ? err.status : 500;
  err.message = err.message
    ? err.message
    : "Sorry! There was an unexpected error on the server.";

  console.log(err.status, err.message);

  res.status(err.status);
  res.render("error", { title: "Page Not Found", err });
});

module.exports = app;
