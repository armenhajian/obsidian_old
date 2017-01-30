var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var i18nService = require('./bin/i18n/i18n-service.js');
var mongojs = require('mongojs');
var i18n = require("i18n");
var fs = require('fs');

//evennode: "mongodb://" + hosting_config.mongo.user + ":" + mongoPassword + "@" +hosting_config.mongo.hostString
//heroku : mongodb://heroku_mtgr2l60:o8330a89nkct2o96f99jspsks0@ds145208.mlab.com:45208/heroku_mtgr2l60

if (process.env.APP_CONFIG) {
    //prod:
    var hosting_config = JSON.parse(process.env.APP_CONFIG);
    console.log(hosting_config);
    var mongoPassword = "hjgJH675&%^%^%fgDT4";
    var url = 'mongodb://'+hosting_config.mongo.user + ":" + mongoPassword + "@" + hosting_config.mongo.hostString;
    console.log('url ',url);
    var db = mongojs('mongodb://5ef609ba77950b0bc7eff2b89f6267e5:hjgJH675&%^%^%fgDT4@32-1a.mongo.evennode.com:27017/5ef609ba77950b0bc7eff2b89f6267e5');
} else {
    //local:
    var db = mongojs('obsidian');
}

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
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
    req.db = db;
    req.db.collection('languages').find({checked: true}, (err, languages) => {
        req._languages = languages.length > 0 ? languages : [{name:'English', checked: true}];
        if(req._languages.indexOf(req.cookies.lang) < 0) {
            req.cookies.lang = req._languages[0].name;
            res.cookie('lang',req.cookies.lang, { maxAge: 900000});
        }
        console.log(req.cookies);
        next();
    });
});

i18n.configure({
    locales: fs.readdirSync(__dirname + '/i18n').map(filename => {
        return filename.split('.json')[0];
    }),
    directory: __dirname + '/i18n',
    cookie: 'lang',
    autoReload: true
    // updateFiles:false
});
app.use(i18n.init);

// app.use((req, res, next) =>{
//     i18n({
//         translationsPath: path.join(__dirname, 'i18n'), // <--- use here. Specify translations files path.
//         siteLangs: ["English","es"],
//         cookieLangName:req.lang
//     });
//     next();
// });

// function languageMiddleware(routes) {
//     routes.map(route=>{
//         app.get(route, (req, res) => res.redirect(`/${i18nService.getDefaultLanguageCode(req)+route}`));
//     })
// }
// languageMiddleware([
//     '/',
//     '/tours',
//     '/admin',
//     'explore-armenia',
//     '/gallery',
//     '/gallery/photos',
//     '/gallery/videos',
//     '/about',
//     '/contacts'
// ]);
app.use('/', index);
app.use('/tours', tours);
app.use('/admin', admin);


// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});


// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;
