const User = require('../model/model')
const Post = require('../model/post')
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

        const userClone = {
          firstName: decryptData(newUser.firstName),
          lastName: decryptData(newUser.lastName),
          username: decryptData(newUser.username),
          email: decryptData(newUser.email),
          password: decryptData(newUser.password),
          picture: newUser.picture,
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
      _id: user._id,
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

  try {
    const newPost = {
      content: content,
      postedBy: req.session.user._id, // Use the user's _id directly
    };

    const posted = await Post.create(newPost);

    // Populate the postedBy field with all fields from the User model
    const populatedPost = await Post.findById(posted._id)
      .populate('postedBy', '-password'); // Exclude fields you don't want to include

    console.log(populatedPost);

    var posteddecryption = {
      content: populatedPost.content,
      firstName: decryptData(populatedPost.postedBy.firstName),
      lastName: decryptData(populatedPost.postedBy.lastName),
      username: decryptData(populatedPost.postedBy.username),
      picture: populatedPost.postedBy.picture,
      createdAt: populatedPost.createdAt
    }

    console.log(posteddecryption);

    res.status(201).json({
      message: "Post created successfully",
      post: posteddecryption,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.getallposts = async (req, res, posts) => {
  var poster_array = [];
  const options = {
    timeZone: 'Asia/Kolkata', // Indian Standard Time
    dateStyle: 'full',
    timeStyle: 'long',
  };
  try {
    const posts = await Post.find(); // Retrieve all posts from the database
    console.log(posts) // Retrieve all posts from the database

    // Use for...of loop to iterate over posts
    for (var poster of posts) {
      var populatedPost = await Post.findById(poster._id).populate('postedBy', '-password');
      populatedPost.postedBy.firstName = decryptData(populatedPost.postedBy.firstName)
      populatedPost.postedBy.lastName = decryptData(populatedPost.postedBy.lastName)
      populatedPost.postedBy.username = decryptData(populatedPost.postedBy.username)
      populatedPost.createdAt = new Date(populatedPost.createdAt);
      poster_array.push(populatedPost);
    }
    console.log(poster_array)
    res.status(200).json(poster_array);
  }
  catch (error) {
    console.error('Error fetching posts:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}

exports.updatelikedposts = async (req, res, next) => {
  try {
    const userId = req.session.user._id; // Replace with the actual user id, you can get this from the user authentication
    const postId = req.params.postid;

    const user = await User.findById(userId);
    const post = await Post.findById(postId);
    // Check if the post is already liked by the user
    
    if (user.likes.includes(postId)) {
      // User has already liked the post, remove the like
      user.likes.pull(postId);
      post.likes.pull(userId);

      await user.save();
      await post.save();

      return res.status(200).json({ message: 'Post unliked successfully' });
    }

    // If not, add the post to the user's liked posts
    user.likes.push(postId);
    post.likes.push(userId);

    await user.save();
    await post.save();

    res.status(200).json({ message: 'Post liked successfully' });
  } catch (error) {
    console.error('Error updating liked posts:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};