const express = require('express');
const bodyParser = require('body-parser');        // parsing body of HTTP requests
const util = require('util');
const mysql = require('mysql');
var cors = require('cors');
const passport = require('passport');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');       // allows us to sign token and verify
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const aws = require('aws-sdk');
const fs = require('fs');
const multer = require('multer')
const upload = multer({ dest: 'uploads/' })

const config = require('./config.json');
const db = require('./db');
const { Console } = require('console');
const app = express();
const query = util.promisify(db.query).bind(db);

const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ credentials: true, origin: ['http://localhost:3000'] }));

const s3 = new aws.S3({
    accessKeyId: config.s3_access_key,
    secretAccessKey: config.s3_secret_key,
    region: config.s3_region,
});

function currDate() {
    const d = new Date();
    return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
}

function getMonth(month) {
    for (let i = 0; i < months.length; i++) {
        if (months[i] == month) {
            return i;
        }
    }
    return -1;
}

// connect server to port and database
app.listen(config.server_port, () => {
    db.connect((err) => {
        if (err) throw err;
        console.log('Database connected.');
    });;
    console.log(`Server running at http://${config.server_host}:${config.server_port}/`);
});

// options to control how token is extracted from request or verified
const opts = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: config.jwt_key,
};

// passport use JwtStrategy to extract token from header and sends user associated with token
passport.use(new JwtStrategy(opts, async function (payload, done) {
    try {
        const result = await query(`SELECT * FROM User WHERE id=${payload.id}`);
        console.log("Validating...", payload.id);
        if (result.length > 0) {
            const user = result[0];
            return done(null, user);
        } else {
            res.json({ success: false, error: { code: '401', msg: 'Invalid token.' } });
            return done(null, false);
        }
    } catch (err) {
        return done(err, false);
    }
}));

app.use(passport.initialize());

async function getByUsername(username) {
    try {
        const result = await query(`SELECT * FROM User WHERE username='${username}'`);
        return result.length > 0 ? result[0] : null;
    } catch (err) {
        console.log(err);
        return null;
    }
}

async function getByEmail(email) {
    let sql = `SELECT * FROM User WHERE email='${email}'`;
    try {
        const result = await query(sql);
        return result.length > 0 ? result[0] : null;
    } catch (err) {
        console.log(err);
        return null;
    }
}

app.get('/user/:username', async (req, res) => {
    const user = await getByUsername(req.params.username);
    if (!user) {
        res.json({ success: false });
    } else {
        res.json({ success: true });
    }
});

app.post('/register', async (req, res) => {
    const { username, password, email, birth_month, birth_day, birth_year } = req.body;
    // error if all inputs not included
    if (!username || !password || !email || !birth_month || !birth_day || !birth_year) {
        res.json({ success: false, error: { code: '400', msg: 'Request malformed: Please include all fields.' } });
        return;
    }

    // error if email invalid
    if (!email.match(/\S+@\S+\.\S+/)) {
        res.json({ success: false, error: { code: '400', msg: 'Email invalid.' } });
        return;
    }

    // error if password does not satisfy security requirements
    if (!password.match(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,50}$/)) {
        res.json({ success: false, error: { code: '400', msg: 'Password format invalid.' } });
        return;
    }

    // error if birthdate invalid
    const birthDate = `${birth_year}-${getMonth(birth_month) + 1}-${birth_day}`;

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
            pfp_url: null,
            private: false,
        };

        // save user to database
        let sql = `INSERT INTO User (username, email, password, dob, dor, private, pfp_url)
                   VALUES ('${username}', '${email}', '${hashPass}', '${birthDate}', '${currDate()}', 0, null)`;
        db.query(sql, function (err, result) {
            if (err) {
                // error if user already exists
                if (err.code == 'ER_DUP_ENTRY') {
                    res.json({ success: false, error: { code: '409', msg: 'Conflict: Username or email already exists!' } });
                } else {
                    res.json({ success: false, error: { code: '400', msg: 'Error creating new user.' } });
                }
                return;
            }
            res.json({ success: true, user: user })
            return;
        });
    });
});

app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    // error if all fields not provided
    if (!username || !password) {
        res.json({ success: false, error: { code: '400', msg: 'Username and password field required.' } });
        return;
    }

    // find user; error 404 if username not found in database
    let user;
    let sql = `SELECT * FROM User WHERE username='${username}'`;
    try {
        const result = await query(sql);
        if (result.length == 0) {
            res.json({ success: false, error: { code: '404', msg: 'Username is not registered.' } });
            return;
        }
        user = result[0];
    } catch (err) {
        res.json({ success: false, error: { code: '400', msg: `${err.code}` } });
        return;
    }

    try {
        // compare passwords
        const matches = await bcrypt.compare(password, user.password);
        if (matches) {
            let token = jwt.sign({
                id: user.id,
            }, config.jwt_key, { expiresIn: '3 hours' });

            // return user token
            res.status(200).json({ success: true, token: token });
            return;
        } else {
            // status 401 if password does not match
            res.json({ success: false, error: { code: '401', msg: 'Invalid password.' } });
            return;
        }
    } catch (err) {
        console.log(err);
        res.json({ success: false, error: { code: '400', msg: err.code } });
        return;
    }
});

