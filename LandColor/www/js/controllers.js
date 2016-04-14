angular.module('starter')

  .controller('ImageController', function($scope,$state, $cordovaDevice, $cordovaFile, $ionicPlatform, $ionicActionSheet, ImageService, FileService,CanvasService) {

    $ionicPlatform.ready(function() {
      $scope.images = FileService.images();
      $scope.$apply();
    });

    $scope.addMedia = function() {
      $scope.hideSheet = $ionicActionSheet.show({
        buttons: [
          { text: '<i class="icon ion-camera"></i>Camera' },
          { text: '<i class="icon ion-images"></i>Photo Gallery' }
        ],
        titleText: 'Add Image',
        cancelText: 'Cancel',
        buttonClicked: function(index) {
          $scope.addImage(index);
        }
      });
    };

    $scope.addImage = function(type) {
      $scope.hideSheet();
      ImageService.handleMediaDialog(type).then(function() {
        $scope.$apply();
      });
    };

    $scope.touchMe = function(event,imageURL) {
      var img = new Image();
      img.src = "data:image/jpeg;base64,"+ imageURL;
      var ogHeight = img.height;
      var ogWidth = img.width;
      if($state.is('card')) {
        var imgContainer = document.getElementById("cardPic");
      }
      else{
        var imgContainer = document.getElementById("soilPic")
      }
      var conHeight = imgContainer.clientHeight;
      var conWidth = imgContainer.clientWidth;
      var x = event.offsetX;
      var y = event.offsetY;
      var xPixel = ogWidth*(x/conWidth);
      var yPixel = ogHeight*(y/conHeight);
      if($state.is('card')){
        CanvasService.setCard(xPixel,yPixel);
        CanvasService.createCardCanvas(img);
      }
      else{
        CanvasService.setSoil(xPixel,yPixel);
        CanvasService.createSoilCanvas(img);
      }


    }
  })

.controller('resultsController',function($scope,$state, $cordovaDevice, $cordovaFile, $ionicPlatform, $ionicActionSheet, ImageService, FileService,CanvasService){

  });


