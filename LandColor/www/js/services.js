angular.module('starter')


  .factory('ImageService',function(){
    //Service to store image taken
    var mainPic;

    function setMainPic(dataURL){
      mainPic = dataURL;
    }

    function getMainPic(){
      return mainPic;
    }
    return{
      setMainPic: setMainPic,
      getMainPic: getMainPic
    }
  })


  .factory('CanvasService',function(){
    //Service to set card and soil canvases
    var xCard,yCard,xSoil,ySoil,cardImageData,soilImageData;

    function setCard(x,y) {
      xCard = x;
      yCard = y;
    }
    function setSoil(x,y){
      xSoil = x;
      ySoil = y;
    }
    function createCardCanvas(image,id){
      var cardCanvas = document.getElementById(id);
      var cardContext = cardCanvas.getContext('2d');
      cardContext.drawImage(image, xCard-100, yCard-100, 200, 200, 0, 0, 200, 200);
      var getCardImageData = cardContext.getImageData(0,0,200,200);
      cardImageData = getCardImageData.data;
    }
    function getCardImageData(){
      return cardImageData;
    }
    function createSoilCanvas(image,id){
      var soilCanvas = document.getElementById(id);
      var soilContext = soilCanvas.getContext('2d');
      soilContext.drawImage(image,xSoil-100, ySoil-100, 200, 200, 0, 0, 200, 200);
      var getSoilImageData = soilContext.getImageData(0,0,200,200);
      soilImageData = getSoilImageData.data;
    }
    function getSoilImageData(){
      return soilImageData;
    }
    //Draw blank canvas
    function refreshCanvas(id){
      var canvas = document.getElementById(id);
      var context = canvas.getContext('2d');
      context.clearRect(0, 0, canvas.width, canvas.height);
    }

    return {
      setCard: setCard,
      setSoil: setSoil,
      createCardCanvas: createCardCanvas,
      createSoilCanvas: createSoilCanvas,
      getCardImageData: getCardImageData,
      getSoilImageData: getSoilImageData,
      refreshCanvas: refreshCanvas

    }

  })

  .factory('ColorService', function(CanvasService){
    var soilLAB;
    //var soilHVC;
    var soilLABArray = [];

    function getColor(){
      //Get image data from canvases
      var pixelCard = CanvasService.getCardImageData();
      var pixelSoil = CanvasService.getSoilImageData();
      //The size of the palette - the number of vboxes
      var colorCount = 16;
      //How "well" the median cut algorithm performs
      var quality = 1;
      //200px*200px canvas
      var pixelCount = 40000;

      var getPalette = function(pixels,pixelCount,quality,colorCount) {
        //Transform pixel info from canvas so quantize can use it
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
        //Quantize.js performs median cut algorithm, and returns a palette of the "top 16" colors in the picture
        var cmap = MMCQ.quantize(pixelArray, colorCount);
        var palette = cmap ? cmap.palette() : null;
        return palette;
      };

      //Get the color palettes of both soil and card
      var paletteCard = getPalette(pixelCard,pixelCount,quality,colorCount);
      var paletteSample = getPalette(pixelSoil,pixelCount,quality,colorCount);

      /* Math to transform RGB to LAB
       Credit to Bruce Lindbloom
       http://www.brucelindbloom.com/index.html?UPLab.html
       */
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
          //toFixed()/1 easy way to round to 2 significant figures and return a number not a string
          return [l.toFixed(2)/1, a.toFixed(2)/1, b.toFixed(2)/1];
        }
        /* //XYZ to Munsell
         //Transform from http://www.sciencedirect.com/science/article/pii/S0016706105002314


         function XYZtoHVC(x,y,z){
         var xc = 1.020*x;
         var zc = 0.487*z;
         xc = (11.559*(Math.pow(xc,(1/3))))-1.695;
         zc = (11.510*(Math.pow(zc,(1/3))))-1.691;
         var yc = (11.396*(Math.pow(y,(1/3))))-1.610;

         var h1 = xc - yc;
         var h2 = 0.4*(zc - yc);
         var theta = Math.atan(h2/h1);

         var s1 = (8.398+(0.832*Math.cos(theta)))*h1;
         var s2 = (-6.102-(1.323*Math.cos(theta)))*h2;

         var h = Math.abs(Math.atan(s2/s1)*(100/Math.PI));
         var v = yc;
         var c = Math.pow((Math.pow(s1,2)+Math.pow(s2,2)),(1/2));

         return [h.toFixed(2)/1, v.toFixed(2)/1, c.toFixed(2)/1];
         */

        var xyz = RGBtoXYZ(r, g, b);
        var lab = XYZtoLAB(xyz[0], xyz[1], xyz[2]);


        return{
          lab: lab
        };
      }

      //Functions used for testing - Instead of using the first vbox
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
      //Correction values obtain from spectrophotometer Observer. = 2°, Illuminant = D65
      function sampleRGBLab(paletteCard,numberCard,paletteSample,numberSample){
        var rCorrection = 210.15/paletteCard[numberCard][0];
        var gCorrection = 213.95/paletteCard[numberCard][1];
        var bCorrection = 218.42/paletteCard[numberCard][2];
        var r = rCorrection*paletteSample[numberSample][0];
        var g = gCorrection*paletteSample[numberSample][1];
        var b = bCorrection*paletteSample[numberSample][2];
        var lab = RGBtoLAB(r,g,b).lab;
        var rgb=[r.toFixed(2)/1, g.toFixed(2)/1, b.toFixed(2)/1];
        var rgbRaw=[paletteSample[numberSample][0],paletteSample[numberSample][1],paletteSample[numberSample][2]];
        return{
          rgb : rgb,
          lab : lab,
          rgbRaw : rgbRaw
        };
      }

      var card = cardRGBLab(paletteCard,0);
      var sample = sampleRGBLab(paletteCard,0,paletteSample,0);
      //Push lab to array for later use in improving results
      soilLABArray.push(sample.lab[0]);
      soilLABArray.push(sample.lab[1]);
      soilLABArray.push(sample.lab[2]);
      //
      soilLAB = sample.lab[0] + ",  " + sample.lab[1] + ",  " + sample.lab[2];

    }
    //Average multiple soil touches to improve color
    function getAverageLAB(){
      var lSum = 0;
      var aSum = 0;
      var bSum = 0;
      for(var i = 0; i < soilLABArray.length; i += 3)
      {
        lSum += soilLABArray[i];
        aSum += soilLABArray[i + 1];
        bSum += soilLABArray[i + 2];
      }
      var lAvg = (lSum/(soilLABArray.length/3));
      var aAvg = (aSum/(soilLABArray.length/3));
      var bAvg = (bSum/(soilLABArray.length/3));

      return [lAvg.toFixed(2)/1,aAvg.toFixed(2)/1,bAvg.toFixed(2)/1];
    }
    function emptyArray(){
      soilLABArray = [];
    }
    function getLAB(){
      return soilLAB;
    }
    function getLABArray(){
      return soilLABArray;
    }
    return {
      getColor: getColor,
      getLAB: getLAB,
      getLABArray: getLABArray,
      getAvgLAB: getAverageLAB,
      emptyArray: emptyArray
    }
  });









