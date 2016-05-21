$(function() {
  var $workspace = $('img#workspace');

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

  $('#detect').on('click', function() {
    var src = $workspace.attr('src');
    $.post('/detect-face', { url : src }).then(function(data) {
      console.log(data);
    }).fail(function(err) {
      // alert(err.statusText);

    });
  });
});