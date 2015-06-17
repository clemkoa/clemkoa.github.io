var app = angular.module('myApp',[])
.controller('refreshControl',function($scope, $interval) {
	var c = $scope.startingTime || 0;
	$scope.time = c;
	$interval(function() {
		$scope.time = c;
		c++;
	}, 1000);
    }
);