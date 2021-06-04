const mongoose = require('mongoose')
require('dotenv').config()

module.exports = async () => {
    try{
        await mongoose.connect(process.env.db, {
            useUnifiedTopology: true,
            useNewUrlParser: true,
            useCreateIndex: true,
            useFindAndModify: false
        });

        console.log('mongodb is connected successfully')
    }
    catch(err){
        console.error(err)
    }
}