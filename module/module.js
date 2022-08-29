const mongo = require("../shared")
const express = require('express');
const User = require("../model/user")
const contactus = require('../model/contactus')
const answerCount = require('../model/answercount')
const register = require('../model/register')
const jwt = require("jsonwebtoken")
require('dotenv').config()
const cors = require('cors')


mongo.connect();
var app = express();
app.use(express.json());
app.use(cors());



// Register

app.post("/register", async (req, res) => {

    // Our register logic starts here
    try {
        // Get user input
        const { firstName, lastName, email } = req.body;

        const oldUser = await register.findOne({ email });

        if (oldUser) {
            return res.send("User Already Exist. Please Login");
        }

        // Create user in our database
        const user = await register.create({
            first_name: firstName,
            last_name: lastName,
            email: email.toLowerCase(), // sanitize

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


// Get user name

app.post("/getuser", async (req, res) => {

    // Our register logic starts here
    try {
        // Get user input
       
        const {email} = req.body

        const oldUser = await register.findOne({email});

        if (oldUser) {
            return res.status(201).json(oldUser);;
        }
  
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
        const { email } = req.body;

        const oldUser = await register.findOne({ email });

        // Validate user input
        if (!(email)) {
            res.status(400).send("All input is required");
        }

        if (oldUser) {

            return res.send(oldUser);
        }
        return res.send('Invalid');

        // Our login logic ends here
    }
    catch (err) {
        console.log(err)
    }
});


// to get Quiz Question

app.get("/getQuestion", async function (req, res) {
    try {

        const name = await User.find({})

        if (name) {
            res.send(name)
        }


    }
    catch (err) {
        console.log(err)

    }
})

// to post new question

app.post("/postQuestion", async function (req, res) {
    try {

        const { Question, option1, option2, option3, Answer } = req.body;

        const name = await User.create({
            Question: Question,
            option1: option1,
            option2: option2,
            option3: option3,
            Answer: Answer,

        })

        if (name) {
            res.send(name)
        }


    }
    catch (err) {
        console.log(err)

    }
})

// to update question

app.put("/updateQuestion/:id", async function (req, res) {
    try {


        const name = await User.findByIdAndUpdate(req.params.id, req.body)

        if (name) {
            res.send(name)
        }

    }
    catch (err) {
        console.log(err)

    }
})

// to delete question

app.delete("/deleteQuestion/:id", async function (req, res) {
    try {


        const name = await User.findByIdAndDelete(req.params.id)

        if (name) {
            res.send(name)
            return res.send("deleted successfully")
        }


    }
    catch (err) {
        console.log(err)

    }
})

//to post contact us

app.post("/postcontactus", async function (req, res) {
    try {

        const { Username, UserContactNo, questionenquiry } = req.body;

        const contact = await contactus.create({
            Username: Username,
            UserContactNo: UserContactNo,
            questionenquiry: questionenquiry,

        })

        if (contact) {
            res.send(contact)
        }


    }
    catch (err) {
        console.log(err)

    }
})


// to get contact us post

app.get("/getcontactus", async function (req, res) {
    try {


        const contact = await contactus.find({})

        if (contact) {
            res.send(contact)
        }


    }
    catch (err) {
        console.log(err)

    }
})


// to delete contact us post

app.delete("/deletecontactus/:id", async function (req, res) {
    try {


        const contact = await contactus.findOneAndDelete(req.params.id)

        if (contact) {
            res.send(contact)
        }

    }
    catch (err) {
        console.log(err)

    }
})


// to post Answer Count 

app.post("/postAnswerCount", async function (req, res) {
    try {

        const { correctAnswerCount, questionAnswered } = req.body;

        const name = await answerCount.create({
            correctAnswerCount: correctAnswerCount,
            questionAnswered: questionAnswered,

        })

        if (name) {
            res.send(name)
        }


    }
    catch (err) {
        console.log(err)

    }
})


// to get answer count

app.get("/getAnswerCount", async function (req, res) {
    try {

        const name = await answerCount.find({})

        if (name) {
            res.send(name)
        }


    }
    catch (err) {
        console.log(err)

    }
})

module.exports = app;