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
var SESSION_SECRET = 'bloviator';
var sessionStore = new session.MemoryStore();
appSession = session({ 
    secret: SESSION_SECRET,
    key: 'express.sid',
    store: sessionStore
});
app.use(appSession);
console.log("sessionStore: " + sessionStore);

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
        console.log(socket.request.user);
        io.sockets.emit('new message', {
            username: socket.request.user.local.email,
            message: data
        });
    });

    socket.on('disconnect', function() {
        console.log("Socket.io disconnect");
    });
});

// passport.socketio
var passportSocketIo = require('passport.socketio');
io.use(passportSocketIo.authorize({
    cookieParser: cookieParser,
    secret: SESSION_SECRET,
    store: sessionStore,
    key: 'express.sid',
    success: onAuthorizeSuccess,
    fail: onAuthorizeFail,
}));

function onAuthorizeSuccess(data, accept) {
    console.log("on auth success");
    accept(null, true);
}

function onAuthorizeFail(data, message, error, accept) {
    if (error) {
        throw new Error(message);
    }
    console.log('Failed connection to socket.io:', message);

    accept(null, false);

    if (error) {
        accept(new Error(message));
    }
}

require('./app/routes.js')(app, passport);

server.listen(port);
console.log('The magic happens on port ' + port);
