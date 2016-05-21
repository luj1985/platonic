const express = require('express'),
      havenondemand = require('havenondemand'),
      fs = require('fs'),
      request = require('request');

const router = express.Router();
const SECRET_KEY = process.env.HAVENONDEMOND_KEY;


if (!SECRET_KEY) {
  throw new Error('No Haven On Demand API key found');
}

const client = new havenondemand.HODClient(SECRET_KEY);

router.get('/', function(req, res, next) {
  res.render('index', { title: 'Platonic Academic' });
});


const HOD_URL = 'https://api.havenondemand.com/1/api/sync/detectfaces/v1';

router.post('/detect-face', function(req, res, next) {
  const url = req.body.url;
  
  const formData = {
    apikey : SECRET_KEY,
    additional : 'true',
    face_orientation : 'any',
    file : fs.createReadStream(__dirname + '/../public' + url)
  };

  const start = new Date().getTime();
  request.post({ url: HOD_URL, formData : formData }, function(err, resp, body) {
    const end = new Date().getTime();
    console.log(`face detection has used ${end - start}ms to finish!`);
    if (err) {
      return console.error('upload failed:', err);
    }
    res.send(body);
  });
});

module.exports = router;
