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

  var image = new Image(); 
  image.onload = function() {
    canvas.width = image.width;
    canvas.height = image.height;
    ctx.drawImage(image, 0, 0);

    recaculateScale(canvas);
    return canvas;
  }

  image.src = IMAGE_POSITION;

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

  $(canvas).mousemove(function(evt) {
    var offset = $(this).offset();
    var point = {
      x : (evt.pageX - offset.left) / canvas_scale,
      y : (evt.pageY - offset.top) / canvas_scale
    };

    var face = faces_in_canvas.find(f => isHover(f, point));
  
    if (!face) {
      return $resume.hide();
    } 

    $resume.css({
      position: 'absolute',
      left: evt.pageX + 5,
      top: evt.pageY + 5
    });
    $resume.text(JSON.stringify(face, null, 2));
    $resume.show();
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