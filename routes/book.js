const express = require('express');
const router = express.Router({mergeParams: true});
// const { dbType} = require('../dbUtils/type');
const { dbBook}= require('../dbUtils/book');
const multer = require('multer')

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


var storage = multer.diskStorage({
   destination: function (req, file, cb) {
   cb(null, 'public/images')
 },
 filename: function (req, file, cb) {
   cb(null, Date.now() + '-' +file.originalname )
 }
})
var upload = multer({ storage: storage }).single('file')

router.post('/upload',(req, res) => {
   upload(req, res, (err) =>{
          if (err instanceof multer.MulterError) {
              return res.status(500).json(err)
          } else if (err) {
              return res.status(500).json(err)
          }
     return res.status(200).send(req.file)

   })

});

module.exports = router;



