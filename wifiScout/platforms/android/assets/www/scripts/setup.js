document.addEventListener('deviceready', function() {
  setup.region();

  document.dispatchEvent(new Event(events.setupDone));
});
