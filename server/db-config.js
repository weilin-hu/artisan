require('dotenv').config();

 const MONGO_OPTIONS = { useNewUrlParser: true, useUnifiedTopology: true };
 const MONGO_USERNAME = process.env.MONGO_USERNAME;
 const MONGO_PASSWORD = process.env.MONGO_PASSWORD;
 const MONGO_HOST = process.env.MONGO_HOST;
 
 const mongo = {
   host: MONGO_HOST,
   user: MONGO_USERNAME,
   password: MONGO_PASSWORD,
   url: `mongodb+srv://${MONGO_USERNAME}:${MONGO_PASSWORD}@${MONGO_HOST}`,
   options: MONGO_OPTIONS,
 }
 
 module.exports = mongo;