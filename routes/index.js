const express = require('express'),
      fs = require('fs'),
      request = require('request'),
      url = require('url'),
      mock = require('./mock');

const router = express.Router();
const SECRET_KEY = process.env.HAVENONDEMOND_KEY;

if (!SECRET_KEY) {
  throw new Error('No Haven On Demand API key found');
}

// const havenondemand = require('havenondemand');
// const client = new havenondemand.HODClient(SECRET_KEY);

router.get('/', function(req, res, next) {
  res.render('index', { title: 'Platonic Academic' });
});

const HOD_URL = 'https://api.havenondemand.com/1/api/sync/detectfaces/v1';

router.post('/detect-face', function(req, res, next) {
  const publicRoot = url.resolve(__dirname, '/public');
  const formData = {
    apikey : SECRET_KEY,
    additional : 'true',
    face_orientation : 'any',
    file : fs.createReadStream(publicRoot + req.body.url)
  };

  //----------------------------------------------------------------
  // Note: Face detection action will take a READLLY long time to finish
  // in my environment, it takes 111112.637ms, for debug purpose return its
  // result directly.
  //----------------------------------------------------------------
  //
  // request.post({ url: HOD_URL, formData : formData }, function(err, resp, body) {
  //   if (err) {
  //     return console.error('upload failed:', err);
  //   }
  //   const faces = JSON.parse(body);
  //   res.send(faces);
  // });
  //
  res.send(mock.DETECT_FACE_RESP);
});

module.exports = router;
