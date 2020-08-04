const { db } = require('./config');

const addAuthor = (params) => {
    return new Promise((resolve, reject) => {

        const { createDate = new Date,createUser, firstName, lastName, description} = params;
    
        db('author').insert({
            create_date: createDate,
            create_user: createUser,
            first_name: firstName,
            last_name: lastName,
            description: description
        })
        .returning('*')
        .then(createdAuthor => {
            return resolve(createdAuthor[0].id);
        })
        .catch(err => reject(err))
    })
}

module.exports = {
    dbAuthor: {
        addAuthor: addAuthor}
}