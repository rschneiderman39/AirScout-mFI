app.service("tableService", function($http, $q) {
    console.log("IN TABLE SERVICE");
    var deferred = $q.defer();
    $http.get('sampleData.json').then(function (data) {
        deferred.resolve(data);
    });

    this.getAPS = function () {
        return deferred.promise;
    }
});