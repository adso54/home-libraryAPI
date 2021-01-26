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

const deleteBookCategory = async (bookId) => {
    return await  db('book_category')
        .where('book_id', bookId)
        .del()
        .then((numberOfDeletedRows) => {
            // console.log('Category', numberOfDeletedRows)
        })
        .catch(err => console.log(err))
    }

module.exports = {
    dbBookCategory: {
        insertBookCategory: insertBookCategory,
        deleteBookCategory: deleteBookCategory  
    }
}