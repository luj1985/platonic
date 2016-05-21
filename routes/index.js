const express = require('express'),
      havenondemand = require('havenondemand'),
      fs = require('fs');

const router = express.Router();
const SECRET_KEY = process.env.HAVENONDEMOND_KEY;

if (!SECRET_KEY) {
  throw new Error('No Haven On Demand API key found');
}

const client = new havenondemand.HODClient(SECRET_KEY);

router.get('/', function(req, res, next) {
  res.render('index', { title: 'Platonic Academic' });
});

router.post('/detect-face', function(req, res, next) {
  const url = req.body.url;
  console.log(`server side got ${url}`);
});

module.exports = router;
