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
            const authorsId = [];
            const title = req.body.title;
            const userId = req.body.userId;
            const description = req.body.description;
            const comments = req.body.comments;
            const readDate = req.body.readDate;
            const createDate = new Date();
        
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
                    db('author')
                    .insert({
                        name: author.name
                    })
                    .returning('id')
                    .then(authorId => {
                        authorId = JSON.parse(authorId);
                        authorsId.push(authorId)

                        db('book_author')
                        .insert({
                            book_id: bookId,
                            author_id: authorId
                        })
                        .returning('book_id')
                        .then(book_id => console.log(book_id))
                        .catch(err => console.log(err))
                    })
                })

                categories.forEach((category) => {
                    db('category')
                    .insert({
                        category: category
                    })
                    .returning('id')
                    .then(categoryId => {
                        categoryId = JSON.parse(categoryId);
                        
                        db('book_category')
                        .insert({
                            book_id: bookId,
                            category_id: categoryId
                        })
                        .returning('book_id')
                        .then(book_id => console.log(book_id))
                        .catch(err => console.log(err))
                    })
                })

                db('book_user')
                .insert({
                    book_id: bookId,
                    user_id: userId,
                    comments: comments,
                    // read_date: readDate
                })
                .returning('book_id')
                .then(book_id => console.log(book_id))
                .catch(err => console.log(err))

                resolve(bookId);
            })
            .catch(err=>reject(err))
          
        })
    })
}

const getBook =() => {
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
    getBook: getBook,
}}