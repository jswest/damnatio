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

  var overlayButtonClickHandler = function (e) {
    $('#' + $(this).data('overlay')).addClass('active');
    $('#overlay').addClass('active');
    $('svg').each(function (i) {
      var defs = $(this).append("defs");
      var filter = defs.append("filter")
        .attr("id", "blur-" + i);
      filter.append("feGaussianBlur")
        .attr("in", "SourceGraphic")
        .attr("stdDeviation", 10);
      $('svg').attr('filter', 'url(#blur-' + i + ')');
    });
    $('#stream').addClass('blur');
  };

  var overlayXClickHandler = function (e) {
    $('.overlay').removeClass('active');
    $('#overlay').removeClass('active');
    $('#stream').removeClass('blur');
    $('svg').each(function (i) {
      $('svg').attr('filter', '');
    });
  };

  var windowResizeHandler = function (e) {
    $('.pane').height($(window).height() - 44);
  };

  this.on = function () {
    $('.name').on('click', nameClickHandler);
    $('.essay .x').on('click', nameXClickHandler);
    $('.pane').height($(window).height() - 44);
    $('#overlay .x').on('click', overlayXClickHandler);
    $('header#primary-header button').on('click', overlayButtonClickHandler);
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