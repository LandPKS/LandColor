// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'

// camera and image saving functionality: https://devdactic.com/complete-image-guide-ionic/

//cameraApp will load starter and ngCordova
var cameraApp = angular.module('starter', ['ionic', 'ngCordova'])

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

cameraApp.controller('imageController', function($scope, $cordovaCamera, $cordovaFile) {
  // Scope array for ng-repeat (array of objects) to store images
  $scope.images = [];

  $scope.addImage = function() {
    // cordovaCamera options
    var options = {
      destinationType : Camera.DestinationType.FILE_URI,
      sourceType : Camera.PictureSourceType.CAMERA,
      allowEdit : false,
      encodingType: Camera.EncodingType.JPEG,
      popoverOptions: CameraPopoverOptions,
    };

    // Call ngCordova module: cordovaCamera
    $cordovaCamera.getPicture(options).then(function(imageData) {

      // Pass captured image and save to file system
      onImageSuccess(imageData);

      function onImageSuccess(fileURI) {
        createFileEntry(fileURI);
      }

      function createFileEntry(fileURI) {
        window.resolveLocalFileSystemURL(fileURI, copyFile, fail);
      }

      // Name image with makeid()
      function copyFile(fileEntry) {
        var name = fileEntry.fullPath.substr(fileEntry.fullPath.lastIndexOf('/') + 1);
        var newName = makeid() + name;

        window.resolveLocalFileSystemURL(cordova.file.dataDirectory, function(fileSystem2) {
            fileEntry.copyTo(
              fileSystem2,
              newName,
              onCopySuccess,
              fail
            );
          },
          fail);
      }

      // Apply image to scope array of images
      function onCopySuccess(entry) {
        $scope.$apply(function () {
          $scope.images.push(entry.nativeURL);
        });
      }

      function fail(error) {
        console.log("fail: " + error.code);
      }

      function makeid() {
        var text = "";
        var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

        for (var i=0; i < 5; i++) {
          text += possible.charAt(Math.floor(Math.random() * possible.length));
        }
        return text;
      }

    }, function(err) {
      console.log(err);
    });
  }

  // Find path to data directory of LandColor application
  $scope.urlForImage = function(imageName) {
    var name = imageName.substr(imageName.lastIndexOf('/') + 1);
    var trueOrigin = cordova.file.dataDirectory + name;
    return trueOrigin;
  }

});

cameraApp.controller('rgbController',['$scope', function($scope) {

  var img = new Image();
  img.src = 'http://seedlab.oregonstate.edu/sites/default/files/images/soil.jpg';
  var canvas = document.createElement('canvas');
  var context = canvas.getContext('2d');
  context.drawImage(img, 0, 0);
  var imageData = context.getImageData(0, 0, img.width, img.height);
  //console.log(imageData[0]);

  $scope.christina = "Hi";
}]);
