const express = require('express');
const router = express.Router({mergeParams: true});
const { dbBook}= require('../dbUtils/book');

router.post('/', (req, res) => {
   dbBook.addBook(req, res)
   .then(book => {
      res.status(200).json(book)
   })
   .catch(err => {
      res.status(500).json(err)
   })
})

router.post('/allUserBooks', (req, res) => {
   dbBook.getAllUserBooks(req.body.userId)
   .then((books) => res.json(books))
   .catch((err) =>res.json(err))
})

router.post('/details', (req, res) => {
   dbBook.getBook(req.body.userId, req.body.bookId)
   .then((book) => {
      res.json(book[0])
   })
   .catch((err) =>res.json(err))
})


module.exports = router;



