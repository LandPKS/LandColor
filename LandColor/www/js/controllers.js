angular.module('starter')
  .controller('NavCtrl', function($scope, $ionicSideMenuDelegate) {
    $scope.showMenu = function () {
      $ionicSideMenuDelegate.toggleLeft();
    };
    $scope.showRightMenu = function () {
      $ionicSideMenuDelegate.toggleRight();
    };
  })

  .controller('homeController',function($scope,ImageService,$state){
    $scope.number;
    $scope.addPic = function(num){
      ImageService.setMainPic("img/soilSample/soilSample(" + num + ").jpg");
      $state.go('card', {});
    }

    })

  .controller('imageController',function($scope,$state, $cordovaCamera,$cordovaDevice, $cordovaFile, $ionicPlatform, $ionicActionSheet,ImageService,CanvasService){
    //Get main picture

    $scope.addImage = function(){
        var options = {
          //quality: 96 // Quality of the saved image, range of 0 - 100
          destinationType : Camera.DestinationType.DATA_URL,
          allowEdit : false, //Allow simple editing of image before selection
          encodingType: Camera.EncodingType.JPEG,
          popoverOptions: CameraPopoverOptions, // iOS-only options that specify popover location in iPad
          //targetHeight: 2000,
          //targetWidth: 2000
          correctOrientation: $scope.iOS // correct camera captured images in case wrong orientation
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
            $cordovaCamera.getPicture(options).then(function(imageBase64) {
              ImageService.setMainPic(imageBase64);
            });
            $state.go('card', {});
            return true;

          }
        });
    };
    $scope.$watch(function() {
      $scope.mainPic = ImageService.getMainPic();
    });
    //Used to set (x,y) coordinates that are used in drawing the soil and card canvases
    $scope.touchMe = function(event,id) {
      var imgContainer;
      var imageURL = ImageService.getMainPic();
      var img = new Image();
      img.src = imageURL;

      var ogHeight = img.height;
      var ogWidth = img.width;
      if($state.is('card')) {
         imgContainer = document.getElementById("cardPic");
      }
      else{
         imgContainer = document.getElementById("soilPic")
      }
      var conHeight = imgContainer.clientHeight;
      var conWidth = imgContainer.clientWidth;
      var x = event.offsetX;
      var y = event.offsetY;
      var xPixel = ogWidth*(x/conWidth);
      var yPixel = ogHeight*(y/conHeight);
      if($state.is('card')){
        CanvasService.setCard(xPixel,yPixel);
        CanvasService.createCardCanvas(img,id);
      }
      else{
        CanvasService.setSoil(xPixel,yPixel);
        CanvasService.createSoilCanvas(img,id);
      }

    }

  })
  .controller('soilController',function($scope,$state,CanvasService,ColorService, $ionicPopup){
    //Call getColor every time one presses Done Button
    $scope.getColor = function(){
      ColorService.getColor();
    };
    var showingText1 = "The soil sample is the dirt that was collected for analysis. To get the best results, put the soil next to the color card.";
    $scope.warning = function(){
      var alert = $ionicPopup.alert({
        title: 'Soil Sample',
        template: showingText1
      })
    }
  })


.controller('cardController',function($scope,$state,CanvasService, $ionicPopup){
  $scope.startOver = function() {
    CanvasService.refreshCanvas('cardCanvas');
    $state.go('tabs.home');
  };
  var showingText = "A flat rectangular grey object. It's often positioned next to the soil sample.";
  $scope.info = function(){
    var alert = $ionicPopup.alert({
      title: 'Color Card',
      template: showingText
    })
  }
})
  .controller('graphController', function($scope, $state, ColorService){

    var graphLabArray = ColorService.getLABArray();

    var graphSeries = [];
    for (var i=0; i < graphLabArray.length; i += 3){
      graphSeries.push([graphLabArray[i],graphLabArray[i+1], graphLabArray[i+2]]);
      //i++
    }

    $scope.LABAvg = ColorService.getAvgLAB();
    var chart = new Highcharts.Chart({
      chart: {
        renderTo: 'container',
        margin: [70, 75, 75, 75],
        type: 'scatter',
        options3d: {
          enabled: true,
          alpha: 20,
          beta: 30,
          depth: 400,
          frame: {
            bottom: { size: 1, color: 'rgba(0,0,0,0.02)' },
            back: { size: 1, color: 'rgba(0,0,0,0.04)' },
            side: { size: 1, color: 'rgba(0,0,0,0.06)' }
          }
        }
      },
      title: {
        text: 'Results'
      },
      subtitle: {
        text:'La*b* Average: ' + $scope.LABAvg
      },
      legend: {
        enabled: false
      },
      yAxis: {
        min: -128,
        max: 127
      },
      xAxis: {
        min: 0,
        max: 100,
        gridLineWidth: 1
      },
      zAxis: {
        min: -128,
        max: 127
      },
      series: [{
        name: 'La*b* (xyz)',
        colorByPoint: true,
        data: [graphSeries]
      }]
    });

    chart.series[0].setData(graphSeries);

  })


  .controller('resultsController',function($scope,$state,ImageService,CanvasService,ColorService, $ionicHistory,$ionicPopup,CSVService){

    $scope.LABAvg = "L: " +ColorService.getAvgLAB()[0]+ " A: "+ColorService.getAvgLAB()[1]+" B: "+ColorService.getAvgLAB()[2];
    //Redraw the two canvases
    var mainPic = ImageService.getMainPic();
    var mainImg = new Image();
    mainImg.src = mainPic;
    CanvasService.createCardCanvas(mainImg,'resCardCanvas');
    CanvasService.createSoilCanvas(mainImg,'resSoilCanvas');

    $scope.pushToCSV = function(){
      var data = {l:$scope.soilLAB[0],as:$scope.soilLAB[1],bs:$scope.soilLAB[2],al:$scope.average[0],aa:$scope.average[1],ab:$scope.average[2],r:$scope.soilRGB[0],g:$scope.soilRGB[1],b:$scope.soilRGB[2],cr:$scope.cardRGB[0],cg:$scope.cardRGB[1],cb:$scope.cardRGB[2]}
      CSVService.pushToArray(data);
    };

    $scope.$watch(function() {
      $scope.soilLAB = ColorService.getLAB();
      $scope.soilRGB = ColorService.getRGB();
      $scope.cardRGB = ColorService.getCardRGB();
      $scope.average = ColorService.getAvgLAB();
      $scope.soilLABArray = ColorService.getLABArray();
      $scope.csvArray = CSVService.getDataArray();
    });
    $scope.$on("$ionicView.afterLeave", function () {
      $ionicHistory.clearCache();
    });
    //Discard Button - Erase Canvases and reset LABArray
    $scope.startOver = function() {
      CanvasService.refreshCanvas('resCardCanvas');
      CanvasService.refreshCanvas('resSoilCanvas');
      ColorService.emptyArray();
      $state.go('tabs.home');
    };
    var showingText3 = "The LAB value of dominant color is displayed. If you want more accurate results, press the Improve Results button.You will be taken back to soil page, where you can reselect the soil sample. This can be repeated as many times as needed.";
    $scope.explanation = function(){
    var alert = $ionicPopup.alert({
      title: 'Results',
      template: showingText3
    })
    }
  });






