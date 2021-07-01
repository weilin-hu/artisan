const express         = require('express');            // create express app
const bodyParser      = require('body-parser');        // parsing body of HTTP requests
const cors            = require('cors');               // enable cross-origin resource sharing (cors)
const path            = require('path');
const passport        = require('passport');
const bcrypt          = require('bcrypt');
const jwt             = require('jsonwebtoken');       // allows us to sign token and verify
const AccessToken     = twilio.jwt.AccessToken;
const JwtStrategy     = require('passport-jwt').Strategy;
const ExtractJwt      = require('passport-jwt').ExtractJwt;
const { MongoClient } = require('mongodb');            // import MongoDB module
const ObjectId        = require('mongodb').ObjectID;   // Import ObjectID constructor
const mongo           = require('./db-config');
const app             = express();
const port            = 5000;                          // default server port
require('dotenv').config(); // allow access to .env variables

// Connect to db
const connect = async () => {
  try {
    const tmp = (await MongoClient.connect(mongo.url, mongo.options)).db();
    console.log(`Connected to database: ${tmp.databaseName}`);
    return tmp;
  } catch (err) {
    console.error(err.message);
    throw err;
  }
};

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));
// app.use(express.static(path.join(__dirname, './../final-project/build')));

// Start server
let db;
app.listen(process.env.PORT || port, async () => {
  db = await connect();
  console.log(`Server running on port: ${port}`);
});

// options to control how token is extracted from request or verified
const opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_KEY,
};
// passport use JwtStrategy to extract token from header and sends user associated with token
passport.use(new JwtStrategy(opts, function(payload, done) {
  db.collection('Artisan').findOne({ username : payload.username }).then((user, err) => {
    if (err) done(err, false);
    if (user) {
      return done(null, user);
    } else {
      res.json({success: false, error: {code: '401', msg: 'Invalid token.'}});
      // res.status(401).json({ error: 'Invalid token.' })
      // return done(null, false);
    }
  });
}));

app.use(passport.initialize());

// Root endpoint
// app.get('*', (req, res) => {
//   console.log('root endpoint');
//   res.sendFile(path.join(__dirname, './../final-project/build/index.html'));
// });

// Default response for any other request
app.use((_req, res) => {
  res.status(404);
});

module.exports = app;
