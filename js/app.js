// app.js
var routerApp = angular.module('routerApp', ['ui.router']);

routerApp.config(function($stateProvider, $urlRouterProvider) {  
  $urlRouterProvider.otherwise('/login');
  
  $stateProvider
      
  // HOME STATES AND NESTED VIEWS ========================================
  .state('home', {
      url: '/home',
      templateUrl: 'partials/home.html',
      data: {
        requireLogin: true
      }
  })
  
  // ABOUT PAGE AND MULTIPLE NAMED VIEWS =================================
  .state('about', {
      url: '/about',
      templateUrl: 'partials/about.html',
      data: {
        requireLogin: true
      }
  })

  .state('login', {
      url: '/login',
      templateUrl: 'partials/login.html',
      data: {
        requireLogin: false
      }
  });
});


routerApp.run(function ($rootScope) {
  $rootScope.currentUser = 'undefined';
  
  $rootScope.$on('$stateChangeStart', function (event, toState, toParams) {
    var requireLogin = toState.data.requireLogin;

    if (requireLogin && $rootScope.currentUser == 'undefined') {
      //empêcher d'accéder à la page sans être identitier
      console.log($rootScope.currentUser);
      event.preventDefault();
    }
  });

});