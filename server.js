var express = require('express'),
	app = express(),
	morgan = require('morgan'),
	mongoose = require('mongoose'),
	bodyParser = require('body-parser'),
	server = require('http').createServer(app),
	passport = require('passport'),
	jwt = require('jsonwebtoken');


var config = require('./config.js');

var port = process.env.PORT || config.serverPort;
var env = process.env.NODE_ENV || config.serverEnv;
var jwtSecret = config.jwtSecret;
var dbUrl = config.dbUrl;


app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(morgan(env));
app.use(express.static(__dirname + '/public'));
app.use(passport.initialize());
app.use(passport.session());

app.all('*', function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'OPTIONS, GET, POST, PUT, HEAD, DELETE');
  res.header('Access-Control-Allow-Headers', 'X-Requested-With, content-type, Authorization');
  next();
});


mongoose.connect(dbUrl);

var apiRouter = express.Router();
require('./routes/sign')(apiRouter);
//ONLY AUTHENTICATED USERS BEYOND THIS POINT.
require('./routes/middlewares')(apiRouter);
require('./routes/user')(apiRouter);
app.use('/api', apiRouter);

server.listen(port, function () {
	console.log('Server running in ' + env + ' at ' + port + '.');
});