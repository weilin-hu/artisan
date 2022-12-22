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
const ntc = require('ntcjs');
const { Configuration, OpenAIApi } = require('openai');

const Jimp = require('jimp');

const config = require('./config.json');
const db = require('./db');
const helper = require('./helper.js');
const { Console } = require('console');
const { nextTick } = require('process');
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

const configuration = new Configuration({
    apiKey: config.openai_api_key,
});
const openai = new OpenAIApi(configuration);

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
        console.log("Validating...");
        const result = await query(`SELECT * FROM User WHERE id=${payload.id}`);
        console.log(payload.id);
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
            res.status(200).json({ success: true, token: token, user: user });
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

app.get('/boards', passport.authenticate('jwt', { session: false }), async (req, res) => {
    const user = req.user;
    try {
        const result = await query(`SELECT * FROM Board WHERE user_id=${user.id} ORDER BY id DESC`);
        res.json({ success: true, boards: result });
    } catch (err) {
        res.json({ success: false, error: { code: '400', msg: err.code } });
        return;
    }
});

// get cards associated with this board
app.get('/board/:id/cards', passport.authenticate('jwt', { session: false }), async (req, res) => {
    const user = req.user;
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
            if (board.user_id != user.id) {
                res.json({ success: false, error: { code: '403', msg: `Unauthorized: You do not have permission to view this mood board.` } });
                return;
            }
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

app.get('/board/:id/card/:num/palette', passport.authenticate('jwt', { session: false }), async (req, res) => {
    const user = req.user;
    const { id, num } = req.params;

    // check that board with id exists
    try {
        const result = await query(`SELECT * FROM Board WHERE id=${id}`);
        if (result.length == 0) {
            res.json({ success: false, error: { code: '404', msg: `Board ${id} could not be found.` } });
            return;
        } else {
            if (result[0].user_id != user.id) {
                res.json({ success: false, error: { code: '403', msg: `Unauthorized: You do not have permission to modify this mood board.` } });
                return;
            }
        }
    } catch (err) {
        res.json({ success: false, error: { code: '400', msg: err.code } });
        return;
    }

    // see if card num on this board exists
    try {
        const result = await query(`SELECT * FROM Card WHERE board_id=${id} AND num=${num}`);
        if (result.length == 0) {
            res.json({ success: false, error: { code: '404', msg: `Board ${id} does not have card ${num}.` } });
            return;
        } else if (result[0].type != 'color') {
            res.json({ success: false, error: { code: '404', msg: `Card ${num} is not a color card.` } });
            return;
        }
    } catch (err) {
        res.json({ success: false, error: { code: '400', msg: err.code } });
        return;
    }

    try {
        const result = await query(`SELECT * FROM Color WHERE board_id=${id} AND card_num=${num}`);
        res.json({ success: true, palette: result });
        return
    } catch (err) {
        res.json({ success: false, error: { code: '400', msg: err.code } });
        return;
    }
});

app.delete('/board/:id/card/:num', passport.authenticate('jwt', { session: false }), async (req, res) => {
    const user = req.user;
    const { id, num } = req.params;

    // check that board with id exists
    let board;
    try {
        const result = await query(`SELECT * FROM Board WHERE id=${id}`);
        if (result.length == 0) {
            res.json({ success: false, error: { code: '404', msg: `Board ${id} could not be found.` } });
            return;
        } else {
            board = result[0];
            if (board.user_id != user.id) {
                res.json({ success: false, error: { code: '403', msg: `Unauthorized: You do not have permission to modify this mood board.` } });
                return;
            }
        }
    } catch (err) {
        res.json({ success: false, error: { code: '400', msg: err.code } });
        return;
    }

    // remove card num on this board
    try {
        const result = await query(`SELECT * FROM Card WHERE board_id=${id} AND num=${num}`);
        if (result.length == 0) {
            res.json({ success: false, error: { code: '404', msg: `Board ${id} does not have card ${num}.` } });
            return;
        }
        if (result[0].type === 'color') {
            await query(`DELETE FROM Color WHERE board_id=${id} AND card_num=${num}`);
        }
        await query(`DELETE FROM Card WHERE board_id=${id} and num=${num}`);
        res.json({ success: true, card: result[0] });
        return;
    } catch (err) {
        res.json({ success: false, error: { code: '400', msg: err.code } });
        return;
    }
});

const findBiggestColorRange = (rgbaArray) => {
    let rMin = Number.MAX_VALUE;
    let gMin = Number.MAX_VALUE;
    let bMin = Number.MAX_VALUE;
  
    let rMax = Number.MIN_VALUE;
    let gMax = Number.MIN_VALUE;
    let bMax = Number.MIN_VALUE;
  
    // iterate through all pixels, updating min max values
    rgbaArray.forEach((pixel) => {
      rMin = Math.min(rMin, pixel.r);
      gMin = Math.min(gMin, pixel.g);
      bMin = Math.min(bMin, pixel.b);
  
      rMax = Math.max(rMax, pixel.r);
      gMax = Math.max(gMax, pixel.g);
      bMax = Math.max(bMax, pixel.b);
    });
  
    const rRange = rMax - rMin;
    const gRange = gMax - gMin;
    const bRange = bMax - bMin;
  
    const biggestRange = Math.max(rRange, gRange, bRange);
    if (biggestRange === rRange) {
      return 'r';
    } else if (biggestRange === gRange) {
      return 'g';
    } else {
      return 'b';
    }
  };

const quantization = (rgbaArray, maxDepth, depth) => {
    // base case
    if (depth === maxDepth || rgbaArray.length === 0) {
        // get average rgb color value
        const color = rgbaArray.reduce(
            (prev, curr) => {
                prev.r += curr.r;
                prev.g += curr.g;
                prev.b += curr.b;
                return prev;
            },
            {
                r: 0,
                g: 0,
                b: 0,
            }
        );
    
        color.r = Math.round(color.r / rgbaArray.length);
        color.g = Math.round(color.g / rgbaArray.length);
        color.b = Math.round(color.b / rgbaArray.length);
        console.log('color: ', color);
        return [color];
    }
  
    const sortBy = findBiggestColorRange(rgbaArray);
    rgbaArray.sort((p1, p2) => {
        return p1[sortBy] - p2[sortBy];
    });
    
    const mid = rgbaArray.length / 2;
    return [
        ...quantization(rgbaArray.slice(0, mid), maxDepth, depth + 1),
        ...quantization(rgbaArray.slice(mid + 1), maxDepth, depth + 1),
    ];
}

const getRgbaArray = (data) => {
    const rgbaValues = [];
    for (let i = 0; i < data.length; i += 4) {
      const rgb = {
        r: data[i],
        g: data[i + 1],
        b: data[i + 2],
        a: data[i + 3],
      };
      rgbaValues.push(rgb);
    }
    return rgbaValues;
};

const removeTransparent = (data) => {
    const rgbaArray = [];
    for (let i = 0; i < data.length; i++) {
        if (data[i].a > 0) {
            rgbaArray.push(data[i]);
        }
    }
    return rgbaArray;
}

const removeDups = (palette) => {
    const newPalette = [];
    for (let i = 1; i < palette.length; i++) {
        if ((palette[i].r !== palette[i - 1].r) || (palette[i].g !== palette[i - 1].g) || (palette[i].b !== palette[i - 1].b)) {
            newPalette.push(palette[i]);
        }
    }
    return newPalette;
}

// add card to board
app.post('/board/:id/add', passport.authenticate('jwt', { session: false }), async (req, res) => {
    const user = req.user;
    const {id} = req.params;
    const { type, url, desc } = req.body;

    if (!type || !url || ((type != 'color') && !desc)) {
        res.json({ success: false, error: { code: '400', msg: 'Request malformed: Please include a all fields.' } });
        return;
    }

    if (type != 'color' && type != 'style' && type != 'object') {
        res.json({ success: false, error: { code: '400', msg: 'Request malformed: Invalid type.' } });
        return;
    }

    // check that board with id existss
    try {
        const result = await query(`SELECT * FROM Board WHERE id=${id}`);
        if (result.length == 0) {
            res.json({ success: false, error: { code: '404', msg: `Board ${id} could not be found.` } });
            return;
        } else {
            if (result[0].user_id != user.id) {
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
        const result = await query(`SELECT MAX(num) AS max_num FROM Card WHERE board_id=${id}`);
        num = result[0].max_num;
    } catch (err) {
        res.json({ success: false, error: { code: '400', msg: err.code } });
        return;
    }
    console.log('num: ', num);
    
    const card = {
        num: num + 1,
        board_id: id,
        type,
        url,
        desc,
    };

    let sql = `INSERT INTO Card (num, board_id, type, url, desc_text) 
               VALUES (${num + 1}, '${id}', '${type}', '${url}', '${desc}');`;
    
    try {
        // get the palette associated with this color card
        if (type === 'color') {
            const key = url.replace('https://artisan-posts.s3.amazonaws.com/', '');
            const params = {
                Bucket: config.s3_bucket,
                Key: key,
            };

            // fetch image data from s3 bucket
            s3.getObject(params, function(err, data) {
                Jimp.read(data.Body).then(async (image) => {
                    // get rbgaArray from data and remove transparent pixels
                    console.log(image);
                    const rgbaArray = removeTransparent(getRgbaArray(image.bitmap.data));
                    // generate palette and remove duplicate colors
                    const palette = removeDups(quantization(rgbaArray, 3, 0));
                    
                    // insert card into database
                    await query(sql);

                    // insert palette into database
                    let sql1;
                    for (let i = 0; i < palette.length; i++) {
                        sql1 = `INSERT INTO Color (num, card_num, board_id, r, g, b)
                                VALUES (${i+1}, ${num+1}, ${id}, ${palette[i].r}, ${palette[i].g}, ${palette[i].b})`;
                        await(query(sql1));
                    }

                    res.json({ success: true, card, palette });
                    return;
                }).catch(err => {
                    res.json({ success: false, error: { code: '400', msg: err.code } });
                    return;
                });
            });
        } else {
            await query(sql);
            res.json({ success: true, card: card });
            return;
        }
    } catch (err) {
        res.json({ success: false, error: { code: '400', msg: err.code } });
        return;
    }
});

app.get('/board/:id', passport.authenticate('jwt', { session: false }), async (req, res) => {
    const user = req.user;
    const {id} = req.params;

    // check that board with id exists
    try {
        const result = await query(`SELECT * FROM Board WHERE id=${id}`);
        if (result.length == 0) {
            res.json({ success: false, error: { code: '404', msg: `Board ${id} could not be found.` } });
            return;
        }
        if (result[0].user_id != user.id) {
            res.json({ success: false, error: { code: '403', msg: `Unauthorized: You do not have permission to delete this mood board.` } });
            return;
        }
        res.json({ success: true, board: result[0] });
        return;
    } catch (err) {
        res.json({ success: false, error: { code: '400', msg: err.code } });
        return;
    }
});

app.delete('/board/:id', passport.authenticate('jwt', { session: false }), async (req, res) => {
    const user = req.user;
    const {id} = req.params;

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
                res.json({ success: false, error: { code: '403', msg: `Unauthorized: You do not have permission to delete this mood board.` } });
                return;
            }
        }
    } catch (err) {
        res.json({ success: false, error: { code: '400', msg: err.code } });
        return;
    }

    // remove palette/colors and card from this board before removing this Board entirely
    try {
        await query(`DELETE FROM Color WHERE board_id=${id}`);
        await query(`DELETE FROM Card WHERE board_id=${id}`);
        await query(`DELETE FROM Board WHERE id=${id}`);
        
        res.json({ success: true, board: board });
        return;
    } catch (err) {
        res.json({ success: false, error: { code: '400', msg: err.code } });
        return;
    }
});

function componentToHex(c) {
    var hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
}

async function getPalette(colorCards, id) {
    var palette = [];
    for (let i = 0; i< colorCards.length; i++) {
        let card = colorCards[i];
        let colors = await query(`SELECT * FROM Color WHERE board_id=${id} AND card_num=${card.num}`);
        colors.map((color) => {
            const hex = '#' + componentToHex(color.r) + componentToHex(color.g) + componentToHex(color.b);
            const name = ntc.name(hex);
            palette.push(name[1]);
        });
    }
    return palette;
}

app.post('/board/:id/generate', passport.authenticate('jwt', { session: false }), async (req, res) => {
    const user = req.user;
    const {id} = req.params;

    // check that board with id exists
    try {
        const result = await query(`SELECT * FROM Board WHERE id=${id}`);
        if (result.length == 0) {
            res.json({ success: false, error: { code: '404', msg: `Board ${id} could not be found.` } });
            return;
        }
    } catch (err) {
        res.json({ success: false, error: { code: '400', msg: err.code } });
        return;
    }

    // generate prompt from these cards
    var p = ['art'];
    
    // get color cards from this board
    try {
        const colorCards = await query(`SELECT * FROM Card WHERE board_id=${id} AND type='color'`);
        console.log('colorCards: ', colorCards);
        if (colorCards.length > 0) {
            p.push('with color');

            // get palette of colors for this board
            const palette = await getPalette(colorCards, id);

            // remove duplicates
            const noDupPalette = [...new Set(palette)];
            console.log('noDupPalette: ', noDupPalette);

            // push color to prompt
            noDupPalette.forEach((c, ) => {
                p.push(`${c},`)
            });
        }
    } catch (err) {
        res.json({ success: false, error: { code: '400', msg: err.code } });
        return;
    }

    // get style cards from this board
    try {
        const styleCards = await query(`SELECT * FROM Card WHERE board_id=${id} AND type='style'`);
        console.log('styleCards: ', styleCards);

        if (styleCards.length > 0) {
            p.push('with style');
            styleCards.forEach((c, ) => {
                p.push(`${c.desc_text},`);
            });
        }
    } catch (err) {
        res.json({ success: false, error: { code: '400', msg: err.code } });
        return;
    }

    // get object cards from this board
    try {
        const objectCards = await query(`SELECT * FROM Card WHERE board_id=${id} AND type='object'`);
        console.log('objectCards: ', objectCards);

        if (objectCards.length > 0) {
            p.push('with ');
            objectCards.forEach((c, ) => {
                p.push(`${c.desc_text},`);
            });
        }
    } catch (err) {
        res.json({ success: false, error: { code: '400', msg: err.code } });
        return;
    }

    if (p.length < 2) {
        res.json({ success: false, error: { code: '404', msg: 'Cannot generate inspo for empty board.' } });
        return;
    }

    const prompt = p.join(' ');
    console.log('prompt: ', prompt);

    // pass through dall*e
    try {
        console.log('here');
        const response = await openai.createImage({
            prompt: prompt,
            n: 1,
            size: '256x256',
        });

        console.log(response);

        image_url = response.data.data[0].url;
        console.log(image_url);
        res.json({ success: true, prompt: prompt, url: image_url });
        return;
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