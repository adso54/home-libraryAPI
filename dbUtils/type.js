
const { db } = require('./config');

const addType  =  (params)  =>{
    return new Promise((resolve, reject) =>{
        const {description, type} = params;
        db('type').insert({
            type: type,
            description: description
        })
        .returning('*')
        .then(createdType => {
            return resolve(createdType[0])
        })
        .catch(err => {return reject(err)})
    })
}

module.exports = {
    dbType: {
        addType: addType}
}