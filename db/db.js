const mongoose = require("mongoose");
const db = process.env.mongoDB
const connection = async()=>{
    try {
        await mongoose.connect(db,{
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
    } catch (error) {
        console.log(error);
    }
} 
module.exports = connection;