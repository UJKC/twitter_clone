const mongoose = require('mongoose');


// This is required for accessing the database as template i guess
const PostSchema = mongoose.Schema({
        content: {
            type: String,
            trim: true,
            default: "I am new here",
        },
        postedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },
        pinned: {
            type: Boolean
        },
        likes: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User',
            }
        ],
        retweetUsers: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User',
            }
        ],
        retweetPost: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Post',
            }
},
{
    timestamps: true,
});
module.exports = mongoose.model('Post', PostSchema);