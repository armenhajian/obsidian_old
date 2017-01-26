var express = require('express');
var router = express.Router();
var ejs = require('ejs');
var Vimeo = require('vimeo').Vimeo;
var vimdeoLib = new Vimeo('2bb4b73b8527c987b403119c6b69cd798b48cff9',
    'pwy4hDDMhBpNwSckwK04V4cj8RHItOKcL/9bN2p2LYyZY3eaqOIkUfi4ADcRQ9fOslCN+u9HvpG6CFV+7kRnRjZdA/kyIdeRMz88x9vMgWCI3ujPoGMt1R6w99kAurDz',
    '9123306d6f400ce877931a20271ee7e7');
var API500px = require('500px');
var api500px = new API500px("9u3RsnM8YPd7SHfCFwRsVbB0dlggODTu0rSCGFWy");


/* GET home page. */
router.get('/', function (req, res, next) {
    req.db.collection('sliders').find({}, (err, sliders) => {
        req.db.collection('products').find({favorite: 'on'}, (err, products) => {
            res.render('index', {
                sliders: sliders,
                favoriteTours: products,
                currencySymbol: '&pound;',
                headerStyle: 'white',
                lang: req.cookies.lang,
                languages: req._languages
            });
        })
    })

});
router.get('/gallery', function (req, res) {
    res.redirect('/gallery/photos');
});
router.get('/gallery/photos', function (req, res) {
    api500px.photos.getByUsername('toshstepanyan', {
        sort: 'created_at',
        image_size: 21
    }, function (error, results) {
        if (error) {
            console.log(error);
            return;
        }

        res.render('gallery/index', {
            photos: results.photos,
            videos:[],
            languages: req._languages
        })
    });
});
router.get('/gallery/videos', function (req, res) {

    vimdeoLib.request(/*options*/{
        // This is the path for the videos contained within the staff picks channels
        path: '/users/user13916078/videos',
        // This adds the parameters to request page two, and 10 items per page
        query: {}
    }, function (error, body) {
        if (error) {
            console.log(error);
        }

        res.render('gallery/index', {
            videos: body.data,
            photos:[],
            languages: req._languages
        })

    });
});

router.get('/contacts', function (req, res) {
    res.render('contacts', {})
});
router.get('/about', function (req, res) {
    res.render('about', {})
});
router.get('/individual-tour', function (req, res) {
    res.render('individual-tour', {})
});
router.get('/explore-armenia', function (req, res) {
    res.render('explore-armenia', {})
});
module.exports = router;