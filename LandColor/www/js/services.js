angular.module('starter')

  .factory('FileService', function() {
    var images;
    var IMAGE_STORAGE_KEY = 'dav-images';

    function getImages() {
      var img = window.localStorage.getItem(IMAGE_STORAGE_KEY);
      if (img) {
        images = JSON.parse(img);
      } else {
        images = [];
      }
      return images;
    };

    function addImage(img) {
      images.push(img);
      window.localStorage.setItem(IMAGE_STORAGE_KEY, JSON.stringify(images));
    };

    return {
      storeImage: addImage,
      images: getImages
    }
  })

  .factory('ImageService', function($cordovaCamera, FileService, $q, $cordovaFile) {

    function optionsForType(type) {
      var source;
      switch (type) {
        case 0:
          source = Camera.PictureSourceType.CAMERA;
          break;
        case 1:
          source = Camera.PictureSourceType.PHOTOLIBRARY;
          break;
      }
      return {
        quality: 90,
        destinationType: Camera.DestinationType.DATA_URL,
        sourceType: source,
        allowEdit: false,
        encodingType: Camera.EncodingType.JPEG,
        popoverOptions: CameraPopoverOptions,
        saveToPhotoAlbum: false,
        correctOrientation:true
      };
    }

    function saveMedia(type) {
      return $q(function(resolve, reject) {
        var options = optionsForType(type);

        $cordovaCamera.getPicture(options).then(function(imageBase64) {
          FileService.storeImage(imageBase64);
        });
      })
    }
    return {
      handleMediaDialog: saveMedia
    }
  })

  .factory('CanvasService',function(){
    var xCard,yCard,xSoil,ySoil,cardContext,soilContext;

    function setCard(x,y) {
      xCard = x;
      yCard = y;
    }
    function setSoil(x,y){
      xSoil = x;
      ySoil = y;
    }
    function createCardCanvas(image){
      var cardCanvas = document.getElementById('canvas');
      cardContext = cardCanvas.getContext('2d');
      cardContext.drawImage(image, xCard-100, yCard-100, 200, 200, 0, 0, 200, 200);
    }
    function getCardContext(){
      return cardContext;
    }
    function createSoilCanvas(image){
      var soilCanvas = document.getElementById('canvas2');
      soilContext = soilCanvas.getContext('2d');
      soilContext.drawImage(image,xSoil-100, ySoil-100, 200, 200, 0, 0, 200, 200);
    }
    function getSoilContext(){
      return soilContext;
    }
    return {
      setCard: setCard,
      setSoil: setSoil,
      createCardCanvas: createCardCanvas,
      createSoilCanvas: createSoilCanvas,
      getCardContext: getCardContext


    }
  });




