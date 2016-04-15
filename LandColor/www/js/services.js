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
    var xCard,yCard,xSoil,ySoil,cardImageData,soilImageData;

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
      var cardContext = cardCanvas.getContext('2d');
      cardContext.drawImage(image, xCard-100, yCard-100, 200, 200, 0, 0, 200, 200);
      var getCardImageData = cardContext.getImageData(0,0,200,200);
      cardImageData = getCardImageData.data;
    }
    function getCardImageData(){
      return cardImageData;
    }
    function createSoilCanvas(image){
      var soilCanvas = document.getElementById('canvas2');
      var soilContext = soilCanvas.getContext('2d');
      soilContext.drawImage(image,xSoil-100, ySoil-100, 200, 200, 0, 0, 200, 200);
      var getSoilImageData = soilContext.getImageData(0,0,200,200);
      soilImageData = getSoilImageData.data;
    }
    function getSoilImageData(){
      return soilImageData;
    }
    return {
      setCard: setCard,
      setSoil: setSoil,
      createCardCanvas: createCardCanvas,
      createSoilCanvas: createSoilCanvas,
      getCardImageData: getCardImageData,
      getSoilImageData: getSoilImageData
    }
  })

  .factory('ColorService',function(CanvasService){
    //Need pixel array that works with quantize.js
    var pixelCard = CanvasService.getCardImageData();
    var pixelSoil = CanvasService.getSoilImageData();

    function getColor(){
      //The size of the palette
      var colorCount = 11;
      //How "well" the median cut algorithm performs
      var quality = 1;
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
        //Quantize perform median cut algorithm, and returns a palette of the "top ten" colors in the picture
        var cmap = MMCQ.quantize(pixelArray, colorCount);
        var palette = cmap ? cmap.palette() : null;
        return palette;
      };
      var paletteCard = getPalette(pixelCard,pixelCount,quality,colorCount);
      var paletteSample = getPalette(pixelSoil,pixelCount,quality,colorCount);


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
      //$scope.card = "RGB: "+ card.rgb;
      var sample = sampleRGBLab(paletteCard,0,paletteSample,0);
      var soilLAB ="Lab: " + sample.lab;
      //$scope.sample =  " RGB: "+ sample.rgbRaw;
      //$scope.items.push({rCard: card.rgb[0], gCard: card.rgb[1], bCard: card.rgb[2], rSample: sample.rgbRaw[0], gSample: sample.rgbRaw[1], bSample: sample.rgbRaw[2]});
      return soilLAB;
    }
    return{
      getColor: getColor
    }

  });





