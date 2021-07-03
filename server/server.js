const express         = require('express');            // create express app
const bodyParser      = require('body-parser');        // parsing body of HTTP requests
const cors            = require('cors');               // enable cross-origin resource sharing (cors)
// const path            = require('path');
const passport        = require('passport');
const bcrypt          = require('bcrypt');
const jwt             = require('jsonwebtoken');       // allows us to sign token and verify
const JwtStrategy     = require('passport-jwt').Strategy;
const ExtractJwt      = require('passport-jwt').ExtractJwt;
const { MongoClient } = require('mongodb');            // import MongoDB module
const ObjectId        = require('mongodb').ObjectID;   // Import ObjectID constructor

const crypto          = require('crypto');
const sendmail        = require('sendmail')();

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
// app.use(express.static(path.join(__dirname, './../client/build')));

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
  db.collection('Artisan').findOne({ _id : payload.id }).then((user, err) => {
    if (err) done(err, false);
    if (user) {
      return done(null, user);
    } else {
      res.json({success: false, error: {code: '401', msg: 'Invalid token.'}});
      // res.status(401).json({ error: 'Invalid token.' })
      return done(null, false);
    }
  });
}));

app.use(passport.initialize());

/** ---------------------
 * AUTHENTICATION ROUTES 
 * ------------------ 
 */
// New user registration endpoint
app.post('/register', async (req, res) => {
  const { username, password, email, birth_month, birth_day, birth_year } = req.body;

  // error if all inputs not included
  if (!username || !password || !email || !birth_month || !birth_day || !birth_year) {
    res.json({success: false, error: {code: '400', msg: 'Request malformed: Please include all fields.' }});
    return;
  }

  // error if user or email already in use
  const emailExists = await db.collection('Artisan').findOne({ email: email });
  const userExists = await db.collection('Artisan').findOne({ username: username });
  if (emailExists || userExists) {
    res.json({success: false, error: {code: '409', msg: 'Conflict: Username or email already exists!'}});
    return;
  }
  
  // error if password does not satisfy security requirements
  if (!password.match(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/)) {
    res.json({success: false, error: {code: '400', msg: 'Password format invalid.'}});
    return;
  }

  // error if birthdate invalid
  const birthDate = new Date(`${birth_month} ${birth_day} ${birth_year}`);
  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  if (birthDate.toString() === 'Invalid Date' || monthNames[birthDate.getMonth()] !== birth_month) {
    res.json({success: false, error: {code: '400', msg: 'Birthday is not a valid date.'}});
    return;
  }

  // auto-gen a salt and hash
  bcrypt.hash(password, 10, async (err, hashPass) => {
    if (err) return next(err);

    // create new user
    const user = {
      username: username,
      password: hashPass,
      email: email,
      date_of_birth: birthDate,
      registration_date: new Date(),
      pfp_url: 'http://farmersca.com/wp-content/uploads/2016/07/default-profile.png',
      cover_url: '',
      bio: '',
      title: '',
      views: 0,
      reputation: 0,
      online: false,
      private: false,
      hidden: false,
      deactivated: false,
      featured: [],
      following: [],
      followers: [],
      blocked_users: [],
      hidden_posts: [],
      communities: [],
      favorites: [], 
      failed_attempts: 0,
      locked_until: new Date(),
    };

    // save user to database
    db.collection('Artisan').insertOne(user).then(() => 
      res.json({ success: true, user: user })
    ).catch((err) => 
      res.json({ success: false, error: { code: '400', msg: 'Error creating new user.' } })
    );
  });
});

