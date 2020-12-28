const express = require('express');
const router = express.Router({mergeParams: true});
const { dbBook}= require('../dbUtils/book');

router.post('/', (req, res) => {
   dbBook.addBook(req.body)
   .then((book) =>res.json(book))
   .catch((err) =>res.json(err))
})

router.get('/', (req, res) => {
   dbBook.getBook()
   .then((book) => res.json(book))
   .catch((err) =>res.json(err))
})

router.post('/upload',(req, res) => {
   dbBook.uploadImage(req, res)
   .then(book => {
      res.status(200).json(book)
   })
   .catch(err => {
      res.status(500).json(err)
   })
   
});

module.exports = router;



