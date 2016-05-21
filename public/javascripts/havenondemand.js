$(function() {
  var $workspace = $('img#workspace');

  $('#detect').on('click', function() {
    var width = $workspace.width(),
        height = $workspace.height();

    var src = $workspace.attr('src');
    $.post('/detect-face', { url : src }).then(function(data) {
      console.log(data);
    }).fail(function(err) {
      // alert(err.statusText);

    });
  });
});