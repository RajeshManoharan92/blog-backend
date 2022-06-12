const { ObjectId } = require("mongodb")
const mongo = require("../shared")
const express = require('express');
const User = require("../model/user")
const urldb = require('../model/url')
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
require('dotenv').config()
var nodemailer = require('nodemailer');
var randomString = require('random-string')
const cors = require('cors')
var shortUrl = require("node-url-shortener")

mongo.connect();
var app = express();
app.use(express.json());
app.use(cors());



// Register
app.post("/register", async (req, res) => {

    // Our register logic starts here
    try {
        // Get user input
        const { firstName, lastName, email, password } = req.body;

        const oldUser = await User.findOne({ email });

        if (oldUser) {
            return res.send("User Already Exist. Please Login");
        }

        //Encrypt user password
        encryptedUserPassword = await bcrypt.hash(password, 10);

        // Create user in our database
        const user = await User.create({
            first_name: firstName,
            last_name: lastName,
            email: email.toLowerCase(), // sanitize
            password: encryptedUserPassword,
            random_string: "abc"
        });

        // Create token
        const token = jwt.sign(
            { user_id: user._id, email },
            process.env.TOKEN_KEY,
            {
                expiresIn: "5h",
            }
        );
        // save user token
        user.token = token;

        // return new user
        res.status(201).json(user);
    } catch (err) {
        console.log(err);
    }
    // Our register logic ends here
});


// Login
app.post("/login", async (req, res) => {

    // Our login logic starts here
    try {
        // Get user input
        const { email, password } = req.body;

        // Validate user input
        if (!(email && password)) {
            res.status(400).send("All input is required");
        }
        // Validate if user exist in our database
        const user = await User.findOne({ email });

        if (user && (await bcrypt.compare(password, user.password))) {
            // Create token
            const token = jwt.sign(
                { user_id: user._id, email },
                process.env.TOKEN_KEY,
                {
                    expiresIn: "5h",
                }
            );

            // save user token
            user.token = token;

            // user
            return res.send('Loggedin');
        }
        return res.send('Invalid');

        // Our login logic ends here
    }
    catch (err) {
        console.log(err)
    }
});


// forgot password

app.post("/forgotpass", async function (req, res) {
    try {
        const { email } = req.body;

        const NoUser = await User.findOne({ email });

        if (!NoUser) {
            return res.send({ message: 'Sorry Email does not Exist!' });
        }

        var x = randomString();

        // Create random string in our database
        var _id = NoUser._id


        const user1 = await User.findByIdAndUpdate({ _id }, { $set: { random_string: x } }, { returnNewDocument: true, new: true })

        // Create token
        const token = jwt.sign(
            { user_id: user1._id, email },
            process.env.TOKEN_KEY,
            {
                expiresIn: "1h",
            }
        );

        // save user token
        user1.token = token;

        var transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'youremail@gmail.com',
                pass: 'yourpassword'
            }
        });

        var mailOptions = {
            from: 'youremail@gmail.com',
            to: 'myfriend@yahoo.com',
            subject: 'Sending Email using Node.js',
            html: '<h1>Click the link to reset your password</h1><a href="http://localhost:3000/setnewpassword">Reset Your Password with in one hour</a>'
        };

        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log(error);
            } else {
                console.log('Email sent: ' + info.response);
            }
        });
        res.send("mail_sent")
    }
    catch (err) {
        console.log(err)
    }

});


// verification mail

app.post("/verification", async function (req, res) {
    try {
        const { email } = req.body;

        const NoUser = await User.findOne({ email });

        if (!NoUser) {
            return res.send({ message: 'Sorry Email does not Exist!' });
        }

        var x = randomString();

        // Create random string in our database
        var _id = NoUser._id


        const user1 = await User.findByIdAndUpdate({ _id }, { $set: { random_string: x } }, { returnNewDocument: true, new: true })

        // Create token
        const token = jwt.sign(
            { user_id: user1._id, email },
            process.env.TOKEN_KEY,
            {
                expiresIn: "1h",
            }
        );

        // save user token
        user1.token = token;

        var transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'youremail@gmail.com',
                pass: 'yourpassword'
            }
        });

        var mailOptions = {
            from: 'youremail@gmail.com',
            to: 'myfriend@yahoo.com',
            subject: 'Sending Email using Node.js',
            html: '<h1>Click the link to reset your password</h1><a href="http://localhost:3000/setnewpassword">Reset Your Password with in one hour</a>'
        };

        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log(error);
            } else {
                console.log('Email sent: ' + info.response);
            }
        });
        res.send("mail_sent")
    }
    catch (err) {
        console.log(err)
    }

});


// set new password 

app.post("/setnewpassword", async function (req, res) {
    try {
        const { email, password } = req.body;

        const NoUser = await User.findOne({ email });

        if (!NoUser) {
            return res.send({ message: 'Sorry Email does not Exist!' });
        }

        // Create random string in our database
        var _id = NoUser._id
        encryptedUserPassword = await bcrypt.hash(password, 10);

        const user1 = await User.findByIdAndUpdate({ _id }, { $set: { password: encryptedUserPassword, random_string: "" } }, { returnNewDocument: true, new: true })

        res.send(user1)
    }
    catch (err) {
        console.log(err)
    }
});


// URL shortner 

app.post("/urlshortner", async function (req, res) {
    try {
        const { url } = req.body;

        const NoUser = await urldb.findOne({ url });

        shortUrl.short(url, async function (err, urll) {
            try {
                const user = await urldb.create({
                    url: url,
                    shorturl: urll,
                });

                res.send(user)
            }
            catch (err) {
                console.log(err)
            }
        });

    }
    catch (err) {
        console.log(err)
    }
});

// to get url count till date

app.get("/gettotalproductcount", async (req, res) => {
    try {
        const response = await urldb.aggregate([
            {
                $group: {
                    _id: "$userId",
                    Totalcount: { "$sum": 1 }
                }
            }, {
                $project: { _id: 0 }
            }
        ])
        res.send(response)
    }
    catch (err) {
        console.log(err)
    }
}
)

// to get all url's created till date

app.get("/getdatas", async (req, res) => {
    try {
        const response = await urldb.find()
        res.send(response)
    }
    catch (err) {
        console.log(err)
    }
}
)


module.exports = app;