var tab = document.getElementById('nav-bar');

var hammertime = new Hammer(tab);
hammertime.on('panup', function(ev) {
  var navBar = $('#nav-bar');
  navBar.css('bottom', '0px');
  navTimeout = setTimeout(function() {
    navBar.css('bottom', 1 - $('#nav-bar').height());
  }, 3000);});