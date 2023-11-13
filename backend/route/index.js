const express = require('express');
const app = express();
const path = require('path');
const { home, login, register } = require('../controller/user');

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, '../../../twitter_clone/frontend/src/page'));

app.get('/login', login)
app.get('/', home);
app.get('/register', register)

module.exports = app;