var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const {getData} = require('./controller.js');
require('dotenv').config();
const cors = require('cors');


var app = express();

app.use(logger('dev'));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

const PORT = process.env.PORT || 3000;

app.post('/', getData);

app.listen(PORT, function () {
    console.log(`Express server listening on port ${PORT}`);
})

module.exports = app;
