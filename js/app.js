var weatherApp = angular.module('weatherApp', ['ngResource', 'ngRoute', 'ngAnimate']);

// Routes
weatherApp.config(['$routeProvider',
  function($routeProvider){
      $routeProvider.
        when('/', {
          templateUrl: 'home.html',
          controller: 'homeCtrl'
      }).
      when('/forecast', {
          templateUrl: 'forecast.html',
          controller: 'forecastCtrl'
      }).
      when('/forecast/:numDays', {
          templateUrl: 'forecast.html',
          controller: 'forecastCtrl'
      }).
      otherwise({
         redirectTo: '/' 
      });
}]);

weatherApp.run(function ($rootScope, $location) {
  $rootScope.$on("$locationChangeStart", function (event, next, current) {
    $rootScope.path = $location.path();
  });
});

// Controllers
weatherApp.controller("homeCtrl", ['$scope', '$routeParams', '$location', 'cityService',
    function($scope, $routeParams, $location, cityService){
        $scope.city = cityService.city;
                                   
        // Observe for changes in city
        $scope.$watch('city', function(){
           cityService.city = $scope.city;                        
        });
        
        $scope.submit = function(){
            $location.path("/forecast");
        };
}]);

weatherApp.controller("forecastCtrl", ['$scope', '$routeParams', '$resource','cityService', 
    function($scope, $routeParams, $resource, cityService){
        $scope.city = cityService.city;
        $scope.numDays = $routeParams.numDays || 3;
        $scope.weatherAPI = $resource("http://api.openweathermap.org/data/2.5/forecast/daily?APPID=67e979498c7fe51761d2343b887724be", {
            callback: "JSON_CALLBACK" }, { get: {method: "JSONP"}});
        $scope.weatherResult = $scope.weatherAPI.get({ q: $scope.city, cnt:$scope.numDays });
        
        $scope.convertToCelcius = function(kel){
            return Math.round(kel - 273.15);
        } 
        
        $scope.toDate = function(date){
            return new Date(date * 1000);
        }
}]);

// Services
weatherApp.service('cityService', function(){
    this.city = "Waterloo";
})

weatherApp.directive('weatherSummary', function(){
    return{
        restrict: 'E',
        templateUrl: 'directives/weatherSummary.html',
        replace: true,
        scope: {
            weather: "=",
            convertTemp: "&",
            convertDate: "&",
            dateFormat: "@"
        }
    }
});