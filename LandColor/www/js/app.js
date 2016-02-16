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

      // Name image with date/time
      function copyFile(fileEntry) {
        var name = fileEntry.fullPath.substr(fileEntry.fullPath.lastIndexOf('/') + 1);
        var newName = getDate() + name;

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

      function getDate() {
        var text = "";
        var d = new Date();
        var n = d.getTime();

        return text = n;
      }

    }, function(err) {
      console.log(err);
    });
  };

  // Find path to data directory of LandColor application
  $scope.urlForImage = function(imageName) {
    var name = imageName.substr(imageName.lastIndexOf('/') + 1);
    var trueOrigin = cordova.file.dataDirectory + name;
    return trueOrigin;
  };

 $scope.createCanvas = function() {
  //Create canvas element with image to get RGBA array
  var img = document.getElementById("image");
  var canvas = document.createElement('canvas');
  var context = canvas.getContext('2d');
  context.drawImage(img, 0, 0);
  var imageData = context.getImageData(0, 0, img.width, img.height);
   var imageData2;
  //The size of tahe palette
  var colorCount = 11;
  //How "well" the median cut algorithm performs
  var quality = 1;
  //Need pixel array that works with quantize.js
  var pixels = imageData.data;
  var pixelCount = img.width * img.height;
  var pixelArray = [];
  for (var i = 0, offset, r, g, b, a; i < pixelCount; i = i + quality) {
    offset = i * 4;
    r = pixels[offset + 0];
    g = pixels[offset + 1];
    b = pixels[offset + 2];
    a = pixels[offset + 3];
    // If pixel is mostly opaque and not white
    if (a >= 125) {
      if (!(r > 250 && g > 250 && b > 250)) {
        pixelArray.push([r, g, b]);
      }
    }
  }
  //Quantize perform median cut algorithm, and returns a palette of the "top ten" colors in the picture
  var cmap    = MMCQ.quantize(pixelArray, colorCount);
  var palette = cmap? cmap.palette() : null;
   var newLabel = document.createElement("label");
   newLabel.appendChild(document.createTextNode(palette[0]));
   document.getElementById("main").appendChild(newLabel);
  return palette;
}


});

cameraApp.controller('rgbController',['$scope', function($scope) {

//$scope.createCanvas = function() {


//}

}]);
