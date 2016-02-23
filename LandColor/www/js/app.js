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
   //var canvas = document.createElement('canvas');
   var canvas = document.getElementById('canvas');
   //var canvas2 = document.createElement('canvas');
   var canvas2 = document.getElementById('canvas2');
   var context = canvas.getContext('2d');
   var context2 = canvas2.getContext('2d');
   context.drawImage(img, (Math.round(img.width/4)-75), (Math.round(img.height/2)-75), 150, 150, 0, 0, 150, 150);
   context2.drawImage(img, (Math.round(3*img.width/4)-75), (Math.round(img.height/2)-75), 150, 150, 0, 0, 150, 150);

  //Get Pixel Arrays of Calibration Card and Soil Sample
   var imageDataCard = context.getImageData(0,0,150,150);
   var imageDataSample = context2.getImageData(0,0,150,150);
   console.log(imageDataCard);
   console.log(imageDataSample);

  //The size of the palette
   var colorCount = 11;
  //How "well" the median cut algorithm performs
   var quality = 1;
  //Need pixel array that works with quantize.js

   var pixelCard = imageDataCard.data;
   var pixelSample = imageDataSample.data;
   var pixelCount = 22500;
   //Function to get Palette
   var getPalette = function(pixels,pixelCount,quality,colorCount) {
     var pixelArray =[];
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
     console.log(pixelArray);
     //Quantize perform median cut algorithm, and returns a palette of the "top ten" colors in the picture
     var cmap = MMCQ.quantize(pixelArray, colorCount);
     var palette = cmap ? cmap.palette() : null;
     return palette;
   };



   var paletteCard = getPalette(pixelCard,pixelCount,quality,colorCount);
   console.log(paletteCard[0]);
   var paletteSample = getPalette(pixelSample,pixelCount,quality,colorCount);
   console.log(paletteSample[0]);

   var rCorrection = 210.15/paletteCard[0][0];
   var gCorrection = 213.95/paletteCard[0][1];
   var bCorrection = 218.42/paletteCard[0][2];
   var rSample = rCorrection*paletteSample[0][0];
   var gSample = gCorrection*paletteSample[0][1];
   var bSample = bCorrection*paletteSample[0][2];

   function RGBtoLAB(r, g, b){

     function RGBtoXYZ(R, G, B){

       //Observer. = 2°, Illuminant = D65

       var var_R = ( R / 255 );        //R from 0 to 255
       var var_G = ( G / 255 );        //G from 0 to 255
       var var_B = ( B / 255 );        //B from 0 to 255


       if ( var_R > 0.04045 )
         var_R = Math.pow(( ( var_R + 0.055 ) / 1.055 ) , 2.4);
       else
         var_R = var_R / 12.92;

       if ( var_G > 0.04045 )
         var_G = Math.pow((( var_G + 0.055 ) / 1.055 ) , 2.4);
       else
         var_G = var_G / 12.92;

       if ( var_B > 0.04045 )
         var_B = Math.pow((( var_B + 0.055 ) / 1.055 ) , 2.4);
       else
         var_B = var_B / 12.92;

       var_R = var_R * 100;
       var_G = var_G * 100;
       var_B = var_B * 100;

       X = var_R * 0.4124 + var_G * 0.3576 + var_B * 0.1805;
       Y = var_R * 0.2126 + var_G * 0.7152 + var_B * 0.0722;
       Z = var_R * 0.0193 + var_G * 0.1192 + var_B * 0.9505;

       return [X,Y,Z];
     }


     function XYZtoLAB (x, y, z)
     {
       var refX = 95.047;
       var refY = 100.000;
       var refZ = 108.883;

       x = x/refX;
       y = y/refY;
       z = z/refZ;

       // Modify X
       if (x > 0.008856)
       {
         x = Math.pow(x, (1/3));
       }
       else
       {
         x = ((x * 7.787) + (16/116));
       }

       // Modify Y
       if (y > 0.008856)
       {
         y = Math.pow(y, (1/3));
       }
       else
       {
         y = ((y * 7.787) + (16/116));
       }

       // Modify Z
       if (z > 0.008856)
       {
         z = Math.pow(z, (1/3));
       }
       else
       {
         z = ((z * 7.787) + (16/116));
       }

       var l = ((116 * y) - 16);
       var a = (500 * (x - y));
       var b = (200 * (y - z));
       // Return LAB values in an array
       return [l, a, b];
     }
     xyz = RGBtoXYZ(r, g, b);
     lab = XYZtoLAB(xyz[0], xyz[1], xyz[2]);
     return lab;
   }

   var soilSampleLAB = RGBtoLAB(rSample,gSample,bSample);
   console.log(soilSampleLAB);
   $scope.cardPalette = paletteCard;

   $scope.samplePalette = paletteSample;

   $scope.sampleRGB = [rSample,gSample,bSample];
   //Add to screen to check results
   //var labLabel = document.createElement("p");
   //labLabel.appendChild(document.createTextNode("L: "+soilSampleLAB[0].toFixed(2)+" a*: "+soilSampleLAB[1].toFixed(2)+" b*: "+soilSampleLAB[2].toFixed(2)+" R: "+rSample.toFixed(2)+" G: "+gSample.toFixed(2)+" B: "+bSample.toFixed(2)+"   " ));
   //document.getElementById("main").appendChild(labLabel);
   //var cardLabel = document.createElement("p");
   //labLabel.appendChild(document.createTextNode(" Card:  R: "+paletteCard[0][0]+" G: "+paletteCard[0][1]+" B: "+paletteCard[0][1]+" Holla at ya boy"));
   //document.getElementById("main").appendChild(cardLabel);


}


});

cameraApp.controller('rgbController',['$scope', function($scope) {

//$scope.createCanvas = function() {


//}

}]);
