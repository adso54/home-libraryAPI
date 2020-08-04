const { db } = require('./config');
const bcrypt = require('bcrypt');

const register = (params) =>{
    return new Promise((resolve, reject) =>{
        const { name, email, createDate = new Date(), password} = params;
        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(password, salt);

        db.transaction(trx => {
            trx
            .insert({
                name: name,
                email: email,
                create_date: createDate
            })
            .into('user')
            .returning('*')
            .then(user => {
                return trx
                    .insert({
                        user_id: Number(user[0].id),
                        password: hash
                    })
                    .into('login')
                    .returning('id')
                    .then(() => resolve(user[0]))
                    .catch(err => reject(err))                   
            }) 
            .then(trx.commit)
            .catch(trx.rollback)
        })
        .catch(err => {
            reject(err)
        });
    }) 
}

const signIn = (params) => {
    return new Promise((resolve, reject) => {
        const {password, email} = params;
        db.select('user.*',  'login.password')
            .from('user')
            .innerJoin('login','user.id','login.user_id')
            .where('user.email', '=', email)
            .then(data => {
                const dbPassword = data[0].password;
                if(dbPassword){
                    const isValid = bcrypt.compareSync(password, dbPassword)
                    if(isValid){
                        delete data[0].password
                        return resolve(data[0])
                    }
                }
                return reject({
                    error: "Wrong credentials!"
                })
                
            })   
            .catch(err =>  reject(err)); 
    })
    
}

const addBookToUser = (params => {
    return new Promise((resolve, reject) => {
        const { bookId, userId, status, rating, userComment } = params;
        db('user_book')
        .insert({
            user_id: userId,
            book_id: bookId,
            status: status,
            rating: rating,
            user_comment: userComment
        })
        .returning('*')
        .then(userBook => resolve(userBook))
        .catch(err => reject(err));
    })
    

})

const getAllBooks = (params) => {
    return new Promise((resolve, reject) => {
        const { userId } = params;
        db.select('*')
        .from('v_user_book')
        .where('user_id', '=', userId)
        .then(userBooks => resolve(userBooks))
        .catch(err => reject(err))
    })
    
}

module.exports = {
    dbUser: {
        register: register,
        signIn: signIn,
        addBookToUser: addBookToUser,
        getAllBooks: getAllBooks  
    }
}