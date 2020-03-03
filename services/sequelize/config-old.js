const dotenv= require('dotenv');
const path = require('path');
module.exports.development ={
    dialect:"mysql", 
    url:process.env.DB_URL
}