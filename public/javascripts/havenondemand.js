$(function() {
  const IMAGE_POSITION = "/images/Sanzio_01.jpg",
        FACE_RECTANGLE_LINE_WIDTH = 3.0,
        FACE_RECTANGLE_LINE_COLOR = 'red';

  var canvas = document.getElementById('workspace');
  var ctx = canvas.getContext('2d');

  var image = new Image(); 
  image.onload = function() {
    canvas.width = image.width;
    canvas.height = image.height;
    ctx.drawImage(image, 0, 0);
    return canvas;
  }

  image.src = IMAGE_POSITION;

  var $section = $('#inverted-contain');
  $section.find('.panzoom').panzoom({
    $zoomIn: $section.find(".zoom-in"),
    $zoomOut: $section.find(".zoom-out"),
    $zoomRange: $section.find(".zoom-range"),
    $reset: $section.find(".reset"),
    startTransform: 'scale(1.1)',
    increment: 0.1,
    minScale: 1,
    contain: 'invert'
  }).panzoom('zoom');


  function drawFaceRectangles(data) {
    ctx.save(); 
    
    ctx.lineWidth = FACE_RECTANGLE_LINE_WIDTH; 
    ctx.strokeStyle = FACE_RECTANGLE_LINE_COLOR;

    var faces = data.face;
    faces.forEach(function(face) {
      var others = face.additional_information; // { age: "adult"}
      ctx.strokeRect(face.left, face.top, face.width, face.height); 
    });
    
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