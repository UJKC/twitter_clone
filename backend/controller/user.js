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
    var payload = req.body;
    var firstName = req.body.firstName.trim();
    var lastName = req.body.lastName.trim();
    var username = req.body.username.trim();
    var password = req.body.password.trim();
    var email = req.body.email.trim();
    var gender = req.body.gender.trim();
    var bday = req.body.bday.trim();
    var bmonth = req.body.bmonth.trim();
    var byear = req.body.byear.trim();
    if (firstName && lastName && username && password && email && gender && bday && bmonth && byear) {
        console.log("Noted");
        res.send(req.body)
    }
    else {
        res.status(200).render('/register', payload);
    }
}
/*
CHeck for password is same two times
Cryptic done
Check for empty fields
*/