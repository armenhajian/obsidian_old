var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongojs = require('mongojs');
var hosting_config = JSON.parse(process.env.APP_CONFIG);
var mongoPassword = "hjgJH675&%^%^%fgDT4";
var db = mongojs("mongodb://" + hosting_config.mongo.user + ":" + mongoPassword + "@" +hosting_config.mongo.hostString);
//heroku : mongodb://heroku_mtgr2l60:o8330a89nkct2o96f99jspsks0@ds145208.mlab.com:45208/heroku_mtgr2l60

var index = require('./routes/index');
var tours = require('./routes/tours');
var admin = require('./routes/admin');

var app = express();

global.appRoot = path.resolve(__dirname);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(function(req, res, next) {
    req.db = db;
    next();
});

app.use('/', index);
app.use('/tours', tours);
app.use('/admin', admin);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});


// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
