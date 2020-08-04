const { db } = require('./config');


const addBook = (params) =>{
    return new Promise((resolve, reject) =>{
        const {createDate, createUser, title, description, image} = params;
        db('book')
        .insert({
            create_date: createDate,
            create_user: createUser,
            title: title,
            description: description,
            image: image
        })
        .returning('id')
        .then(createdBook => {resolve(createdBook[0])})
        .catch(err=>reject(err))
    })
}

const getAllBooks =(params) => {
    return new Promise((resolve, reject) => {
        db.select('*').from('book')
        .then(books => resolve(books))
        .catch(err=>reject(err))
    })
}

module.exports = {dbBook:{
    addBook: addBook,
    getAllBooks: getAllBooks
}}