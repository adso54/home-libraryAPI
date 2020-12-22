const { db } = require('./config');

const addBook = (params) =>{
    return new Promise((resolve, reject) =>{
        const { createDate = new Date(), title, description, image} = params;
        console.log(image)

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

// const upload = (params) => {
//     return new Promise((resolve, reject) => {

//     })
// }

const getBook =(params) => {
    return new Promise((resolve, reject) => {
        db.select('*')
            .from('book')
            .where('id', '=', '14')
        .then(book => {
            console.log(book[0].image)

            var binary = '';
            var bytes = new Uint8Array(book[0].image);
            var len = bytes.byteLength;
            for (var i = 0; i < len; i++) {
                binary += String.fromCharCode( bytes[ i ] );
            }
            book[0].image= binary;
            console.log(book)
            resolve(book)
        })
        .catch(err=>reject(err))
    })
}

module.exports = {dbBook:{
    addBook: addBook,
    getBook: getBook
    // getAllBooks: getAllBooks
}}