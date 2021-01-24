const { db } = require('./config');

const insertBookAuthor = async (bookId, authorId) => {
    return await db('book_author')
    .insert({
        book_id: bookId,
        author_id: authorId
    })
    .returning('book_id')
    .then(book_id => {return book_id})
    .catch(err => {
        console.log(err)
        return err
    })
}

module.exports = {
    dbBookAuthor: {
        insertBookAuthor: insertBookAuthor
    }
}