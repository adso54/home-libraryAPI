const { db } = require('./config');

const checkIfAuthorExist = async (author) =>{
    const data = await db.select('id').from('author').where('name', '=', author.name);
    if((typeof data[0] === 'undefined' || data[0] === null)){
        return null;
    }else{
        return data[0].id;
    }      
}

const insertAuthor = async (name) =>{
    return await db('author')
    .insert({
        name: name
    })
    .returning('id')
    .then(authorId => {
        authorId = JSON.parse(authorId);
        
        return authorId
    })
}



module.exports = {
    dbAuthor: {
        checkIfAuthorExist: checkIfAuthorExist,
        insertAuthor: insertAuthor
       
    }
}