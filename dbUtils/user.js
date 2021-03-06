const { db } = require('./config');
const bcrypt = require('bcrypt');
const {tokenDecode, tokenGenerate} = require('../utils/jwt')
const {sendEmailText} = require('../utils/email')


const register = (params) =>{
    return new Promise((resolve, reject) =>{

        const { firstName, lastName, email, createDate = new Date(), password} = params;
        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(password, salt);

        db.transaction(trx => {
            trx
            .insert({
                first_name: firstName,
                last_name: lastName,
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
                    .into('user_login')
                    .returning('id')
                    .then(() => resolve(user[0]))
                    .catch(err => reject(err))                   
            }) 
            .then(trx.commit)
            .catch(trx.rollback)
        })
        .catch(err => {
            console.log(err)
            reject(err)
        });
    }) 
}

const signIn = (params) => {
    return new Promise((resolve, reject) => {
        const {password, email} = params;
        db.select('user.*',  'user_login.password')
            .from('user')
            .innerJoin('user_login','user.id','user_login.user_id')
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
            .catch(err =>  {
                console.log(err)
                reject(err)
            }); 
    })
    
}

const resetPassword = (params) => {
    return new Promise((resolve, reject) => {
        const {email, appLink} = params;
        
        const getUserId = (email) => {
            return new Promise((resolve, reject) => {
                db.select('id')
                .from('user')
                .where('email',email)
                .then(data => resolve(data[0]))
            })      
        }

        const getUserToken = (userId) => {
            return new Promise((resolve, reject) => {
                db.select('modify_date','use_counter', 'active', 'token')
                   .from('user_token')
                   .where('user_id',userId)
                   .andWhere('active',1)
                   .then(data => resolve(data[0]))
            })
        }

        const insertUserToken = (userId, token, secret) => {
            return new Promise((resolve, reject) => {
                db.insert({
                   user_id: userId,
                   token: token,
                   create_date: new Date(),
                   modify_date: new Date(), 
                   use_counter: 0,
                   active: 1,
                   secret: secret
               })
               .into('user_token')
               .returning('*')
               .then(data => resolve(data))
            })
        }

        const unactivateToken = (token) => {
            return new Promise((resolve, reject) =>{
                db('user_token')
                .update({
                    active: 0
                })
                .where('token', token)
                .returning('*')
                .then(tokenData => resolve(tokenData))
            })
        }

        const addUseCounterForToken = (token, useCounter) => {
            return new Promise((resolve, reject) =>{
                db('user_token')
                .update({
                    use_counter: useCounter
                })
                .where('token', token)
                .returning('*')
                .then(tokenData => resolve(tokenData))
            })
        }

        // Flow of the password reset method
        getUserId(email)
        .then(data => {
            const userId = data.id;

            getUserToken(userId)
            .then(tokenData => {
                if(tokenData === undefined) {
                    const {token, secret} = tokenGenerate(email);

                    insertUserToken(userId, token, secret)
                    .then(userToken => {
                        sendEmailText(email, "Password reset link", `Click link to reset password:
                        ${appLink + userToken[0].token}
                        `)
                        resolve(userToken[0].token)
                    })
                }else{
                    const { token,  active} = tokenData;
                    const useCounter = tokenData.use_counter

                    addUseCounterForToken(token, useCounter + 1)
                    .then(tokenData => {
                        if(useCounter >= 3){
                            unactivateToken(tokenData[0].token)
                        }
                        sendEmailText(email, "Password reset link", `Click link to reset password:
                        ${appLink + tokenData[0].token}
                        `)
                        resolve(tokenData[0].token)
                    })

                }
            })

        })

    })
}

const changePassword = (params) => {
    return new Promise((resolve, reject) => {
        const {password, token} = params;
        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(password, salt);
        db.select('secret').from('user_token').where('token', token)
        .then(data => {
            const secret = data[0].secret
            const email = tokenDecode(token, secret)
            db.select('id').from('user').where('email', email)
            .then(data => {
                const userId = data[0].id
                db('user_login').update({ 
                    password: hash
                })
                .where('user_id', userId)
                .returning('user_id')
                .then(data => {
                    db('user_token')
                    .where('token', token)
                    .del()
                    .then(() => {
                        resolve(data[0])
                    })

                })
            })

        })

    })
}

module.exports = {
    dbUser: {
        register: register,
        signIn: signIn,
        resetPassword: resetPassword,
        changePassword: changePassword
    }
}