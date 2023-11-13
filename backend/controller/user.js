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

exports.register_post = (req, res, next) => {
    res.send(req.body)
}
/*
CHeck for password is same two times
Cryptic done
Check for empty fields
*/