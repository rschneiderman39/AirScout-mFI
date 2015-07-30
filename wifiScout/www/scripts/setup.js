document.addEventListener('deviceready', function() {
  app.setup.strings();
  document.dispatchEvent(new Event('setupdone'));
});
