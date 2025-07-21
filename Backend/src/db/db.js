const mongoose = require('mongoose');

function connectDb (){
    mongoose.connect(process.env.MONGO_URL);
    console.log("Connected to MongoDb");
}

module.exports = connectDb;