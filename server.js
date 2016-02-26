var express = require('express');

var app = express();
var port = process.env.PORT || 3000;

var mustacheExpress = require('mustache-express');
app.engine('html', mustacheExpress());
app.set('view engine', 'html');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

require('./app/routes.js')(app);

app.listen(port);
console.log('The magic happens on port ' + port);
