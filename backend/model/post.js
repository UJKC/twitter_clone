const mongoose = require('mongoose');


// This is required for accessing the database as template i guess
const PostSchema = mongoose.Schema({
        content: {
            type: String,
            trim: true,
            default: "I am new here",
        },
        postedBy: {
            type: Object,
            ref: 'User',
        },
        pinned: {
            type: Boolean
        }
},
{
    timestamps: true,
});
module.exports = mongoose.model('Post', PostSchema);