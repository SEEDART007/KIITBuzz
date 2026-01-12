require('dotenv').config();
const mongoose = require('mongoose')

const dbConfg = async()=>{
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("database connected successfully")
    } catch (error) {
        console.log(error)
    }
}

module.exports = dbConfg;