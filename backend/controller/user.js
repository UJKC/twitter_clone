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
    var payload = req.body;
    const name = payload.name;
    check = await User.findOne({name: name})
    if (check) {
        const user = User.create(payload)
    }
    else {
        res.status(400).json({
            message: "User already exist"
        })
    }
}
/*
CHeck for password is same two times
Cryptic done
Check for empty fields
Get values back
*/