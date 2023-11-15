const mongoose = require('mongoose');


// This is required for accessing the database as template i guess
const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, "First Name is required"],
        trim: true,
        text: true,
    },
})
module.exports = mongoose.model('User', userSchema);