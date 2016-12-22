var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
    req.db.collection('sliders').find({}, (err, sliders) => {
        req.db.collection('products').find({favorite:'on'}, (err, products) => {
            res.render('index', {
                sliders: sliders,
                favoriteTours:products,
                currencySymbol: '&pound;'
            });
        })
    })

});

module.exports = router;
