const User = require('../model/model')
const crypto = require('crypto');
const { encryptData, decryptData } = require('../helper/encryption_decryption');

exports.home = (req, res, next) => {
    const payload = {
        pageTitle: 'Home',
        userLoggedIn: req.session.user
    }
    res.status(200).render("home", payload);
};

exports.login = (req, res, next) => {
    const payload = {
        pageTitle: 'Login'
    }
    console.log(req.session.user)
    res.status(200).render("login", payload);
}

exports.register = (req, res, next) => {
    const payload = {
        pageTitle: 'Register'
    }
    console.log(req.session.user)
    res.status(200).render("register", payload);
}

exports.register_post = async (req, res, next) => {

    try {
        // Destructure values from req.body
        const { firstName, lastName, username, email, password } = req.body;
    
        // Encrypt all the data, including firstName, lastName, username, and email
        const algorithm = 'aes-256-cbc';
        const key = crypto.randomBytes(32);
        const iv = crypto.randomBytes(16);
        const cipher = crypto.createCipheriv(algorithm, Buffer.from(key), iv);
        let encryptedData = cipher.update(JSON.stringify({ firstName, lastName, username, email, password }), 'utf-8', 'hex');
        encryptedData += cipher.final('hex');
    
        // Check if the username or email already exists in the database using encrypted values
        const encryptedUsername = encryptData(username);
        const encryptedEmail = encryptData(email);

        const existingUsername = await User.findOne({ username: encryptedUsername });
        const existingEmail = await User.findOne({ email: encryptedEmail });
    
        if (existingUsername && existingEmail) {
          // Both username and email are duplicates
          return res.render('register', {
            error: 'Username and email already exist',
            firstName,
            lastName,
            // Don't include the duplicate username or email
          });
        } else if (existingUsername) {
          // Only username is a duplicate
          return res.render('register', {
            error: 'Username already exists',
            firstName,
            lastName,
            email,
            // Don't include the duplicate username
          });
        } else if (existingEmail) {
          // Only email is a duplicate
          return res.render('register', {
            error: 'Email already exists',
            firstName,
            lastName,
            // Don't include the duplicate email
            username,
          });
        }
    
        // Create a new user in the database with encrypted values
        const encryptedFirstName = encryptData(firstName);
        const encryptedLastName = encryptData(lastName);
        const encryptedPassword = encryptData(password);

        const newUser = new User({
        firstName: encryptedFirstName,
        lastName: encryptedLastName,
        username: encryptedUsername,
        email: encryptedEmail,
        password: encryptedPassword,
        });

        // Decrypt the data to send it back to the user
        const decipher = crypto.createDecipheriv(algorithm, Buffer.from(key), iv);
        let decryptedData = decipher.update(encryptedData, 'hex', 'utf-8');
        decryptedData += decipher.final('utf-8');
    
        // Send the decrypted data back to the user
        console.log(req.session.user)
        console.log({ message: 'Registration successful', user: JSON.parse(decryptedData) });
    
        await newUser.save();
        req.session.user = JSON.parse(decryptedData);
        console.log(req.session.user)
        return res.redirect("/");


      } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
      }
}