const path = require('path');

exports.home = async(req, res) => {
    const payload = {
        pageTitle: 'Home'
    }
    res.status(200).render("home", payload);
};