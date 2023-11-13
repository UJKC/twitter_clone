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

    // Check if the properties exist before using trim
    var firstName = payload.firstName ? payload.firstName.trim() : '';
    var lastName = payload.lastName ? payload.lastName.trim() : '';
    var username = payload.username ? payload.username.trim() : '';
    var password = payload.password ? payload.password.trim() : '';
    var email = payload.email ? payload.email.trim() : '';
    var gender = payload.gender ? payload.gender.trim() : '';
    var bday = payload.bday ? payload.bday.trim() : '';
    var bmonth = payload.bmonth ? payload.bmonth.trim() : '';
    var byear = payload.byear ? payload.byear.trim() : '';

    if (firstName && lastName && username && password && email && gender && bday && bmonth && byear) {
        console.log("Noted");
        res.json(payload);
    } else {
        // Adjust your rendering logic here
        res.status(200).render('register');
    }
}
/*
CHeck for password is same two times
Cryptic done
Check for empty fields
Get values back
*/