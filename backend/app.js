const express = require('express');
const { readdirSync } = require('fs');
const middleware = require('./helper/middleware/middleware')
const app = express();
const bodyparser = require('body-parser');
const mongoose = require('mongoose');

app.use(express.json());

const session = require('express-session')

app.use(session({
    secret: "ujwal",
    resave: true,
    saveUninitialized: false
}))


const DATABASE_URL = "mongodb+srv://Ukc:Kncgreat1@cluster0.7obvlrp.mongodb.net/Twitter?retryWrites=true&w=majority"

app.use(bodyparser.urlencoded({
    extended: false
}));
readdirSync('backend/route').map((r) => app.use('/', middleware.requireLogin, require('./route/' + r)));

mongoose.connect(DATABASE_URL, {
    useNewUrlParser: true, // Enable the URL parser
    useUnifiedTopology: true, // Enable the new Server Discover and Monitoring engine
  })
  .then(() => console.log('Database connection successful'))
  .catch((err) => console.log(`Database connection failed: ${err}`));

const server = app.listen(3000, () => {
    console.log(`Server is on on 3000 port. Dont mind everything is fine.`);
})

/*
Encrypt everything
Have refernce of tweets from tweet database to user database as array?
Time issue
Days ago
Get only required Information
Optimise by not calling again and again
*/