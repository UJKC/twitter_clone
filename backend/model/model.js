const mongoose = require('mongoose');


// This is required for accessing the database as template i guess
const userSchema = mongoose.Schema({
        firstName: {
            type: String,
            required: [true, "First Name is required"],
            trim: true,
        },
        lastName: {
            type: String,
            required: [true, "last Name is required"],
            trim: true,
        },
        username: {
            type: String,
            required: [true, "username is required is required"],
            trim: true,
            text: true,
            unique: true,
        },
        email: {
            type: String,
            required: [true, "email is required"],
            trim: true,
        },
        password: {
            type: String,
            required: [true, "password is required"],
        },
        picture: {
            type: String,
            trim: true,
            default: "/public/images/ujwal.jpg",
        }
},
{
    timestamps: true,
});
module.exports = mongoose.model('User', userSchema);