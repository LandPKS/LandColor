// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'

// camera and image saving functionality: https://devdactic.com/complete-image-guide-ionic/

//cameraApp will load starter and ngCordova
var cameraApp = angular.module('starter', ['ionic', 'ngCordova', 'ngIOS9UIWebViewPatch'])

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



cameraApp.controller('imageController', function($scope, $cordovaCamera, $cordovaFile, $ionicActionSheet, $ionicPopup ) {
  // Scope array for ng-repeat (array of objects) to store images
  $scope.images = [];


  $scope.init = function(){
    $scope.cardButton = {
    label: "Card",
    state: true
    };
    $scope.soilButton = {
    label: "Soil",
    state: false
    };
  }

  $scope.toggle = function (buttonType) {
    if(buttonType === "Card"){
      if($scope.cardButton.state === false){
        $scope.cardButton.state = true;
        $scope.soilButton.state = false;
        console.log("card false to true");
      }
    } else {
      if($scope.soilButton.state === false){
        $scope.cardButton.state = false;
        $scope.soilButton.state = true;
        console.log("soil false to true");
      }


    }
  };


  $scope.addImage = function() {
    var options = {
      //quality: 96 // Quality of the saved image, range of 0 - 100
      destinationType : Camera.DestinationType.FILE_URI,
      allowEdit : false, //Allow simple editing of image before selection
      encodingType: Camera.EncodingType.JPEG,
      popoverOptions: CameraPopoverOptions // iOS-only options that specify popover location in iPad
      //correctOrientation: true, // correct camera captured images in case wrong orientation
      //cameraDirection: 0 // Back = 0, Front-facing = 1
    };
    // prompt user for Camera or Gallery
    $ionicActionSheet.show({
      buttons: [
        { text: '<i class="icon ion-camera"></i>Camera' },
        { text: '<i class="icon ion-images"></i>Photo Gallery' }
      ],
      cancelText: 'Cancel',
      cancel: function () {
        return true;
      },
      buttonClicked: function (index) {
        switch (index) {
          case 0:
            options.sourceType = Camera.PictureSourceType.CAMERA;
            break;
          case 1:
            options.sourceType = Camera.PictureSourceType.PHOTOLIBRARY;
            break;
        }
        // Call ngCordova module: cordovaCamera to bring up camera
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
          // **not working**
          function getDate() {
            var text = "";
            var d = new Date();
            var n = d.getTime();

            return text = n;
          }

        }, function (err) {
          console.log(err);
        });
        return true;
      }
    });
  };

  // Find path to data directory of LandColor application
  $scope.urlForImage = function(imageName) {
    var name = imageName.substr(imageName.lastIndexOf('/') + 1);
    var trueOrigin = cordova.file.dataDirectory + name;
    return trueOrigin;
  };

  $scope.showColor = function(imageURL) {
    var img = new Image();
    img.src = imageURL;
    $scope.createCanvas(img);
  };

  $scope.xCard=100;
  $scope.yCard=100;
  $scope.xSoil=100;
  $scope.ySoil=100;
  $scope.touchMe = function(event,imageURL){
    var img = new Image();
    img.src = imageURL;
    $scope.createCanvases(img);
    if($scope.cardButton.state === true){
       var x = event.offsetX;
       var y = event.offsetY;
      $scope.xCard = x;
      $scope.yCard = y;
    } else {
       var x = event.offsetX;
       var y = event.offsetY;
      $scope.xSoil = x;
      $scope.ySoil = y;
    }

  };

  $scope.deleteImage=function(imageURL){
    var index = $scope.images.indexOf(imageURL);
    $scope.images.splice(index, 1);
  };
  $scope.showConfirm = function(imageURL) {
    var confirmPopup = $ionicPopup.confirm({
      title: '<i class="icon ion-sad-outline"></i> Delete Image',
      template: 'Are you sure you want to delete this image?'
    });

    confirmPopup.then(function(res) {
      if(res) {
        $scope.deleteImage(imageURL);
      } else {
        return true;
      }
    });
  };

  $scope.sampleActionSheet=function(imageURL){
    var hideSheet = $ionicActionSheet.show({
      buttons: [
        { text: '<i class="icon ion-android-color-palette"></i>Get Color' }
      ],
      destructiveText: '<i class="icon ion-trash-a"></i>Delete',
      cancelText: 'Cancel',
      cancel: function() {
        return true;
      },
      destructiveButtonClicked: function(){
        $scope.showConfirm(imageURL);
        return true;

      },
      buttonClicked: function(index) {
        if(index === 0){
          $scope.showColor(imageURL);
          return true;
        }
      }
    });
    $timeout(function() {
      hideSheet();
    }, 2000);
  };


  $scope.createCanvases = function(image){
    //Create canvas element with image to get RGBA array

    var cardCanvas = document.getElementById('canvas');
    var soilCanvas = document.getElementById('canvas2');
    var cardContext = cardCanvas.getContext('2d');
    var soilContext = soilCanvas.getContext('2d');
    cardContext.drawImage(image, $scope.xCard-100, $scope.yCard-100, 200, 200, 0, 0, 200, 200);
    soilContext.drawImage(image, $scope.xSoil-100, $scope.ySoil-100, 200, 200, 0, 0, 200, 200);
  };
 $scope.createCanvas = function(image) {
  //Create canvas element with image to get RGBA array
    var img = image;
   //var img = document.getElementById("image");
   //var canvas = document.createElement('canvas');
   var canvas = document.getElementById('canvas');
   //var canvas2 = document.createElement('canvas');
   var canvas2 = document.getElementById('canvas2');
   var context = canvas.getContext('2d');
   var context2 = canvas2.getContext('2d');
   context.drawImage(img, (Math.round(img.width/4)-100), (Math.round(img.height/2)-100), 200, 200, 0, 0, 200, 200);
   context2.drawImage(img, (Math.round(3*img.width/4)-100), (Math.round(img.height/2)-100), 200, 200, 0, 0, 200, 200);

  //Get Pixel Arrays of Calibration Card and Soil Sample
   var imageDataCard = context.getImageData(0,0,200,200);
   var imageDataSample = context2.getImageData(0,0,200,200);
  //The size of the palette
   var colorCount = 11;
  //How "well" the median cut algorithm performs
   var quality = 1;
  //Need pixel array that works with quantize.js

   var pixelCard = imageDataCard.data;
   var pixelSample = imageDataSample.data;
   var pixelCount = 40000;
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
   var paletteSample = getPalette(pixelSample,pixelCount,quality,colorCount);


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
       return [l.toFixed(2), a.toFixed(2), b.toFixed(2)];
     }
     xyz = RGBtoXYZ(r, g, b);
     lab = XYZtoLAB(xyz[0], xyz[1], xyz[2]);
     return lab;
   }
   function cardRGBLab(palette,number){
     r = palette[number][0];
     g = palette[number][1];
     b = palette[number][2];
     var rgb = [r,g,b];
     var lab = RGBtoLAB(r,g,b);
     return{
       rgb : rgb,
       lab : lab
     };
   }
   function sampleRGBLab(paletteCard,numberCard,paletteSample,numberSample){
     var rCorrection = 210.15/paletteCard[numberCard][0];
     var gCorrection = 213.95/paletteCard[numberCard][1];
     var bCorrection = 218.42/paletteCard[numberCard][2];
     var r = rCorrection*paletteSample[numberSample][0];
     var g = gCorrection*paletteSample[numberSample][1];
     var b = bCorrection*paletteSample[numberSample][2];
     var lab = RGBtoLAB(r,g,b);
     var rgb=[r.toFixed(2), g.toFixed(2), b.toFixed(2)];
     var rgbRaw=[paletteSample[numberSample][0],paletteSample[numberSample][1],paletteSample[numberSample][2]];
     return{
       rgb : rgb,
       lab : lab,
       rgbRaw : rgbRaw
     };
   }

   var card = cardRGBLab(paletteCard,0);
   //$scope.card = "Lab: " + card.lab + " RGB: "+ card.rgb;
   $scope.card = "RGB: "+ card.rgb;
   var sample = sampleRGBLab(paletteCard,0,paletteSample,0);
   //$scope.sample ="Lab: " + sample.lab + " RGB: "+ sample.rgb + " Raw: "+ sample.rgbRaw;
   $scope.sample =  " RGB: "+ sample.rgbRaw;
   //$scope.items.push({rCard: card.rgb[0], gCard: card.rgb[1], bCard: card.rgb[2], rSample: sample.rgbRaw[0], gSample: sample.rgbRaw[1], bSample: sample.rgbRaw[2]});
};





});
