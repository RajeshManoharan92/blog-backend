const User = require("../model/User"); 
const bcrypt = require("bcryptjs");
var nodemailer = require('nodemailer');
var randomString = require('random-string')
const jwt = require("jsonwebtoken")
require('dotenv').config()

// to get all user

module.exports.getAllUser = async (req, res, next) => {
  let users;
  try {
    users = await User.find();
  } catch (err) {
    console.log(err);
  }
  if (!users) {
    return res.status(404).json({ message: "No Users Found" });
  }
  return res.status(200).json({ users });
};

//  sign up

module.exports.signup = async (req, res) => {
  const { name, email, password } = req.body;
  let existingUser;
  try {
    existingUser = await User.findOne({ email });
  } catch (err) {
    return console.log(err);
  }
  if (existingUser) {
    return res
      .json({ message: "User Already Exists! Login Instead" });
  }
  const hashedPassword = bcrypt.hashSync(password);

  const user = new User({
    name,
    email,
    password: hashedPassword,
    blogs: [],
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

  try {
    await user.save();
  } catch (err) {
    return console.log(err);
  }
  return res.status(201).json({ user });
};

// login

module.exports.login = async (req, res, next) => {
  const { email, password } = req.body;
  let existingUser;
  try {
    existingUser = await User.findOne({ email });
  } catch (err) {
    return console.log(err);
  }
  if (!existingUser) {
    return res.json({ message: "Couldnt Find User By This Email" });
  }

  const isPasswordCorrect = bcrypt.compareSync(password, existingUser.password);
  if (!isPasswordCorrect) {
    return res.json({ message: "Incorrect Password" });
  }

  if (existingUser && isPasswordCorrect) {
    // Create token
    const token = jwt.sign(
      { user_id: existingUser._id, email },
      process.env.TOKEN_KEY,
      {
        expiresIn: "5h",
      }
    );

    // save user token
    existingUser.token = token;

    // user
    return res
      .status(200)
      .json({ message: "Login Successfull", user: existingUser });
  }
};


// Get user name

module.exports.getuserid = async (req, res) => {

  // Our register logic starts here
  try {
    // Get user input

    const { email } = req.body

    const oldUser = await User.findOne({ email });

    if (oldUser) {
      return res.status(201).json(oldUser);;
    }

  } catch (err) {
    console.log(err);
  }
  // Our register logic ends here
};


// set new password 

module.exports.setnewpassword = async function (req, res) {
  try {
    const { email, password } = req.body;

    const NoUser = await User.findOne({ email });

    if (!NoUser) {
      return res.send({ message: 'Sorry Email does not Exist!' });
    }

    // Create random string in our database
    var _id = NoUser._id
    encryptedUserPassword = await bcrypt.hash(password, 10);

    const user1 = await User.findByIdAndUpdate({ _id }, { $set: { password: encryptedUserPassword } }, { returnNewDocument: true, new: true })

    return res
      .status(200)
      .json({ message: "Password changed", user1 });
  }
  catch (err) {
    console.log(err)
  }
};

// verification mail

module.exports.emailverification = async function (req, res) {
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
      html: '<h1>Click the link to reset your password</h1><a href="http://localhost:5000/api/user/setnewpassword">Reset Your Password with in one hour</a>'
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

};