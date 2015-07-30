document.addEventListener('deviceready', function() {
  globals.setup.strings();
  document.dispatchEvent(new Event('setupdone'));
});
