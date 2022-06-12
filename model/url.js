const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    url:{type:String},
    shorturl:{type:String},
});

module.exports = mongoose.model("shorturl", userSchema);