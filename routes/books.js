const express = require("express");
const router = express.Router();
const Book = require("../models").Book;


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

//book home page
router.get('/', asyncHandler(async (req, res) => {
 const books = await Book.findAll({ order: [["createdAt", "DESC"]] });
 res.render('index', {books, title: 'Library Books'})
}))

//new book form
router.get('/new', asyncHandler(async(req, res) => {
    res.render('new-book')
}))


//add new book
router.post('/new', asyncHandler(async(req, res) => {
    let book;
    try {
        book = await Book.create(req.body)
        res.redirect('/')
    } catch (error) {
        if (error.name === "SequelizeValidationError") {
            book = await Book.build(req.body)
            res.render('new-book', {book, error:error.errors, title:'New Book'})
        }else {
            throw error
        }
    }
}))

//get book by id
router.get('/:id', asyncHandler(async(req, res) => {
    const book = await Book.findByPk(req.params.id)
    if (book) {
        res.render('update-book', {book, title:book.title})
    } else {
        res.sendStatus(404)
    }
}))


//update book info
router.post('/:id', asyncHandler(async(req, res) => {
        let book;
   try {
     book = await Book.findByPk(req.params.id);
     if (book) {
       await book.update(req.body);
       res.redirect('/');
     } else {
       res.sendStatus(404);
     }
   } catch (error) {
     if (error.name === "SequelizeValidationError") {
       book = await Book.build(req.body);
       book.id = req.params.id;
       res.render("update-book", {
         book,
         error: error.errors,
       });
     } else {
       throw error;
     }
   }
}))

router.post(
  "/books/:id/delete",
  asyncHandler(async (req, res) => {
    const book = await Book.findByPk(req.params.id);
    if (book) {
      await book.destroy();
      res.redirect("/");
    } else {
      res.sendStatus(404);
    }
  })
);

module.exports = router