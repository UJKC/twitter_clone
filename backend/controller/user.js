const User = require('../model/model')
exports.home = (req, res, next) => {
    const payload = {
        pageTitle: 'Home'
    }
    res.status(200).render("home", payload);
};

exports.login = (req, res, next) => {
    const payload = {
        pageTitle: 'Login'
    }
    res.status(200).render("login", payload);
}

exports.register = (req, res, next) => {
    const payload = {
        pageTitle: 'Register'
    }
    res.status(200).render("register", payload);
}

exports.register_post = async (req, res, next) => {
    const payload = req.body;
const { username, email } = payload;

// Check if the username is already in use
const existingUsername = await User.findOne({ username });
if (existingUsername) {
    return res.status(400).json({
        message: "Username is already in use",
        username
    });
}

// Check if the email is already in use
const existingEmail = await User.findOne({ email });
if (existingEmail) {
    return res.status(400).json({
        message: "Email is already in use",
        email
    });
}

// If neither the username nor email is in use, create a new user
const user = await User.create(payload);
console.log("User created successfully");

// Return a success response or perform any additional actions
return res.status(200).json({
    message: "User created successfully",
    user
});

}
/*
CHeck for password is same two times
Check for empty fields
Get values back
*/