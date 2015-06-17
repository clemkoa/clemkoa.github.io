app.directive('timerInfo', function() { 
  return { 
    restrict: 'E', 
    scope: { 
    	startingTime: '=' 
    }, 
    template: '<p> {{ time }} </p>',
    controller: 'refreshControl'
  }
});