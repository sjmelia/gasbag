var express = require('express');

var app = express();
var port = process.env.PORT || 3000;

// Templating - Mustache
var mustacheExpress = require('mustache-express');
app.engine('html', mustacheExpress());
app.set('view engine', 'html');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

// Persistence - Mongoose
var mongoose = require('mongoose');
var configDb = require('./app/database.js');
mongoose.connect(configDb.url);

// Auth - Passport
var passport = require('passport');
require('./app/passport.js')(passport);
app.use(passport.initialize());
app.use(passport.session());

// Other
var session = require('express-session');
app.use(session({ secret: 'thisismysecret' }));

var flash = require('connect-flash');
app.use(flash());

var bodyParser = require("body-parser");
app.use(bodyParser());

require('./app/routes.js')(app, passport);

app.listen(port);
console.log('The magic happens on port ' + port);
