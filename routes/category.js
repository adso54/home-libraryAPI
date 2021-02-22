const express = require('express');
const router = express.Router({mergeParams: true});
const { dbCategory }= require('../dbUtils/category');


router.post('/getTop10ByCategoryPart',(req, res)=>{
    dbCategory.getTop10ByCategoryPart(req.body.category)
   .then((categories) => res.status(200).json(categories))
   .catch((err) =>res.status(500).json(err))
})

module.exports = router;