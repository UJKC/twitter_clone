exports.home = (req, res, next) => {
    const payload = {
        pageTitle: 'Home'
    }
    res.status(200).render("home", payload);
};