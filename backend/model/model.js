const mongoos = require('mongoose');


// This is required for accessing the database as template i guess
const userSchema = mongoos.Schema({
    name: {
        type: String,
        required: [true, "First Name is required"],
        trim: true,
        text: true,
    },
module.exports = mongoos.model('User', userSchema);