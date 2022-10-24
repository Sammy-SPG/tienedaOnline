const express = require('express');
const path = require('path');
const router = require('./routes/index');
const session = require("express-session");
require('ejs');

const app = express();

//setting
app.set('port', process.env.PORT || 3000);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'view'));


app.use(express.static(path.join(__dirname, 'public')));
// parse application/json
app.use(express.json());
// Session
app.use(session({
    secret: '123',
    saveUninitialized: true,
    resave: true
}));
//routers
app.use(router);

// ready
app.listen(app.get('port'), (req, res) => {
    console.log(app.get('port'));
});