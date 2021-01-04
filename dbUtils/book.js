const { db } = require('./config');
const multer = require('multer')

const addBook = (req, res) => {
    return new Promise((resolve, reject) => {
        const storage = multer.diskStorage({
            destination:  (req, file, cb) => {
                cb(null, 'public/images')
            },
            filename: (req, file, cb) => {
                cb(null, Date.now() + '-' +file.originalname )
            }
        })
        const upload = multer({ storage: storage }).single('file')

         upload(req, res,  (err) =>{
            const authors= JSON.parse(req.body.authors);
            const categories = JSON.parse(req.body.categories);
            const title = req.body.title;
            const userId = req.body.userId;
            const description = req.body.description;
            const comments = req.body.comments;
            const readDate = new Date(req.body.readDate);
            const createDate = new Date();

            const checkIfAuthorExist = async (author) =>{
                const data = await db.select('id').from('author').where('name', '=', author.name);
                if((typeof data[0] === 'undefined' || data[0] === null)){
                    return null;
                }else{
                    return data[0].id;
                }      
            }

            const checkIfCategoryExist = async (category) =>{
                const data = await db.select('id').from('category').where('category', '=', category);
                if((typeof data[0] === 'undefined' || data[0] === null)){
                    return null;
                }else{
                    return data[0].id;
                }      
            }

            const insertBookAuthor = async (bookId, authorId) => {
                await db('book_author')
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

            const insertBookCategory = async (bookId, categoryId) => {
                await  db('book_category')
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
        
            if (err instanceof multer.MulterError) {
                reject(err) 
            } else if (err) {
                reject(err)
            }
            req.file.fileURL = 'images/' + req.file.filename;
            
            db('book')
            .insert({
                create_date: createDate,
                title: title,
                image_url: req.file.fileURL,
                description: description
            })
            .returning('id')
            .then(createdBook => {
                const bookId = JSON.parse(createdBook[0]);

                authors.forEach((author) => {
                    checkIfAuthorExist(author).then(authorId => {
                        if(authorId !== null){
                            insertBookAuthor(bookId, authorId);
                        }else{
                            db('author')
                            .insert({
                                name: author.name
                            })
                            .returning('id')
                            .then(authorId => {
                                authorId = JSON.parse(authorId);
                                insertBookAuthor(bookId, authorId);
                            })
                        }
                    }) 
                })

                categories.forEach((category) => {
                    checkIfCategoryExist(category).then(categoryId => {
                        if(categoryId !== null){
                            insertBookCategory(bookId, categoryId)
                        }else{
                            db('category')
                            .insert({
                                category: category
                            })
                            .returning('id')
                            .then(categoryId => {
                                categoryId = JSON.parse(categoryId);
                                insertBookCategory(bookId, categoryId)
                            })
                        }
                    })
                })

                db('book_user')
                .insert({
                    book_id: bookId,
                    user_id: userId,
                    comments: comments,
                    read_date: readDate
                })
                .returning('book_id')
                // .then(book_id => console.log(book_id))
                .catch(err => console.log(err))

                resolve(bookId);
            })
            .catch(err=>reject(err))
          
        })
    })
}

const getBook =(userId, bookId) => {
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

module.exports = {dbBook:{
    addBook: addBook,
    getBook: getBook,
    getAllUserBooks: getAllUserBooks
}}