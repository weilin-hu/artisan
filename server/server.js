const express         = require('express');            // create express app
const bodyParser      = require('body-parser');        // parsing body of HTTP requests
const cors            = require('cors');               // enable cross-origin resource sharing (cors)
// const path            = require('path');
const passport        = require('passport');
const bcrypt          = require('bcrypt');
const jwt             = require('jsonwebtoken');       // allows us to sign token and verify
const JwtStrategy     = require('passport-jwt').Strategy;
const ExtractJwt      = require('passport-jwt').ExtractJwt;
const { MongoClient, ObjectID } = require('mongodb');            // import MongoDB module
const ObjectId        = require('mongodb').ObjectID;   // Import ObjectID constructor

const crypto          = require('crypto');
const sendmail        = require('sendmail')();

const mongo           = require('./db-config');
const { unwatchFile } = require('fs');
const { title } = require('process');
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
passport.use(new JwtStrategy(opts, async function(payload, done) {
  try {
    const user = await db.collection('Artisan').findOne({ _id: ObjectId(payload.id) });
    if (user) {
      return done(null, user);
    } else {
      res.json({success: false, error: {code: '401', msg: 'Invalid token.'}});
      return done(null, false);
    }
  } catch (err) {
    return done(err, false);
  }
  // db.collection('Artisan').findOne({ _id : ObjectId(payload.id) }).then((user, err) => {
  //   if (err) done(err, false);
  //   if (user) {
  //     return done(null, user);
  //   } else {
  //     res.json({success: false, error: {code: '401', msg: 'Invalid token.'}});
  //     return done(null, false);
  //   }
  // });
}));

app.use(passport.initialize());

