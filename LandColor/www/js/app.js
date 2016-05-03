// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'

// camera and image saving functionality: https://devdactic.com/complete-image-guide-ionic/

//cameraApp will load starter and ngCordova
var cameraApp = angular.module('starter', ['ionic', 'ngCordova', 'ngIOS9UIWebViewPatch','ngSanitize', 'ngCsv'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide default accessory bar
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
});

cameraApp.config(function($stateProvider, $urlRouterProvider, $ionicConfigProvider ) {

  //forces tabs to be on bottom
  $ionicConfigProvider.tabs.position("bottom");
  //forces navbar title to be in center
  $ionicConfigProvider.navBar.alignTitle('center');


  $stateProvider
    .state('photos', {
      url: "/photos",
      templateUrl: "templates/photos.html"
    })
    .state('card', {
      url: "/card",
      templateUrl: "templates/card.html",
      controller: 'cardController'
    })
    .state('soil', {
      url: "/soil",
      templateUrl: "templates/soil.html",
      controller: 'soilController'
    })
    .state('results', {
      url: "/results",
      templateUrl: "templates/results.html",
      controller: 'resultsController'
    })
    .state('graphs', {
      url: "/graphs",
      templateUrl: "templates/graphs.html",
      controller: 'graphController'
    })
    .state('tabs', {
      url: "/tab",
      abstract: true,
      templateUrl: "templates/tabs.html"
    })
    .state('tabs.home', {
      url: "/home",
      views: {
        'home-tab': {
          templateUrl: "templates/home.html",
          controller: 'homeController'
        }
      }
    })
    .state('tabs.about', {
      url: "/about",
      views: {
        'about-tab': {
          templateUrl: "templates/about.html"
        }
      }
    })
    .state('tabs.tutorial', {
      url: "/tutorial",
      views: {
        'tutorial-tab': {
          templateUrl: "templates/tutorial.html"
        }
      }
    });

  $urlRouterProvider.otherwise("/tab/home");

});


