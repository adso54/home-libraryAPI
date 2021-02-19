const express = require('express');
const router = express.Router({mergeParams: true});
const { dbAuthor }= require('../dbUtils/author');


router.post('/getTop10ByName',(req, res)=>{
    dbAuthor.getTop10ByNamePart(req.body.name)
   .then((authors) => res.status(200).json(authors))
   .catch((err) =>res.status(500).json(err))
})

module.exports = router;