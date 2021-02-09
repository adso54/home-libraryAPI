const express = require('express');
const router = express.Router({mergeParams: true});
const { dbBook}= require('../dbUtils/book');
const multer = require('multer');
const { db } = require('../dbUtils/config');
var storage = multer.memoryStorage()
var upload = multer({ storage: storage })

router.post('/',upload.single('file'), (req, res) => {
   dbBook.addOrEditBook(req, res)
   .then(book => {
      res.status(200).json(book)
   })
   .catch(err => {
      res.status(500).json(err)
   })
})

router.post('/allUserBooks', (req, res) => {
   dbBook.getAllUserBooks(req.body.userId)
   .then((books) => res.status(200).json(books))
   .catch((err) =>res.status(500).json(err))
})

router.post('/details', (req, res) => {
   dbBook.getBook(req.body.userId, req.body.bookId)
   .then((book) => {
      res.status(200).json(book[0])
   })
   .catch((err) =>res.status(500).json(err))
})

router.delete('/userBook', (req, res) => {
   dbBook.deleteBookFromUser(req.body.userId, req.body.bookId)
   .then(numberOfDeletedRows => res.status(200).json(numberOfDeletedRows))
   .catch(err => res.status(500).json(err))
})

router.get('/getTop10ByTitlePart',(req, res)=>{
   dbBook.getTop10ByTitlePart(req.body.title)
   .then((books) => res.status(200).json(books))
   .catch((err) =>res.status(500).json(err))
})

module.exports = router;



