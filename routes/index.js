var express = require('express');
var router = express.Router();
const Book = require('../models').Book


function asyncHandler(cb) {
  return async (req, res, next) => {
    try {
      await cb(req, res, next);
    } catch (error) {
      // Forward error to the global error handler
      next(error);
    }
  };
}


/* GET home page. */
router.get('/', (async(req, res, next) => {
const book = Book.findAll().then(res => res.json())

}));
module.exports = router;
