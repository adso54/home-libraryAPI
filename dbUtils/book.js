const { db } = require('./config');


const addBook = (params) =>{
    return new Promise((resolve, reject) =>{
        const { createDate = new Date(), title, description, image} = params;
        db('book')
        .insert({
            create_date: createDate,
            // create_user: createUser,
            title: title,
            // description: description,
            image: image
        })
        .returning('id')
        .then(createdBook => {resolve(createdBook[0])})
        .catch(err=>reject(err))
    })
}

const getBook =(params) => {
    return new Promise((resolve, reject) => {
        db.select('*')
            .from('book')
            .where('id', '=', '6')
        .then(book => resolve(book))
        .catch(err=>reject(err))
    })
}

module.exports = {dbBook:{
    addBook: addBook,
    getBook: getBook
    // getAllBooks: getAllBooks
}}