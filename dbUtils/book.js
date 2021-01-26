const { db } = require('./config');
const { dbAuthor } = require('./author');
const { dbCategory } = require('./category');
const { dbBookAuthor } = require('./bookAuthor');
const { dbBookCategory } = require('./bookCategory');
const { dbBookUser } = require('./bookUser');

const checkIfBookExists = async (title) => {
    const data = await db.select('id').from('book').where('title', '=', title);
    if((typeof data[0] === 'undefined' || data[0] === null)){
        return null;
    }else{
        return data[0].id;
    }      
}

const insertBook = async (title, imageUrl, description) =>{
    const createDate = new Date();

    return await db('book')
    .insert({
        create_date: createDate,
        title: title,
        image_url: imageUrl,
        description: description
    })
    .returning('id')
    .then(bookId => {
        bookId = JSON.parse(bookId);
        return bookId
    })
}

const updateBook = async (bookId, title, imageUrl, description) =>{
    const createDate = new Date();

    return await db('book')
    .where('id', bookId)
    .update({
        create_date: createDate,
        title: title,
        image_url: imageUrl,
        description: description
    })
    .returning('id')
    .then(bookId => {
        bookId = JSON.parse(bookId);
        return bookId
    })
}

const addOrEditBook = (req, res) => {
    return new Promise((resolve, reject) => {
        
        const authors= JSON.parse(req.body.authors);
        const categories = JSON.parse(req.body.categories);
        const title = req.body.title;
        const userId = req.body.userId;
        const description = req.body.description;
        const comments = req.body.comments;
        const imageUrl = req.body.imageUrl;
        const bookIdFromFront = req.body.bookId
        
        let readDate = null;
        if(req.body.readDate!=='null'){
            readDate = new Date(req.body.readDate);
        }else{
            readDate = null;
        }
                            
        checkIfBookExists(title)
        .then(async bookId => {
            if(bookId !== null || bookIdFromFront !== 'null'){
                if(bookIdFromFront !== 'null'){
                    bookId = bookIdFromFront
                }

                await dbBookAuthor.deleteBookAuthor(bookId)
                await dbBookCategory.deleteBookCategory(bookId)
                await dbBookUser.deleteBookUser(bookId, userId)
                await updateBook(bookId, title, imageUrl, description)

                return bookId
                
                
            }else{
                return await insertBook(title, imageUrl, description)
            }
        })
        .then(bookId => {
            authors.forEach((author) => {
                dbAuthor.checkIfAuthorExist(author).then(authorId => {
                    if(authorId !== null){
                        dbBookAuthor.insertBookAuthor(bookId, authorId);
                    }else{
                        dbAuthor.insertAuthor(author.name)
                        .then(authorId => {
                            dbBookAuthor.insertBookAuthor(bookId, authorId);
                        })
                    }
                }) 
            })

            categories.forEach((category) => {
                dbCategory.checkIfCategoryExist(category).then(categoryId => {
                    if(categoryId !== null){
                        dbBookCategory.insertBookCategory(bookId, categoryId)
                    }else{
                        dbCategory.insertCategory(category.category)
                            .then(categoryId => {
                                dbBookCategory.insertBookCategory(bookId, categoryId)
                            })
                    }
                })
            })

            resolve (dbBookUser.insertBookUser(bookId, userId, comments, readDate))
        })
        .catch(err=>reject(err))
    })
}


const getBook =(userId, bookId) => {
    return new Promise((resolve, reject) => {
        db.select('book.id', 'book.title', 'book.image_url', 'book.description' 
            ,'book_user.comments', 'book_user.read_date'
            )
                .from('book')
                .innerJoin('book_user', 'book.id', 'book_user.book_id')
                .where('book_user.user_id' , '=' , userId)
                .andWhere('book.id' , '=' , bookId)
            .then(books => {
                //Getting authors
                const functionWithPromise = book => {
                    return Promise.resolve(
                        db.select('author.name')
                            .from('author')
                            .innerJoin('book_author', 'author.id','book_author.author_id')
                            .where('book_author.book_id','=',book.id)
                        .then(authors =>{
                            return { ...book, author: authors}
                        })
                    )
                }

                const asAsyncFunction = async book => {
                    return functionWithPromise(book)
                }

                const getData = async() => {
                    return Promise.all(books.map(book => asAsyncFunction(book)))
                }

                return(
                    getData().then(books => {
                        return books
                    })
                )

            })
            .then(books => {
                //Getting categories
                const functionWithPromise = book => {
                    return Promise.resolve(
                        db.select('category.category')
                            .from('category')
                            .innerJoin('book_category', 'category.id','book_category.category_id')
                            .where('book_category.book_id','=',book.id)
                        .then(category =>{
                            return { ...book, category: category}
                        })
                    )
                }

                const asAsyncFunction = async book => {
                    return functionWithPromise(book)
                }

                const getData = async() => {
                    return Promise.all(books.map(book => asAsyncFunction(book)))
                }

                resolve(
                    getData().then(books => {
                        return books
                    })
                )
            })
            .catch(err => reject(err))
        })
}

const getAllUserBooks = (userId) => {
    return new Promise((resolve, reject) => {
        db.select('book.id', 'book.title', 'book.image_url', 'book.description' 
        ,'book_user.comments', 'book_user.read_date'
        )
            .from('book')
            .innerJoin('book_user', 'book.id', 'book_user.book_id')
            .where('book_user.user_id','=',userId)
        .then(books => {
            //Getting authors
            const functionWithPromise = book => {
                return Promise.resolve(
                    db.select('author.name')
                        .from('author')
                        .innerJoin('book_author', 'author.id','book_author.author_id')
                        .where('book_author.book_id','=',book.id)
                    .then(authors =>{
                        return { ...book, author: authors}
                    })
                )
            }

            const asAsyncFunction = async book => {
                return functionWithPromise(book)
            }

            const getData = async() => {
                return Promise.all(books.map(book => asAsyncFunction(book)))
            }

            return(
                getData().then(books => {
                    return books
                })
            )

        })
        .then(books => {
            //Getting categories
            const functionWithPromise = book => {
                return Promise.resolve(
                    db.select('category.category')
                        .from('category')
                        .innerJoin('book_category', 'category.id','book_category.category_id')
                        .where('book_category.book_id','=',book.id)
                    .then(category =>{
                        return { ...book, category: category}
                    })
                )
            }

            const asAsyncFunction = async book => {
                return functionWithPromise(book)
            }

            const getData = async() => {
                return Promise.all(books.map(book => asAsyncFunction(book)))
            }

            resolve(
                getData().then(books => {
                    return books
                })
            )
        })
        .catch(err => reject(err))
    })  
}

const deleteBookFromUser = (userId, bookId) => {
    return new Promise((resolve, reject) =>{
        db('book_user')
            .where('user_id', userId)
            .andWhere('book_id', bookId)
            .del()
        .then(numberOfDeletedRows => {
            resolve(numberOfDeletedRows)
        })

    })
}

module.exports = {dbBook:{
    addOrEditBook: addOrEditBook,
    getBook: getBook,
    getAllUserBooks: getAllUserBooks,
    deleteBookFromUser: deleteBookFromUser,
    updateBook: updateBook
}}