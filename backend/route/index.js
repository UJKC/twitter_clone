const express = require('express');
const app = express();
const path = require('path');
const { home, login, register, register_post, login_post, logout, postinput, postoutput } = require('../controller/user');
const bodyparser = require('body-parser')
const User = require('../model/model')
const session = require('express-session')
const crypto = require('crypto');
const { encryptData, decryptData } = require('../helper/encryption_decryption');

const secretKey = ');;?wDNPUWpT4qL;*gx@q*\'Kj@dG{jT)H!N[^LNAhk!U4|kKB]ggb-,?i{&qY[;';
const algorithm = 'aes-256-cbc';

app.use(bodyparser.urlencoded({
    extended: false
}));

app.use(express.static(path.join(__dirname, '../../../twitter_clone/frontend/src')));

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, '../../../twitter_clone/frontend/src/page'));

app.get('/login', login)
app.post('/login', login_post)
app.get('/', home);
app.get('/register', register)
app.post('/register', register_post)
app.get('/logout', logout)
app.post('/api/posts', postinput)
app.get('/api/posts', postinput)

/*
app.post('/api/posts', postoutput)
*/

module.exports = app;