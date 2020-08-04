const express = require('express');
const router = express.Router({mergeParams: true});
const {dbUser} = require('../dbUtils/user');

router.get('/:userId/books', (req, res) => {
    dbUser.getAllBooks(req.params)
    .then(allBooks => {res.json(allBooks)})
    .catch(err=>res.json(err))
})

router.post('/register', (req, res) => {
    dbUser.register(req.body)
    .then(createdUser => {res.json(createdUser)})
    .catch(err=>res.json(err))
})

router.post('/signIn', (req,res) => {
    dbUser.signIn(req.body)
    .then(user=>res.json(user))
    .catch(err=>res.json(err))
})

router.post('/addBookToUser', (req, res)=>{
    dbUser.addBookToUser(req.body)
    .then(userBook => res.json(userBook))
    .catch(err=>res.json(err))
})

module.exports = router;