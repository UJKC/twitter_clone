const User = require('../model/model')
const crypto = require('crypto');

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
        const existingUsername = await User.findOne({ username: crypto.createHash('md5').update(username).digest('hex') });
        const existingEmail = await User.findOne({ email: crypto.createHash('md5').update(email).digest('hex') });
    
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
        const newUser = new User({
          firstName: crypto.createHash('md5').update(firstName).digest('hex'),
          lastName: crypto.createHash('md5').update(lastName).digest('hex'),
          username: crypto.createHash('md5').update(username).digest('hex'),
          email: crypto.createHash('md5').update(email).digest('hex'),
          password: encryptedData,
        });
    
        await newUser.save();
    
        // Decrypt the data to send it back to the user
        const decipher = crypto.createDecipheriv(algorithm, Buffer.from(key), iv);
        let decryptedData = decipher.update(encryptedData, 'hex', 'utf-8');
        decryptedData += decipher.final('utf-8');
    
        // Send the decrypted data back to the user
        res.json({ message: 'Registration successful', user: JSON.parse(decryptedData) });
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
      }
}