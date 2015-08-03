document.addEventListener('deviceready', function() {
  setup.strings();
  document.dispatchEvent(new Event('setupdone'));
});
