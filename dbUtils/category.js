const { db } = require('./config');

const checkIfCategoryExist = async (category) =>{
    const data = await db.select('id').from('category').where('category', '=', category);
    if((typeof data[0] === 'undefined' || data[0] === null)){
        return null;
    }else{
        return data[0].id;
    }      
}

const insertCategory = async (category) =>{
    return await db('category')
    .insert({
        category: category
    })
    .returning('id')
    .then(categoryId => {
        categoryId = JSON.parse(categoryId);
        return categoryId;
    })
}

module.exports = {
    dbCategory: {
        checkIfCategoryExist: checkIfCategoryExist,
        insertCategory: insertCategory,
       
    }
}