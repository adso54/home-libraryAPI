// const express = require('express');
// const router = express.Router({mergeParams: true});
// // const { dbType} = require('../dbUtils/type');
// const { dbBook}= require('../dbUtils/book');

// router.post('/', (req, res) => {
//    dbBook.addBook(req.body)
//    .then((book) =>res.json(book))
//    .catch((err) =>res.json(err))
// })

// router.get('/', (req, res) => {
//    dbBook.getAllBooks()
//    .then((books) => res.json(books))
//    .catch((err) =>res.json(err))
// })

// module.exports = router;