routerApp.controller('loginController', ['$scope', '$rootScope', function ($scope, $rootScope) {

  $scope.submit = function () {
  	console.log("submit");
    if ($scope.text) {
    	console.log($scope.text);
    	$rootScope.currentUser = $scope.text;
    }
  };

}]);