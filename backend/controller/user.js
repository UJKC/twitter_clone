const User = require('../model/model')
const Post = require('../model/post')
const crypto = require('crypto');
const { encryptData, decryptData } = require('../helper/encryption_decryption');
const { PassThrough } = require('stream');

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

        const userClone = {
          firstName: decryptData(newUser.firstName),
          lastName: decryptData(newUser.lastName),
          username: decryptData(newUser.username),
          email: decryptData(newUser.email),
          password: decryptData(newUser.password),
          profile: newUser.profile,
        };
    
        await newUser.save();
        req.session.user = userClone;
        console.log(req.session.user)
        return res.redirect("/");


      } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
      }
}

exports.login_post = async (req, res, next) => {
  const { usernameOrEmail, password } = req.body;
  console.log(req.session.user)
  try {
    // Encrypt the username or email for comparison with the database
    const encryptedUsernameOrEmail = encryptData(usernameOrEmail);

    // Find the user in the database by checking both username and email fields
    const user = await User.findOne({
      $or: [
        { username: encryptedUsernameOrEmail },
        { email: encryptedUsernameOrEmail },
      ],
    });

    // If user is not found, return an appropriate response
    if (!user) {
      return { success: false, message: 'User not found' };
    }

    // Encrypt the provided password and check against the stored encrypted password
    const encryptedPassword = encryptData(password);
    if (encryptedPassword !== user.password) {
      return { success: false, message: 'Incorrect password' };
    }

    const userClone = {
      firstName: decryptData(user.firstName),
      lastName: decryptData(user.lastName),
      username: decryptData(user.username),
      email: decryptData(user.email),
      password: decryptData(user.password),
      picture: user.picture,
    };
    
    console.log(userClone)
    req.session.user = userClone;

    // If everything is successful, return a success message and user information
    return res.redirect('/', );
  } catch (error) {
    console.error(error);
    return { success: false, message: 'Internal server error' };
  }

}

exports.logout = (req, res, next) => {
  if (req.session) {
    req.session.destroy( () => {
      res.redirect('/login')
    })
  }
}

exports.postinput = async (req, res, next) => {
  const { content } = req.body;

  if (!content) {
    return res.status(400).json({
      message: "Content is required",
    });
  }

  console.log(content)
  try {
    const newPost = {
      content: content,
      postedBy: req.session.user,
    }

    console.log(newPost)
    Post.create(newPost)
    .then( async posted => {
      posted = await User.populate(posted, {
        path: 'postedBy'
      })
    })
    console.log(newPost)
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Internal server error",
      error: err,
    });
  }
};
