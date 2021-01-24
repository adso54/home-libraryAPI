const { db } = require('./config');

const insertBookUser = async (bookId, userId, comments, readDate) => {
    if(readDate!==null) {
        return await db('book_user')
        .insert({
            book_id: bookId,
            user_id: userId,
            comments: comments,
            read_date: readDate
        })
        .returning('book_id')
        .then(bookId => {
            return bookId
        })
        .catch(err => console.log(err))
    }else{
        return await db('book_user')
        .insert({
            book_id: bookId,
            user_id: userId,
            comments: comments
        })
        .returning('book_id')
        .then(bookId => {
            return bookId
        })
        .catch(err => console.log(err))
    }
}



module.exports = {
    dbBookUser: {
        insertBookUser: insertBookUser
    }
}