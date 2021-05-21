const mongoose = require('mongoose')
require('dotenv').config()

module.exports = async () => {
    try{
        mongoose.connect(process.env.db, {
            useUnifiedTopology: true,
            useNewUrlParser: true,
            useCreateIndex: true
        });

        console.log('mongodb is connected successfully')
    }
    catch(err){
        console.error(err)
    }
}