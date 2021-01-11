const express = require('express');
const router = express.Router({mergeParams: true});
const {dbUser} = require('../dbUtils/user');

// router.get('/:userId/books', (req, res) => {
//     dbUser.getAllBooks(req.params)
//     .then(allBooks => {res.json(allBooks)})
//     .catch(err=>res.json(err))
// })

router.post('/register', (req, res) => {
    dbUser.register(req.body)
    .then(createdUser => {
        res.status(200).json(createdUser)})
    .catch(err=>res.status(500).json(err))
})

router.post('/signIn', (req,res) => {
    dbUser.signIn(req.body)
    .then(user=>{
        res.status(200).json(user)})
    .catch(err=>res.status(500).json(err))
})

// router.post('/addBookToUser', (req, res)=>{
//     dbUser.addBookToUser(req.body)
//     .then(userBook => res.json(userBook))
//     .catch(err=>res.json(err))
// })

module.exports = router;