// User login endpoint
app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  // error if all fields not provided
  if (!username || !password) {    
    res.json({ success: false, error: { code: '400', msg: 'Username and password field required.' }});
    return;
  }

  try {
    // error 404 if username not found in database
    const user = await db.collection('Artisan').findOne({ username: username });
    if (!user) {
      res.json({ success: false, error: { code: '404', msg: 'Username with specified username does not exist.' }});
      return;
    }

    // compare passwords
    const matches = await bcrypt.compare(password, user.password);
    if (matches) {
      let token = jwt.sign({ 
        id: user._id,
      }, process.env.JWT_KEY, {expiresIn: '3 hours'});

      // user is no longer deactivated upon login
      if (user.deactivated) {
        await db.collection('Artisan').updateOne({ username: username }, { $set: { deactivated: false } });
      }

      // return user token
      res.status(200).json({ success: true, token: token });
      return;

    } else {
      // status 401 if password does not match
      res.json({ success: false, error: { code: '401', msg: 'Invalid password.' }});
      return;
    }
  } catch (err) {
    res.json({ success: false, error: {code: '400', msg: 'Error.' }});
    return;
  }
});

app.post('/forgotpassword', async (req, res) => {
  const { username } = req.body;
  const user = await db.collection('Artisan').findOne({ username: username });
  // error 404 if user with email doesn't exist
  if (!user) {
    res.json({ success: false, error: { code: '404', msg: 'Username with specified username does not exist.' }});
    return;
  }

  // gen random token
  const token = crypto.randomBytes(32).toString('hex');
  // auto-gen a salt and hash
  bcrypt.hash(token, 10, async (err, hashToken) => {
    if (err) return next(err);

    try {
      // delete all prior tokens corresponding to this user
      await db.collection('Token').deleteMany( { artisan: ObjectId(user._id) });
      // save reset token to database
      const newToken = {
        artisan: user._id,
        token: hashToken,
        expires: Date.now() + 900000,
      };
      await db.collection('Token').insertOne(newToken);

      // send reset mail to user's email
      sendmail({
        to: user.email,
        from: 'no-reply@artisan.com',
        subject: 'Artisan Password Reset',
        html: `
          <h2> You requested to reset your password. </h2>
          <h3>Click on this <a href="http://localhost:5000/resetPassword/${user._id}/${token}">link</a> to reset.</h3>
          <h3>This link will expire in 15 minutes.</h3>
        `
      }, (err, info) => {
        if (err) {
          res.json({ success: false, error: { code: '400', msg: 'Error sending email.' }});
        } else {
          res.json({ success: true, message: 'Password reset email sent.', info: info });
          return;
        }
      });
    } catch (err) {
      res.json({ success: false, error: { code: '400', msg: 'Error.' }});
    }
  });
});

app.put('/resetPassword/:id/:hashtoken', async (req, res) => {
  const { id, hashtoken } = req.params;
  // error 404 if token corresponding to user with {id} does not exist
  const token = await db.collection('Token').findOne({ artisan: ObjectId(id) });
  if (!token) {
    res.json({ success: false, error: { code: '404', msg: 'Token expired or does not exist.' }});
    return;
  }

  console.log('expires', token.expires);
  console.log('now', Date.now());
  // error 401 if token expired
  if (!(new Date(token.expires) > Date.now())) {
    await db.collection('Token').deleteMany({ artisan: ObjectId(id) });
    res.json({ success: false, error: { code: '401', msg: 'Token expired' }});
    return;
  }
  
  try {
    // compare tokens
    const matches = await bcrypt.compare(hashtoken, token.token);
    if (matches) {
      // hash password
      bcrypt.hash(req.body.password, 10, async (err, hashPass) => {
        if (err) return next(err);
        
        // update password and delete token
        await db.collection('Artisan').updateOne( {_id: ObjectId(id) }, { $set: { password: hashPass } });
        await db.collection('Token').deleteMany({ artisan: ObjectId(id) });

        // return user token
        res.status(200).json({ success: true, message: 'Password successfully reset.' });
        return;
      });
    } else {
      // status 401 if password does not match
      res.json({ success: false, error: { code: '401', msg: 'Invalid token.' }});
      return;
    }
  } catch (err) {
    res.json({ success: false, error: {code: '400', msg: 'Error.' }});
    return;
  }
});

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
