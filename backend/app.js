const express = require('express');
const { readdirSync } = require('fs');
const middleware = require('./helper/middleware/middleware')
const app = express();
const bodyparser = require('body-parser');

app.use(bodyparser.urlencoded({
    extended: false
}));
readdirSync('backend/route').map((r) => app.use('/', middleware.requireLogin, require('./route/' + r)));

const server = app.listen(3000, () => {
    console.log("Server is on on 3000 port. Dont mind everything is fine.");
})