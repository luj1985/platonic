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

router.get('/', (req, res, next) => {
  res.render('index', { title: 'Platonic Academic' });
});

const HOD_DETECTFACE_URL = 'https://api.havenondemand.com/1/api/sync/detectfaces/v1';

router.post('/detect-face', (req, res, next) => {
  const formData = {
    apikey : SECRET_KEY,
    additional : 'true',
    face_orientation : 'any',
    file : fs.createReadStream(__dirname + '/../public' + req.body.url)
  };

  //----------------------------------------------------------------
  // Note: Face detection action will take a READLLY long time to finish
  // in my environment, it takes 111112.637ms, for debug purpose return its
  // result directly.
  //----------------------------------------------------------------
  //
  // request.post({ url: HOD_DETECTFACE_URL, formData : formData }, function(err, resp, body) {
  //   if (err) {
  //     return console.error('upload failed:', err);
  //   }
  //   const faces = JSON.parse(body);
  //   res.send(faces);
  // });
  //
  res.send(mock.DETECT_FACE_RESP);
});


const HOD_ENTITYEXTRACT_URL = 'https://api.havenondemand.com/1/api/sync/extractentities/v2';

router.post('/image-identify', (req, res, next) => {
  var img = req.params.bimg;

  // TODO: send this image to IDOL and get the name;
  var name = "Plato";

  request.get({
    url: 'https://en.wikipedia.org/w/api.php', 
    qs: { 
      format : "json",
      action : "query",
      prop : "extracts",
      exsentences : 2,  // wikipage sometimes is quite large ...
      titles : name
    }
  }, (err, resp, body) => {
    res.send(body);



    // XXX: use IDOL On Demand to extract wiki entity
    // request.post({ 
    //   url : HOD_ENTITYEXTRACT_URL, form: {
    //     apikey : SECRET_KEY,
    //     additional : 'true',
    //     text : body,
    //     entity_type : 'people_eng'
    //   }
    // }, (err, resp, body) => {
    //   res.send(body);
    // })
  });
});

module.exports = router;
