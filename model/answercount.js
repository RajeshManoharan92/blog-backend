const mongoose = require("mongoose");

const answercountSchema = new mongoose.Schema({
    correctAnswerCount: { type: String},
    questionAnswered: { type: String },
});

module.exports = mongoose.model("quizAppAnswerCount", answercountSchema);