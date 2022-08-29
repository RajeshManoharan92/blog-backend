const mongoose = require("mongoose");

const registerSchema = new mongoose.Schema({
    first_name: { type: String},
    last_name: { type: String },
    email: { type: String },
    token: {type : String}
});

module.exports = mongoose.model("quizAppregister", registerSchema);