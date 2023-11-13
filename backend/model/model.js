const mongoos = require('mongoose');


// This is required for accessing the database as template i guess
const userSchema = mongoos.Schema({
    firstName: {
        type: String,
        required: [true, "First Name is required"],
        trim: true,
        text: true,
    },
    lastName: {
        type: String,
        required: [true, "last Name is required"],
        trim: true,
        text: true,
    },
    username: {
        type: String,
        required: [true, "username is required is required"],
        trim: true,
        text: true,
        unique: true,
    },
    password: {
        type: String,
        required: [true, "password is required"],
    },
    email: {
        type: String,
        required: [true, "email is required"],
        trim: true,
    },
    picture: {
        type: String,
        trim: true,
        default: "",
    },
    cover: {
        type: String,
        trim: true,
    },
    gender: {
        type: String,
        required: [true, "gender is required"],
        trim: true,
    },
    bday: {
        type: Number,
        required: true,
        trim: true,
    },
    bmonth: {
        type: Number,
        required: true,
        trim: true,
    },
    byear: {
        type: Number,
        required: true,
        trim: true,
    },
    varified: {
        type: Boolean,
        default: false,
    },
    friends: {
        type: Array,
        default: [],
    },
    following: {
        type: Array,
        default: [],
    },
    follower: {
        type: Array,
        default: [],
    },
    requests: {
        type: Array,
        default: [],
    },
    search: [
        {
            user: {
                type: mongoos.Schema.ObjectId,
                ref: 'User'
            }
        }
    ],
    details: {
        bio: {
            type: String,
        },
        otherName: {
            type: String,
        },
        job: {
            type: String,
        },
        workplace: {
            type: String,
        },
        highSchool: {
            type: String,
        },
        college: {
            type: String,
        },
        currentCity: {
            type: String,
        },
        homeTown: {
            type: String,
        },
        relationship: {
            type: String,
            enum: ['Single', 'is in relationship', 'Married', 'Divorced'],
        },
        instagram: {
            type: String,
        },
    },
    savedPost: [
        {
            post: {
                type: mongoos.Schema.ObjectId,
                ref: 'Post',
            },
            sacedDate: {
                type: Date,
                default: new Date(),
            }
        }
    ],
},
{
    timestamp: true,
});

module.exports = mongoos.model('User', userSchema);