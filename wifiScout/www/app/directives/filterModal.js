/* A reusable button that expands to a modal, allowing the user to select
* which APs they want to display for a given view.
* Usage: <div filter-modal view="table"></div>
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