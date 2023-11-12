exports.home = async(req, res) => {
    const payload = {
        pageTitle: "Home"
    }
    res.send("You are home", payload)
};