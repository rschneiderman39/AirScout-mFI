/*
*/
app.directive('filterModal', function() {
  return {
    templateUrl: 'views/filterModal.html',
    scope: {
      view: '@'
    },
    controller: 'modalCtrl'
  };
});
