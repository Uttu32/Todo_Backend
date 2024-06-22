const mongoose = require("mongoose");
require("dotenv").config();

exports.Connect = async () => {
    const URL = process.env.MONGODB_URL;
    mongoose.connect(URL)
    .then(() => console.log("DB Connection Successfully"))
    .catch((err) =>{
        console.log(err);
        console.log("DB Connection failed")
    } )
}