/** ---------------------
 * AUTHENTICATION ROUTES 
 * ---------------------- 
 */
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
  if (!password.match(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,50}$/)) {
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

// TODO: implement online field?
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

app.post('/logout', passport.authenticate('jwt', { session: false }), async (req, res) => {
    try {
      // set online to false
      await db.collection('Artisan').updateOne({ _id: ObjectId(req.user._id)}, { $set: { online: false } });
      res.json({ success: true, msg: 'Successfully logged out.' });
      return;

    } catch (err) {      
      res.json({ success: false, error: { code: '400', msg: 'Error.' }});
    }
});

app.post('/forgotPassword', async (req, res) => {
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

app.post('/resetPassword/:id/:hashtoken', async (req, res) => {
  const { id, hashtoken } = req.params;
  const { password } = req.body;

  // error 404 if token corresponding to user with {id} does not exist
  const token = await db.collection('Token').findOne({ artisan: ObjectId(id) });
  if (!token) {
    res.json({ success: false, error: { code: '404', msg: 'Token expired or does not exist.' }});
    return;
  }

  // error 401 if token expired
  if (!(new Date(token.expires) > Date.now())) {
    await db.collection('Token').deleteMany({ artisan: ObjectId(id) });
    res.json({ success: false, error: { code: '401', msg: 'Token expired' }});
    return;
  }

  // error if password does not satisfy security requirements
  if (!password.match(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,50}$/)) {
    res.json({success: false, error: {code: '400', msg: 'Password format invalid.'}});
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

app.post('/forgotUsername', async (req, res) => {
  const { email } = req.body;
  const user = await db.collection('Artisan').findOne({ email: email });

  // error 404 if user does not exist
  if (!user) {
    res.json({ success: false, error: { code: '404', msg: 'User with specified email does not exist.' }});
    return;
  }

  try {
    sendmail({
      to: user.email,
      from: 'no-reply@artisan.com',
      subject: 'Artisan Username Request',
      html: `
        <h2> Hi ${user.username}! </h2>
        <p>You recently requested the username associated with your Artisan account.</p>
        <p>Your username is <scan>${user.username}</scan>.</p>
      `
    }, (err, info) => {
      if (err) {
        res.json({ success: false, error: { code: '400', msg: 'Error sending email.' }});
        return;
      } else {
        res.json({ success: true, message: 'Email sent.', info: info });
        return;
      }
    });
  } catch (err) {
    res.json({ success: false, error: { code: '400', msg: 'Error.' }});
  }
});

/** ---------------------
 * PROFILE SETTINGS ROUTES 
 * ---------------------- 
 */
app.post('/changeUsername', passport.authenticate('jwt', { session: false }), async (req, res) => {
  const { password, username } = req.body;
  const user = req.user;

  // error 400 if all inputs not included
  if (!username || !password) {
    res.json({success: false, error: {code: '400', msg: 'Request malformed: Please include all fields.' }});
    return;
  }

  // error 409 if username matches current username
  if (username === user.username) {
    res.json({success: false, error: {code: '409', msg: 'Same username chosen.' }});
    return;
  }

  // error 409 if username already exists
  const usernameExists = await db.collection('Artisan').findOne({ username: username });
  if (usernameExists) {
    res.json({ success: false, error: {code: '409', msg: 'Username already exists.' }});
    return;
  }

  try {
    // compare passwords
    const matches = await bcrypt.compare(password, user.password);
    if (matches) {
      // change the username
      await db.collection('Artisan').updateOne({ username: user.username }, { $set: { username: username } });
      res.json({ success: true, newUsername: username });
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

app.post('/changePassword', passport.authenticate('jwt', { session: false }), async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  const user = req.user;

  // error 400 if all inputs not included
  if (!oldPassword || !newPassword) {
    res.json({success: false, error: {code: '400', msg: 'Request malformed: Please include all fields.' }});
    return;
  }

  // error if password does not satisfy security requirements
  if (!newPassword.match(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,50}$/)) {
    res.json({success: false, error: {code: '400', msg: 'Password format invalid.'}});
    return;
  }
  
  try {
    const matches = await bcrypt.compare(oldPassword, user.password);
    if (matches) {
      // hash new password
      bcrypt.hash(newPassword, 10, async (err, hashPass) => {
        if (err) {
          res.json({ success: false, error: { code: '400', msg: 'Error hashing new password.' }});
          return;
        }
        
        // update password
        await db.collection('Artisan').updateOne( {_id: ObjectId(user._id) }, { $set: { password: hashPass } });

        // return user token
        res.json({ success: true, newPassword: hashPass, message: 'Password successfully reset.' });
        return;
      });
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

// endpoint for uploading profile photo

// endpoint for uploading cover photo

app.post('/changeTitle', passport.authenticate('jwt', { session: false }), async (req, res) => {
  const { title } = req.body;
  const user = req.user;

  try {
    // if title not given or title length is 0, clear title field
    if (!title) {
      await db.collection('Artisan').updateOne({ _id: ObjectId(user._id)}, { $set: { title: '' }});
      res.json({success: true, title: title, msg: 'Title successfully cleared.' });
      return;
    }

    // error 400 if title is too long
    if (title.length > 32) {
      res.json({ success: false, error: { code: '400', msg: 'Title is too long.' } });
      return
    }

    // update database
    await db.collection('Artisan').updateOne({ _id: ObjectId(user._id)}, { $set: { title: title }});
    res.json({success: true, title: title, msg: 'Title successfully reset.' });
    return;

  } catch (err) {
    res.json({ success: false, error: {code: '400', msg: 'Error.' }});
    return;
  }
});

app.post('/changeBio', passport.authenticate('jwt', { session: false }), async (req, res) => {
  const { bio } = req.body;
  const user = req.user;

  console.log(bio);
  try {
    // if bio not given or bio length is 0, clear bio field
    if (!bio) {
      console.log('no bio');
      await db.collection('Artisan').updateOne({ _id: ObjectId(user._id)}, { $set: { bio: '' }});
      res.json({success: true, bio: bio, msg: 'Bio successfully cleared.' });
      return;

    } else {
      console.log('bio');
      await db.collection('Artisan').updateOne({ _id: ObjectId(user._id)}, { $set: { bio: bio }});
      res.json({success: true, bio: bio, msg: 'Bio successfully reset.' });
      return;
    }
  } catch (err) {
    res.json({ success: false, error: {code: '400', msg: 'Error.' }});
    return;
  }
});

app.post('/deactivate', passport.authenticate('jwt', { session: false }), async (req, res) => {
  const { password } = req.body;
  const user = req.user;

  // error 400 if all inputs not included
  if (!password) {
    res.json({ success: false, error: { code: '400', msg: 'Request malformed: Please include your password.' } });
    return;
  }

  try {
    // deactivate user if password matches
    const matches = await bcrypt.compare(password, user.password);
    if (matches) {
      await db.collection('Artisan').updateOne({ _id: ObjectId(user._id) }, { $set: { deactivated: true } });
      res.json({ success: true, msg: 'Successfully deactivated.' });
      return;

    } else {      
      // status 401 if password does not match
      res.json({ success: false, error: { code: '401', msg: 'Invalid password.' }});
      return;
    }
  } catch(err) {
    res.json({ success: false, error: {code: '400', msg: 'Error.' }});
    return;
  }
});

app.post('/changePrivacy', passport.authenticate('jwt', { session: false }), async (req, res) => {
  const { private } = req.body;
  const user = req.user;

  // error 400 if all inputs not included
  if (private == null) {
    res.json({ success: false, error: { code: '400', msg: 'Request malformed: Missing field provided.' } });
    return;
  }

  try {
    // update user privacy settings
    await db.collection('Artisan').updateOne({ _id: ObjectId(user._id) }, { $set: { private: private } });
    res.json({ success: true, msg: 'Successfully reset privacy settings.' });
    return;
  } catch(err) {
    res.json({ success: false, error: {code: '400', msg: 'Error.' }});
    return;
  }
});

app.post('/changeHidden', passport.authenticate('jwt', { session: false }), async (req, res) => {
  const { hidden } = req.body;
  const user = req.user;

  // error 400 if all inputs not included
  if (hidden == null) {
    res.json({ success: false, error: { code: '400', msg: 'Request malformed: Missing field provided.' } });
    return;
  }

  try {
    // update user hidden settings
    await db.collection('Artisan').updateOne({ _id: ObjectId(user._id) }, { $set: { hidden: hidden } });
    res.json({ success: true, msg: 'Successfully reset hidden settings.' });
    return;
  } catch(err) {
    res.json({ success: false, error: {code: '400', msg: 'Error.' }});
    return;
  }
});

/** ---------------------
 * COLLECTION ROUTES 
 * ---------------------- 
 */
// new collection
app.post('/collection', passport.authenticate('jwt', { session: false }), async (req, res) => {
  const { name, hidden, private } = req.body;
  const user = req.user;

  // error 400 when name field not provided
  if (!name || hidden == null || private == null) {
    res.json({ success: false, error: { code: '400', msg: 'Must provide a name and privacy setting for the collection.' } });
    return;
  }

  // error 400 if name too long
  if (name.length > 30) {
    res.json({ success: false, error: { code: '400', msg: 'Name must have at most 30 characters.' } });
    return;
  }

  const collection = {
    name: name,
    artisan: user._id,
    artifacts: [],
    hidden: hidden,
    private: private,
  }

  try {
    const inserted = await db.collection('Collection').insertOne(collection);
    res.json({ success: true, collection: inserted.ops[0], msg: 'Successfully created new collection.' });
  } catch (err) {
    res.json({ success: false, error: {code: '400', msg: 'Error.' }});
    return;
  }
});

// get collection data
app.get('/collection/:collectionID', async (req, res) => {
  const { collectionID } = req.params;

  // error 404 if collection doesn't exist
  const collection = await db.collection('Collection').findOne({ _id: ObjectId(collectionID) });
  if (!collection) {
    res.json({ success: false, error: { code: '404', msg: `Collection ${collectionID} does not exist.` } });
    return;
  }

  // if collection is not hidden, return collection data (anyone can view)
  if (!collection.hidden) {
    res.json({ success: true, collection: collection, msg: 'Successfully retrieve collection.' });
    return;
  }

  // collection is hidden --> check authorization details
  const { authorization } = req.headers;
  if (authorization && authorization.split(' ')[0] === 'Bearer') {
    const token = authorization.split(' ')[1];
    try {
      // id of logged-in user
      const { id } = jwt.verify(token, process.env.JWT_KEY);

      // return collection if logged-in user is owner
      if (ObjectId(id).equals(ObjectId(collection.artisan))) {
        res.json({ success: true, collection: collection, msg: 'Successfully retrieve collection.' });
        return;
      }
      
      // return collection if collection is not private and logged-in user is an admirer
      if (!collection.private) {
        const isAdmirer = await db.collection('Artisan').findOne({ _id: ObjectId(collection.artisan), admirers: ObjectId(id) });
        if (isAdmirer) {
          res.json({ success: true, collection: collection, msg: 'Successfully retrieve collection.' });
          return;
        }
      }
      
      // error 401 if collection is private or user is not an admirer
      res.json({ success: false, error: { code: '401', msg: `You do not have permission to view Collection ${collectionID}.` } });
      return;
    } catch (err) {
      res.json({ success: false, error: { code: '400', msg: `${err}` } });
      return;
    }      
  } else {
    res.json({ success: false, error: { code: '401', msg: `Collection ${collectionID} cannot be viewed. No authorization.` } });
    return;
  }
});

// add artifact to collection
app.post('/collection/:collectionID/insert', passport.authenticate('jwt', { session: false }), async (req, res) => {
  const { collectionID } = req.params;
  const { artifact } = req.body;
  const user = req.user;

  try {
    // error 400 if missing fields
    if (!collectionID || !artifact) {
      res.json({ success: false, error: { code: '400', msg: 'You must provide both a collection and artifact.' } });
      return;
    }

    // error 404 if collection does not exist
    const collection = await db.collection('Collection').findOne({ _id: ObjectId(collectionID) });
    if (!collection) {
      res.json({ success: false, error: { code: '404', msg: 'This collection does not exist.' } });
      return;
    }

    // error 401 if user does not own collection
    if (!ObjectId(user._id).equals(ObjectId(collection.artisan))) {
      res.json({ success: false, error: { code: '401', msg: 'Only creator of this collection can add artifacts to it.' } });
      return;
    }

    // error 404 if artifact does not exist
    const artifactExists = await db.collection('Artifact').findOne({ _id: ObjectId(artifact) });
    if (!artifactExists) {
      res.json({ success: false, error: { code: '404', msg: 'This artifact does not exist.' } });
      return;
    }

    // error 409 if collection already contains this artifact
    if (collection.artifacts.includes(artifact)) {
      res.json({ success: false, error: { code: '409', msg: 'This collection already contains this artifact.' } });
      return;
    }

    await db.collection('Collection').updateOne({ _id: ObjectId(collectionID) }, { $push: { artifacts: artifact } });
    res.json({ success: true, msg: 'Successfully added artifact to collection.' });
    
  } catch (err) {
    res.json({ success: false, error: {code: '400', msg: 'Error.' }});
    return;
  }
});

// remove artifact from collection
app.post('/collection/:collectionID/remove', passport.authenticate('jwt', { session: false }), async (req, res) => {
  const { collectionID } = req.params;
  const { artifact } = req.body;
  const user = req.user;

  try {
    // error 400 if missing fields
    if (!collectionID || !artifact) {
      res.json({ success: false, error: { code: '400', msg: 'You must provide both a collection and artifact.' } });
      return;
    }

    // error 404 if collection does not exist
    const collection = await db.collection('Collection').findOne({ _id: ObjectId(collectionID) });
    if (!collection) {
      res.json({ success: false, error: { code: '404', msg: 'This collection does not exist.' } });
      return;
    }

    // error 401 if user does not own collection
    if (!ObjectId(user._id).equals(ObjectId(collection.artisan))) {
      res.json({ success: false, error: { code: '401', msg: 'Only creator of this collection can add artifacts to it.' } });
      return;
    }

    // error 404 if artifact does not exist
    const artifactExists = await db.collection('Artifact').findOne({ _id: ObjectId(artifact) });
    if (!artifactExists) {
      res.json({ success: false, error: { code: '404', msg: 'This artifact does not exist.' } });
      return;
    }

    // error 409 if collection already contains this artifact
    if (!collection.artifacts.includes(artifact)) {
      res.json({ success: false, error: { code: '409', msg: 'This collection does not contain this artifact.' } });
      return;
    }

    await db.collection('Collection').updateOne({ _id: ObjectId(collectionID) }, { $pull: { artifacts: artifact } });
    res.json({ success: true, msg: 'Successfully removed artifact from collection.' });
    
  } catch (err) {
    res.json({ success: false, error: {code: '400', msg: 'Error.' }});
    return;
  }
});

// rename collection
app.post('/collection/:collectionID/rename', passport.authenticate('jwt', { session: false }), async (req, res) => {
  const { collectionID } = req.params;
  const { name } = req.body;
  const user = req.user;

  // error 400 if name not provided
  if (!name) {
    res.json({ success: false, error: { code: '400', msg: 'You must provide both a new name.' } });
    return;
  }

  // error 400 if name too long
  if (name.length > 30) {
    res.json({ success: false, error: { code: '400', msg: 'Name must have at most 30 characters.' } });
    return;
  }

  try {
    const collection = await db.collection('Collection').findOne({ _id: ObjectId(collectionID) });

    // error 404 if collection does not exist
    if (!collection) {
      res.json({ success: false, error: { code: '404', msg: 'This collection does not exist.' } });
      return;
    }

    // error 401 if user is not the owner of the collection
    if (!ObjectId(collection.artisan).equals(ObjectId(user._id))) {
      res.json({ success: false, error: { code: '401', msg: 'Only creator of this collection can rename it.' } });
      return;
    }

    await db.collection('Collection').updateOne({ _id: ObjectId(collectionID) }, { $set: { name: name } });
    res.json({ success: true, new_name: name, msg: 'Successfully renamed collection.' });
    return;
  } catch (err) {
    res.json({ success: false, error: {code: '400', msg: `Error: ${err}.` }});
    return;
  }
});

// change privacy
app.post('/collection/:collectionID/privacy', passport.authenticate('jwt', { session: false }), async (req, res) => {
  const { collectionID } = req.params;
  const { hidden, private } = req.body;
  const user = req.user;

  // error 400 if name not provided
  if (hidden == null || private == null) {
    res.json({ success: false, error: { code: '400', msg: 'You must provide a privacy setting.' } });
    return;
  }

  try {
    const collection = await db.collection('Collection').findOne({ _id: ObjectId(collectionID) });

    // error 404 if collection does not exist
    if (!collection) {
      res.json({ success: false, error: { code: '404', msg: 'This collection does not exist.' } });
      return;
    }

    // error 401 if user is not the owner of the collection
    if (!ObjectId(collection.artisan).equals(ObjectId(user._id))) {
      res.json({ success: false, error: { code: '401', msg: 'Only creator of this collection can rename it.' } });
      return;
    }

    await db.collection('Collection').updateOne({ _id: ObjectId(collectionID) }, { $set: { hidden: hidden, private: private } });
    res.json({ success: true, hidden: hidden, private: private, msg: 'Successfully changed privacy settings of collection.' });
    return;
  } catch (err) {
    res.json({ success: false, error: {code: '400', msg: `Error: ${err}.` }});
    return;
  }
});

// delete collection
app.delete('/collection/:collectionID', passport.authenticate('jwt', { session: false }), async (req, res) => {
  const { collectionID } = req.params;
  const user = req.user;

  try {
    // error 400 if missing fields
    if (!collectionID) {
      res.json({ success: false, error: { code: '400', msg: 'You must provide a collection to delete.' } });
      return;
    }

    // error 404 if collection does not exist
    const collection = await db.collection('Collection').findOne({ _id: ObjectId(collectionID) });
    if (!collection) {
      res.json({ success: false, error: { code: '404', msg: 'This collection does not exist.' } });
      return;
    }

    // error 401 if user does not own collection
    if (!ObjectId(user._id).equals(ObjectId(collection.artisan))) {
      res.json({ success: false, error: { code: '401', msg: 'Only creator of this collection can delete it.' } });
      return;
    }

    await db.collection('Collection').deleteOne({ _id: ObjectId(collectionID) });
    res.json({ success: true, msg: 'Successfully removed collection.' });
    
  } catch (err) {
    res.json({ success: false, error: {code: '400', msg: `Error: ${err}.` }});
    return;
  }
});

/** ---------------------
 * SKETCHBOOK ROUTES 
 * ---------------------- 
 */
// create sketchbook
app.post('/sketchbook', passport.authenticate('jwt', { session: false }), async (req, res) => {
  const { title, view } = req.body;
  const user = req.user;

  // error 400 if view or title not provided
  if (!view || !title) {
    res.json({ success: false, error: { code: '400', msg: 'You must provide a privacy setting and title.' } });
    return;
  }

  // error 400 if view is not All, Private, or Only Me
  if (view !== 'public' && view !== 'private' && view !== 'only me') {
    res.json({ success: false, error: { code: '400', msg: 'Privacy setting invalid.' } });
    return;
  }

  // error 400 if title is too long
  if (title.length > 30) {
    res.json({ success: false, error: { code: '400', msg: 'Title too long.' } });
    return;
  }

  // initialize page objects
  let pages = new Array(50);  
  for (let i = 0; i < 50; i++) {
    const page = {
      num: i,
      title: '',
      sketch: '',
      nsfw: false,
      date: new Date(),
    };

    pages[i] = page;
  }  

  // initialize sketchbook object
  const sketchbook = {
    owner: user._id,
    title: title,
    cover: '',
    date_created: new Date(),
    last_updated: new Date(),
    who_can_view: view,
    views: 0,
    pages: pages,
  };

  try {
    await db.collection('Sketchbook').insertOne(sketchbook);
    res.json({ success: true, sketchbook: sketchbook, msg: 'Successfully created sketchbook.' });
  } catch (err) {
    res.json({ success: false, error: {code: '400', msg: `Error: ${err}.` }});
    return;
  }
});

// get sketchbook data
app.get('/sketchbook/:sketchbookID', passport.authenticate('jwt', { session: false }), async (req, res) => {
  const { sketchbookID } = req.params;
  const user = req.user;

  try {
    const sketchbook = await db.collection('Sketchbook').findOne({ _id: ObjectId(sketchbookID) });
    // error 404 if sketchbook does not exist
    if (!sketchbook) {
      res.json({ success: false, error: { code: '404', msg: 'This sketchbook does not exit.' } });
      return;
    }

    const view = sketchbook.who_can_view;
    // if sketchbook is public or user is owner of sketchbook, return sketchbook data
    if (view === 'public' || ObjectId(sketchbook.owner).equals(ObjectId(user._id))) {
      res.json({ success: true, sketchbook: sketchbook, msg: 'Successfully retrieved sketchbook.' });
      return;
    }

    // if sketchbook is private and user is an admirer of the owner
    if (view === 'private') {
      const isFollower = await db.collection('Artisan').findOne({ _id: ObjectId(sketchbook.owner), admirers: ObjectId(user._id) });
      if (isFollower) {
        res.json({ success: true, sketchbook: sketchbook, msg: 'Successfully retrieved sketchbook.' });
        return;
      }
    }

    // error 401 if unauthorized to view the sketchbook
    res.json({ success: false, error: {code: '401', msg: 'You cannot view this sketchbook.' } });
    return;

  } catch (err) {
    res.json({ success: false, error: {code: '400', msg: `Error: ${err}.` } });
    return;
  }
});

// rename sketchbook
app.post('/sketchbook/:sketchbookID/rename', passport.authenticate('jwt', { session: false }), async (req, res) => {
  const user = req.user;
  const { sketchbookID } = req.params;
  const { title } = req.body;

  // error 400 if title was not provided
  if (!title) {
    res.json({ success: false, error: { code: '400', msg: 'Must provide a new title.' } });
    return;
  }

  // error 400 if title is too long
  if (title.length > 30) {
    res.json({ success: false, error: { code: '400', msg: 'Title too long.' } });
    return;
  }

  try {
    const sketchbook = await db.collection('Sketchbook').findOne({ _id: ObjectId(sketchbookID) });
    // error 404 if sketchbook does not exist
    if (!sketchbook) {
      res.json({ success: false, error: { code: '404', msg: 'Sketchbook does not exist.' } });
      return;
    }

    // error 401 if user is not hte owner of this sketchbook
    if (!ObjectId(user._id).equals(ObjectId(sketchbook.owner))) {
      res.json({ success: false, error: { code: '401', msg: 'Only the owner of this sketchbook can rename it.' } });
      return;
    }

    await db.collection('Sketchbook').updateOne({ _id: ObjectId(sketchbookID) }, { $set: { title: title } });
    res.json({ success: true, updated: title, msg: 'Successfully renamed sketchbook.' });

  } catch (err) {
    res.json({ success: false, error: {code: '400', msg: `Error: ${err}.` }});
    return;
  }
});

// new cover sketchbook
app.post('/sketchbook/:sketchbookID/cover', passport.authenticate('jwt', { session: false }), async (req, res) => {

});

// change privacy of sketchbook
app.post('/sketchbook/:sketchbookID/privacy', passport.authenticate('jwt', { session: false }), async (req, res) => {
  const user = req.user;
  const { sketchbookID } = req.params;
  const { view } = req.body;

  // error 400 if title was not provided
  if (view !== 'public' && view !== 'private' && view !== 'only me') {
    res.json({ success: false, error: { code: '400', msg: 'View must be public, private, or only me.' } });
    return;
  }

  try {
    const sketchbook = await db.collection('Sketchbook').findOne({ _id: ObjectId(sketchbookID) });
    // error 404 if sketchbook does not exist
    if (!sketchbook) {
      res.json({ success: false, error: { code: '404', msg: 'Sketchbook does not exist.' } });
      return;
    }

    // error 401 if user is not hte owner of this sketchbook
    if (!ObjectId(user._id).equals(ObjectId(sketchbook.owner))) {
      res.json({ success: false, error: { code: '401', msg: 'Only the owner of this sketchbook can rename it.' } });
      return;
    }

    await db.collection('Sketchbook').updateOne({ _id: ObjectId(sketchbookID) }, { $set: { who_can_view: view } });
    res.json({ success: true, updated: view, msg: 'Successfully updated privacy of sketchbook.' });

  } catch (err) {
    res.json({ success: false, error: {code: '400', msg: `Error: ${err}.` }});
    return;
  }
});

// delete sketchbook
app.delete('/sketchbook/:sketchbookID', passport.authenticate('jwt', { session: false }), async (req, res) => {
  const { sketchbookID } = req.params;
  const user = req.user;

  try {
    const sketchbook = await db.collection('Sketchbook').findOne({ _id: ObjectId(sketchbookID) });
    // error 404 if sketchbook does not exist
    if (!sketchbook) {
      res.json({ success: false, error: { code: '404', msg: 'Sketchbook does not exist.' } });
      return;
    }

    // error 401 if user is not hte owner of this sketchbook
    if (!ObjectId(user._id).equals(ObjectId(sketchbook.owner))) {
      res.json({ success: false, error: { code: '401', msg: 'Only the owner of this sketchbook can rename it.' } });
      return;
    }

    // delete sketchbook from db
    await db.collection('Sketchbook').deleteOne({ _id: ObjectId(sketchbookID) });
    res.json({ success: true, msg: 'Successfully deleted sketchbook.' });

  } catch (err) {
    res.json({ success: false, error: {code: '400', msg: `Error: ${err}.` }});
    return;
  }
});

// get sketchbook page data
app.get('/sketchbook/:sketchbookID/page/:pageNum', passport.authenticate('jwt', { session: false }), async (req, res) => {
  const { sketchbookID } = req.params;
  const pageNum = parseInt(req.params.pageNum);
  const user = req.user;

  // error 400 if page out of bounds
  if (pageNum < 1 || pageNum > 50) {
    res.json({ success: false, error: { code: '400', msg: 'Please select a page from 1 to 50.' } });
    return;
  }

  try {
    const sketchbook = await db.collection('Sketchbook').findOne({ _id: ObjectId(sketchbookID) });
    // error 404 if sketchbook does not exist
    if (!sketchbook) {
      res.json({ success: false, error: { code: '404', msg: 'This sketchbook does not exit.' } });
      return;
    }
    
    // get sketchbook page
    const page = sketchbook.pages[pageNum - 1];

    const view = sketchbook.who_can_view;
    // if sketchbook is public or user is owner of sketchbook, return sketchbook data
    if (view === 'public' || ObjectId(sketchbook.owner).equals(ObjectId(user._id))) {
      res.json({ success: true, page: page, msg: 'Successfully retrieved sketchbook page.' });
      return;
    }

    // if sketchbook is private and user is an admirer of the owner
    if (view === 'private') {
      const isFollower = await db.collection('Artisan').findOne({ _id: ObjectId(sketchbook.owner), admirers: ObjectId(user._id) });
      if (isFollower) {
        res.json({ success: true, page: page, msg: 'Successfully retrieved sketchbook page.' });
        return;
      }
    }

    // error 401 if unauthorized to view the sketchbook
    res.json({ success: false, error: {code: '401', msg: 'You cannot view this sketchbook.' } });
    return;

  } catch (err) {
    res.json({ success: false, error: {code: '400', msg: `Error: ${err}.` } });
    return;
  }
});

app.post('/sketchbook/:sketchbookID/page/:pageNum/title', passport.authenticate('jwt', { session: false }), async (req, res) => {
  const { title } = req.body;
  const { sketchbookID } = req.params;
  const pageNum = parseInt(req.params.pageNum) - 1;
  const user = req.user;

  if (!title) {
    res.json({ success: false, error: { code: '400', msg: 'You must provide a new title.' } });
    return;
  }

  if (title.length > 30) {
    res.json({ success: false, error: { code: '400', msg: 'The title you provided is too long.' } });
    return;
  }

  if (pageNum < 0 || pageNum > 49) {
    res.json({ success: false, error: { code: '400', msg: 'Please select a page from 1 to 50.' } });
    return;
  }

  try {
    const sketchbook = await db.collection('Sketchbook').findOne({ _id: ObjectId(sketchbookID) });
    if (!sketchbook) {
      res.json({ success: false, error: { code: '404', msg: 'Sketchbook does not exist.' } });
      return;
    }

    if (!ObjectId(sketchbook.owner).equals(Object(user._id))) {
      res.json({ success: false, error: { code: '401', msg: 'You do not have permission to edit this page.' } });
      return;
    }

    const options = {
      arrayFilters: [{
        'orderItem.num': pageNum,
      }]
    };

    await db.collection('Sketchbook').updateOne({ _id: ObjectId(sketchbookID) }, { $set: { 'pages.$[orderItem].title' : title } }, options);
    res.json({ success: true, newTitle: title, msg: 'Successfully retitled page.' });

  } catch (err) {
    res.json({ success: false, error: {code: '400', msg: `Error: ${err}.` } });
    return;
  }
});

app.post('/sketchbook/:sketchbookID/page/:pageNum/nsfw', passport.authenticate('jwt', { session: false }), async (req, res) => {
  const { nsfw } = req.body;
  const { sketchbookID } = req.params;
  const pageNum = parseInt(req.params.pageNum) - 1;
  const user = req.user;

  if (nsfw == null) {
    res.json({ success: false, error: { code: '400', msg: 'You must provide a new title.' } });
    return;
  }

  if (pageNum < 0 || pageNum > 49) {
    res.json({ success: false, error: { code: '400', msg: 'Please select a page from 1 to 50.' } });
    return;
  }

  try {
    const sketchbook = await db.collection('Sketchbook').findOne({ _id: ObjectId(sketchbookID) });
    if (!sketchbook) {
      res.json({ success: false, error: { code: '404', msg: 'Sketchbook does not exist.' } });
      return;
    }

    // error 409 if there is nothing to update
    if (sketchbook.pages[pageNum].nsfw === nsfw) {
      res.json({ success: false, error: {code: '409', msg: 'These are your current settings.' } });
      return;
    }

    if (!ObjectId(sketchbook.owner).equals(Object(user._id))) {
      res.json({ success: false, error: { code: '401', msg: 'You do not have permission to edit this page.' } });
      return;
    }

    const options = {
      arrayFilters: [{
        'orderItem.num': pageNum,
      }]
    };

    await db.collection('Sketchbook').updateOne({ _id: ObjectId(sketchbookID) }, { $set: { 'pages.$[orderItem].nsfw' : nsfw } }, options);
    res.json({ success: true, nsfw: nsfw, msg: 'Successfully changed nsfw settings for page.' });

  } catch (err) {
    res.json({ success: false, error: {code: '400', msg: `Error: ${err}.` } });
    return;
  }
});

app.post('/sketchbook/:sketchbookID/page/:pageNum/upload', passport.authenticate('jwt', { session: false }), async (req, res) => {

});


/** ---------------------
 * SKETCHBOOK ROUTES 
 * ---------------------- 
 */
app.post('/artifact', passport.authenticate('jwt', { session: false }), async (req, res) => {
  const { url, title, note, tags } = req.body;
  const user = req.user;

  if (!url || !title | !tags ) {
    res.json({ success: false, error: { code: '400', msg: 'Missing fields provided.' } });
    return;
  }

  if (title.length > 40) {
    res.json({ success: false, error: { code: '400', msg: 'Title cannot be more than 40 characters.' } });
    return;
  }

  try {
    const artifact = {
      artisan: user._id,
      url: url,
      title: title,
      admirers: [],
      note: note,
      date: new Date(),
      tags: tags,
    }

    await db.collection('Artifact').insertOne(artifact);
    res.json({ success: true, artifact: artifact, msg: 'Artifact successfully created.' });

  } catch (err) {
    res.json({ success: false, error: { code: '400', msg: `Error: ${err}.` } });
    return;
  }  
});

// get artifact
app.get('/artifact/:artifactID', async (req, res) => {
  const { artifactID } = req.params;

  try {
    const artifact = await db.collection('Artifact').findOne({ _id: ObjectId(artifactID) });
    // error 404 if artifact does not exist
    if (!artifact) {
      res.json({ success: false, error: { code: '404', msg: 'Artifact does not exist' }});
      return;
    }

    // return data if artisan profile is public
    const artisan = await db.collection('Artisan').findOne({ _id: ObjectId(artifact.artisan) });
    if (!artisan.private) {
      res.json({ success: true, artifact: artifact, msg: 'Successfully retrieve artifact data.' });
      return;
    }  
    
    // if artisan profile is not public, check authorization details
    const { authorization } = req.headers;
    if (authorization && authorization.split(' ')[0] === 'Bearer') {
      const token = authorization.split(' ')[1];
      // id of logged-in user
      const { id } = jwt.verify(token, process.env.JWT_KEY);
    
      // return artifact if logged-in user is artisan
      if (ObjectId(id).equals(ObjectId(artifact.artisan))) {
        res.json({ success: true, collection: collection, msg: 'Successfully retrieve artifact.' });
        return;
      }

      const isAdmirer = await db.collection('Artisan').findOne({ _id: ObjectId(artifact.artisan), admirers: ObjectId(id).toString() });
      if (isAdmirer) {
        res.json({ success: true, artifact: artifact, msg: 'Successfully retrieve artifact.' });
        return;
      }
    }
      
    // error 401 user is not an admirer
    res.json({ success: false, error: { code: '401', msg: `You do not have permission to view artifact ${artifactID}.` } });
    return;
  } catch (err) {
    res.json({ success: false, error: { code: '400', msg: `Error: ${err}.` } });
    return;
  }
});

// like or unlike artifact 
app.post('/artifact/:artifactID', passport.authenticate('jwt', { session: false }), async (req, res) => {
  const { artifactID } = req.params;
  const user = req.user;

  try {
    const artifact = await db.collection('Artifact').findOne({ _id: ObjectId(artifactID) });
    // error 404 if artifact does not exist
    if (!artifact) {
      res.json({ success: false, error: { code: '404', msg: 'Artifact does not exist.' } });
      return;
    }

    // return data if artisan profile is public
    const artisan = await db.collection('Artisan').findOne({ _id: ObjectId(artifact.artisan) });
    const isAdmirer = artisan.admirers.includes(ObjectId(user._id).toString());

    // if artisan is the author or profile is public or user is an admirer
    if (!artisan.private || isAdmirer || ObjectId(user._id).equals(ObjectId(artifact.artisan))) {
      // error 409 if user is already admiring this artifact
      const admiring = artifact.admirers.includes(ObjectId(user._id).toString());
      const favoriting = user.favorites.includes(artifactID);

      // if user can only unlike
      if (admiring || favoriting) {
        // remove artisan from admirers of Artifact and remove artifact from favorites of artisan
        await db.collection('Artifact').updateOne({ _id: ObjectId(artifactID) }, { $pull: { admirers: ObjectId(user._id).toString() } });  
        await db.collection('Artisan').updateOne({ _id: ObjectId(user._id) }, { $pull: { favorites: artifactID } });
        res.json({ success: true, msg: 'Successfully removed from admiring.' });
        return;
        
        // else if user can only like
      } else {
        // add artisan to admirers of Artifact and add artifact to favorites of artisan
        await db.collection('Artifact').updateOne({ _id: ObjectId(artifactID) }, { $push: { admirers: ObjectId(user._id).toString() } });  
        await db.collection('Artisan').updateOne({ _id: ObjectId(user._id) }, { $push: { favorites: artifactID } });
        res.json({ success: true, msg: 'Successfully admired artifact.' });
        return;
      }
    }

    // error 401 if not permitted
    res.json({ success: false, error: { code: '401', msg: 'You do not have permission to admire this artifact.' }});
    return;
  } catch (err) {
    res.json({ success: false, error: { code: '400', msg: `Error: ${err}.` } });
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
