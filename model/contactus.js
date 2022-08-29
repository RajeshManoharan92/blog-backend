const mongoose = require("mongoose");

const contactusSchema = new mongoose.Schema({
    Username: { type: String},
    UserContactNo: { type: String },
    questionenquiry: { type: String },
});

module.exports = mongoose.model("quizAppcontactus", contactusSchema);