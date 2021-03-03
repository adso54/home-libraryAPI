const express = require('express');
const router = express.Router({mergeParams: true});
const {dbUser} = require('../dbUtils/user');

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

router.post('/passwordReset', (req, res) => {
    dbUser.resetPassword(req.body)
    .then(token=> {
        res.status(200).json(token)
    })
})

module.exports = router;