app.post('/upload', upload.single('file'), async (req, res) => {
    console.log(req.file);
    if (!req.file) {
        res.json({ success: false, error: { code: '400', msg: 'No file selected.' } });
        return;
    }

    const { filename, mimetype, size, path } = req.file;
    // const file = Buffer.from(data, 'binary');

    // image file size limit is 5 MB
    if (size > (5 * 1024 * 1024)) {
        res.json({ success: false, error: { code: '400', msg: 'File size must be under 5 MB.' } });
        return;
    }

    const fileStream = fs.createReadStream(path);

    // Setting up S3 upload parameters
    const params = {
        Bucket: config.s3_bucket,
        ACL: 'public-read',
        Key: `${Date.now()}-${filename}.png`, // File name you want to save as in S3
        Body: fileStream,
    };

    // Uploading files to the bucket
    s3.upload(params, (err, data) => {
        if (err) {
            console.log(err);
            res.json({ success: false, error: { code: '400', msg: `${err.code}` } });
            return;
        } else {
            console.log("Data: ", data);
            res.status(200).json({
                message: 'success',
                location: data.Location,
                type: mimetype,
            });
        }
    });
});

app.post('/createBoard', passport.authenticate('jwt', { session: false }), async (req, res) => {
    const user = req.user;
    const { title } = req.body;
    if (!user) {
        res.json({ success: false, error: { code: '403', msg: 'User not logged in.' } });
        return;
    }

    // throw error if no title
    if (!title) {
        res.json({ success: false, error: { code: '400', msg: 'Request malformed: Please include a title.' } });
        return;
    }

    // throw error if same user already has mood board with this title
    try {
        const result = await query(`SELECT * FROM Board WHERE user_id=${user.id} AND title='${title}'`);
        if (result.length > 0) {
            res.json({ success: false, error: { code: '409', msg: 'Conflict: Mood board with this title already exists.' } });
            return;
        }
    } catch (err) {
        res.json({ success: false, error: { code: '400', msg: err.code } });
        return;
    }

    // create new board instance
    try {
        let sql = `INSERT INTO Board (user_id, title, date_created) VALUES ('${user.id}', '${title}', '${currDate()}');`;
        const result = await query(sql);
        const board = {
            id: result.insertId,
            title: title,
            date: currDate
        }
        res.json({ success: true, board: board })
        return;
    } catch (err) {
        res.json({ success: false, error: { code: '400', msg: err.code } });
        return;
    }
});

// get cards associated with this board
app.get('/board/:id/cards', async (req, res) => {
    // const user = req.user;
    const {id} = req.params;

    // check that board with id exists
    let board;
    try {
        const result = await query(`SELECT * FROM Board WHERE id=${id}`);
        if (result.length == 0) {
            res.json({ success: false, error: { code: '404', msg: `Board ${id} could not be found.` } });
            return;
        } else {
            board = result[0];
            // if (board.user_id != user.id) {
            //     res.json({ success: false, error: { code: '403', msg: `Unauthorized: You do not have permission to view this mood board.` } });
            //     return;
            // }
        }
    } catch (err) {
        res.json({ success: false, error: { code: '400', msg: err.code } });
        return;
    }

    // get and returns cards on this board
    try {
        const result = await query(`SELECT * FROM Card WHERE board_id=${id}`);
        res.json({ success: true, cards: result });
        return;
    } catch (err) {
        res.json({ success: false, error: { code: '400', msg: err.code } });
        return;
    }
});

app.post('/board/:id/add', passport.authenticate('jwt', { session: false }), async (req, res) => {
    const user = req.user;
    const {id} = req.params;
    const { type, url, desc } = req.body;

    if (!type || !url || !desc) {
        res.json({ success: false, error: { code: '400', msg: 'Request malformed: Please include a all fields.' } });
        return;
    }

    if (type != 'color' && type != 'style' && type != 'object') {
        res.json({ success: false, error: { code: '400', msg: 'Request malformed: Invalid type.' } });
        return;
    }

    // check that board with id existss
    let board;
    try {
        const result = await query(`SELECT * FROM Board WHERE id=${id}`);
        if (result.length == 0) {
            res.json({ success: false, error: { code: '404', msg: `Board ${id} could not be found.` } });
            return;
        } else {
            board = result[0];
            if (board.user_id != user.id) {
                res.json({ success: false, error: { code: '403', msg: `Unauthorized: You do not have permission to edit this mood board.` } });
                return;
            }
        }
    } catch (err) {
        res.json({ success: false, error: { code: '400', msg: err.code } });
        return;
    }

    // get count of how many cards already exist
    let num;
    try {
        const result = await query(`SELECT COUNT(*) AS num FROM Card WHERE board_id=${id}`);
        num = result[0].num;
    } catch (err) {
        res.json({ success: false, error: { code: '400', msg: err.code } });
        return;
    }

    // insert card into database
    try {
        let sql = `INSERT INTO Card (num, board_id, type, url, desc_text) VALUES (${num + 1}, '${id}', '${type}', '${url}', '${desc}');`;
        const result = await query(sql);
        const card = {
            num: num + 1,
            board_id: id,
            type,
            url,
            desc,
        };
        res.json({ success: true, card: card });
        return;
    } catch (err) {
        res.json({ success: false, error: { code: '400', msg: err.code } });
        return;
    }
});

app.post('/create', async (req, res) => {
    const { prompt } = req.body;

    try {
        const response = await openai.createImage({
            prompt: prompt,
            n: 1,
            size: '256x256',
        });

        image_url = response.data.data[0].url;
    } catch (err) {
        res.json({ success: false, error: { code: '400', msg: `${err.code}` } });
        return;
    }
});

// Default response for any other request
app.use((_req, res) => {
    res.status(404);
});

module.exports = app;