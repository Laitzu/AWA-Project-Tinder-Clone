const mongoose = require("mongoose");

const Schema = mongoose.Schema;

let userSchema = new Schema({
    firstName: {type: String},
    lastName: {type: String},
    email: {type: String, unique: true},
    password: {type: String},
    registerDate: {type: String},
    bio: {type: String}

});

module.exports = mongoose.model("user", userSchema)