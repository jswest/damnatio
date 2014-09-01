DAB = {};



DAB.App = function () {

  var nameXClickHandler = function (e) {
    e.stopPropagation(); // annoying. fix this.
    console.log('clicked')
    console.log($(this).parent());
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
});