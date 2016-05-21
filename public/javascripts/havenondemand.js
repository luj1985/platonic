$(function() {
  const IMAGE_POSITION = "/images/Sanzio_01.jpg",
        FACE_RECTANGLE_LINE_WIDTH = 3.0,
        FACE_RECTANGLE_LINE_COLOR = 'red';

  var canvas = document.getElementById('workspace');
  var ctx = canvas.getContext('2d');
  var canvas_scale = 1;

  function recaculateScale(canvas, scale) {
    var width = canvas.width,
        to_width = $(canvas).width(),
        scale = scale || 1;
    canvas_scale = (to_width / width) * scale;
    console.log(`scale ${canvas_scale}`);
  }

  var platonic = new Image(); 
  platonic.onload = function() {
    canvas.width = platonic.width;
    canvas.height = platonic.height;
    ctx.drawImage(platonic, 0, 0);

    recaculateScale(canvas);
    return canvas;
  }

  platonic.src = IMAGE_POSITION;

  var $section = $('#inverted-contain');
  var pz = $section.find('.panzoom').panzoom({
    $zoomRange: $section.find(".zoom-range"),
    $reset: $section.find(".reset"),
    startTransform: 'scale(1)',
    increment: 0.1,
    minScale: 1,
    contain: 'invert'
  });

  pz.on('panzoomzoom', function(e, pz, scale, opts) {
    recaculateScale(canvas, scale);
  });

  function isHover(r, p) {
    return p.x > r.left && p.x < (r.left + r.width) &&
           p.y > r.top && p.y < (r.top + r.height);
  }



  var faces_in_canvas = [];

  var $resume = $('#resume');

  var hovered_face = null;


  var head = document.getElementById('face');
  var headCtx = head.getContext('2d');

  function cropFaceAndDisplayOnResumePanel(face) {
    var l = face.left, t = face.top, w = face.width, h = face.height;
    head.width = w;
    head.height = h;
    headCtx.drawImage(platonic, l, t, w, h, 0, 0, w, h);
    return head.toDataURL();
  }

  $(canvas).mousemove(function(evt) {
    var offset = $(this).offset();
    var point = {
      x : (evt.pageX - offset.left) / canvas_scale,
      y : (evt.pageY - offset.top) / canvas_scale
    };

    var face = faces_in_canvas.find(f => isHover(f, point));
  
    if (!face) {
      hovered_face = null;
      return $resume.hide();
    } 

    if (hovered_face !== face) {
      $resume.css({
        position: 'absolute',
        left: evt.pageX + 5,
        top: evt.pageY + 5
      });

      var img = cropFaceAndDisplayOnResumePanel(face);
      var base64Img = img.split('base64,')[1];

      var description = $resume.find('.description');
      description.html('<strong>Loading...</strong>');
      $.post('/image-identify', { bimg: base64Img }, function(data) {
        // description.text(data);
        var wiki = JSON.parse(data);
        var pages = wiki.query.pages;
        var pageid = Object.keys(pages)[0];
        if (pageid) {
          var page = pages[pageid].extract;
          // send image to backend, and get back the description.
          description.html(page);
        } else {
          description.html('<h3>No wiki found</h3>');
        }
      });
      $resume.show();
    }

    hovered_face = face;
  });


  // var others = face.additional_information; // { age: "adult"}

  function drawFaceRectangles(data) {
    ctx.save(); 
    
    ctx.lineWidth = FACE_RECTANGLE_LINE_WIDTH; 
    ctx.strokeStyle = FACE_RECTANGLE_LINE_COLOR;

    var faces = data.face;
    faces.forEach(f => ctx.strokeRect(f.left, f.top, f.width, f.height));
    faces_in_canvas = faces;

    ctx.restore(); 
  }


  // in fact we can send image directly from client if CORS was disabled.
  $('#detect').on('click', function() {
    $.post('/detect-face', { url : IMAGE_POSITION })
    .then(drawFaceRectangles)
    .fail(function(err) {
      // alert(err.statusText);

    });
  });
});