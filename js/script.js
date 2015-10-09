function init() {
  var height = $(window).height();
  $('.homepage').css({'min-height': height - 80});
  $('.homepage-wrapper').css({'top': height/4});
}

$( window ).resize(function() {
  init();
});

init();
