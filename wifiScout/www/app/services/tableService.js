app.factory('tableService', function($http, $q) {
    console.log("IN TABLE SERVICE");
    var deferred = $q.defer();

    var service = {};

    $http.get('sampleData.json').then(function (data) {
        deferred.resolve(data);
    });

    service.getAPS = function () {
        return deferred.promise;
    };

    return service;
});