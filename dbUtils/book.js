const { db } = require('./config');
const multer = require('multer')

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

const uploadImage = (req, res) => {
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
            if (err instanceof multer.MulterError) {
                reject(err) 
            } else if (err) {
                reject(err)
            }
            resolve(req.file)
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
    uploadImage: uploadImage,
    // getAllBooks: getAllBooks
}}