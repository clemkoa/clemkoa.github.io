var app=angular.module('myApp',[])
.controller('refresh_control',function($scope,$interval){
	var c=0;
	$scope.message=c + " seconds";
	$interval(function(){
		$scope.message=c + " seconds";
		c++;
	},1000);
});