const { db } = require('./config');

const insertBookCategory = async (bookId, categoryId) => {
    return await  db('book_category')
    .insert({
        book_id: bookId,
        category_id: categoryId
    })
    .returning('book_id')
    .then(bookId => {
        return bookId
    })
    .catch(err => {
        console.log(err)
        return err
    })
}

module.exports = {
    dbBookCategory: {
        insertBookCategory: insertBookCategory  
    }
}