DAB = {};
DAB.interludes = [];


DAB.App = function () {

  var nameXClickHandler = function (e) {
    e.stopPropagation(); // annoying. fix this.
    $(this).parent().removeClass('expanded');
  };

  var nameClickHandler = function (e) {
    if (!$(this).hasClass('expanded')) {
      $(this).addClass('expanded');
    }
  };

  var windowResizeHandler = function (e) {
    $('.pane').height($(window).height() - 44);
  };

  this.on = function () {
    $('.name').on('click', nameClickHandler);
    $('.essay .x').on('click', nameXClickHandler);
    $('.pane').height($(window).height() - 44);
  };
  
};





$(document).ready(function () {
  DAB.app = new DAB.App();
  DAB.app.on();

  // TODO: make this happen on inview
  _.each(DAB.interludes, function (interlude) {
    interlude.on();
  });

});