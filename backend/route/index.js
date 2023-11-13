const express = require('express');
const app = express();
const path = require('path');
const { home } = require('../controller/user');
const { requireLogin } = require('../helper/middleware/middleware');

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, '../../../twitter_clone/frontend/src/page'));

app.get('/', home);

module.exports = app;