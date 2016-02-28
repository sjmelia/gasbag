var express = require('express');

var app = express();
var port = process.env.PORT || 3000;
var server = require('http').createServer(app);

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

// Other
var session = require('express-session');
app.use(session({ secret: 'thisismysecret' }));

var flash = require('connect-flash');
app.use(flash());

var bodyParser = require("body-parser");
app.use(bodyParser());

var cookieParser = require("cookie-parser");
app.use(cookieParser());

// Auth - Passport
var passport = require('passport');
require('./app/passport.js')(passport);
app.use(passport.initialize());
app.use(passport.session());

// socket.io
var io = require('socket.io')(server);
io.on('connection', function(socket) {
    console.log("Socket.io connection");

    socket.on('new message', function (data) {
        io.sockets.emit('new message', {
            username: socket.username,
            message: data
        });
    });

    socket.on('disconnect', function() {
        console.log("Socket.io disconnect");
    });
});

require('./app/routes.js')(app, passport);

server.listen(port);
console.log('The magic happens on port ' + port);
