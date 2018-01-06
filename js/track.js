var lapTime = 0;
var lapTimeStr = "00:00";
var ghostLapTime = 0;
var ghostLapTimeStr = "00:00";

const ROAD_SURFACE_UNKNOWN = 0;
const ROAD_SURFACE_ASPHALT = 1;
const ROAD_SURFACE_GRAVEL = 2;
const ROAD_SURFACE_CONCRETE = 3;
const ROAD_SURFACE_DRY_MUD = 4;
const ROAD_SURFACE_WET_MUD = 5;
const ROAD_SURFACE_GRASS = 6;
const ROAD_SURFACE_WATER = 7;
const ROAD_SURFACE_OIL = 8;
const ROAD_SURFACE_GLUE = 9;
const ROAD_SURFACE_SPEEDBOOST = 10;
const ROAD_SURFACE_STRINGS =  ['UNKNOWN','ASPHALT','GRAVEL','CONCRETE','MUD','WET MUD','GRASS','WATER','OIL','SPEED BOOST'];
// how much the speed is scaled by when driving over this surface
const ROAD_SURFACE_FRICTION = [ 1.0,      1.0,      1.0,     1.0,       0.6,  0.4,      0.2,    0.1,    1.1,  2.0];
// how much the angle is perturbed when driving on this surface
const ROAD_SURFACE_ROUGHNESS = [0.0,      0.0,      0.1,     0.0,       1.0, 2.0,     0.0,    0.0,    4.0, 0.0];

var Track = function(levelIndex) {

  var showCountdown = false;
  var countdownRemaining = 0;

  var label = levels[levelIndex].label;
  var grid = levels[levelIndex].grid.slice();
  var imageName = levels[levelIndex].image;
  var imageNameOverlay = imageName ? imageName + '-overlay' : false;
  this.goalStart;
  this.goalEnd;
  this.playerStart;
  
  if (!Images[imageName]) {
    Images.loadImage(imageName, 'img/tracks/' + imageName + '.png');
  }

  if (!Images[imageNameOverlay]) {
    Images.loadImage(imageNameOverlay, 'img/tracks/' + imageNameOverlay + '.png');
  }

  this.initializeTrack = function() {
    var i = 0;
    for (var r = 0; r < TRACK_ROWS; r++) {
      for (var c = 0; c < TRACK_COLS; c++) {
        if (grid[i] === TRACK_PLAYERSTART) {
          grid[i] = TRACK_ROAD;
          this.playerStart = rowColToCoords(c, r);
        }
        else if (grid[i] === TRACK_GOALSTART) {
          grid[i] = TRACK_ROAD;
          this.goalStart = rowColToCoords(c, r);
        }
        else if (grid[i] === TRACK_GOALEND) {
          grid[i] = TRACK_ROAD;
          this.goalEnd = rowColToCoords(c, r);
        }

        i++;
      }
    }
  };

  this.startRace = function() {
    this.reset();
    car.isRacing = false;
    ghost.isRacing = false;
    showCountdown = true;
    countdownRemaining = 3000;
  };

  this.reset = function() {};

  this.coordsAreDriveable = function(x, y) {
    return coordsAreDriveable(grid, x, y);
  };

  this.drawOverlay = function() { // the lights, scaffolding, clouds: anything drawn above cars
    if (!imageNameOverlay) {
      return;
    }
    gameContext.drawImage(Images[imageNameOverlay], 0, TRACK_PADDING_TOP);
  };

// find Euclidian distance from the pixel color to the specified color 
function colorDistance(colorRed,colorGreen,colorBlue,pixelRed,pixelGreen,pixelBlue){
  var diffR,diffG,diffB;
  diffR=( colorRed - pixelRed );
  diffG=( colorGreen - pixelGreen );
  diffB=( colorBlue - pixelBlue );
  return(Math.sqrt(diffR*diffR + diffG*diffG + diffB*diffB));
}

// returns one of ROAD_SURFACE_*  
this.testRoadSurface = function(x,y) { 
    x = Math.round(x);
    y = Math.round(y);
    y -= TRACK_PADDING_TOP;
    var surfaceDetected = ROAD_SURFACE_ASPHALT;
    if (this.trackImageData) // read one pixel
    {
      var dataOffset = ((y-1) * Images[imageName].width * 4) + (x*4);
      var r = this.trackImageData[dataOffset];
      var g = this.trackImageData[dataOffset+1];
      var b = this.trackImageData[dataOffset+2];
      var a = this.trackImageData[dataOffset+3];
      //console.log('road: ' +r+','+g+','+b);
      
      // brownish
      if (colorDistance(r,g,b,70,45,25)<30)
      {
        surfaceDetected = ROAD_SURFACE_DRY_MUD;
      }
      // blueish puddle
      else if (colorDistance(r,g,b,70,70,100)<30)
      {
        surfaceDetected = ROAD_SURFACE_WATER;
      }
      // light beige
      else if (colorDistance(r,g,b,85,75,55)<30)
      {
        surfaceDetected = ROAD_SURFACE_GRAVEL;
      }
      // assume asphalt (could detect greys and blacks)
      else 
      {
        surfaceDetected = ROAD_SURFACE_GRAVEL;
      }
    }
    return surfaceDetected;
  };

  // returns the html rgb code (ignores alpha) of any pixel in the level image
  this.pixelColor = function(x,y) {
    
    x = Math.round(x);
    y = Math.round(y);

    y -= TRACK_PADDING_TOP; // troublesome bugfix! finally!

    if (!this.trackImageData && Images[imageName].downloaded) // cache it once when available and reuse
    {
      
      var canvas = document.createElement('canvas');
      var context = canvas.getContext('2d');
      var rgb;

      canvas.width = Images[imageName].width;
      canvas.height = Images[imageName].height;
      context.drawImage(Images[imageName], 0, 0 );
      var myData = context.getImageData(0, 0, canvas.width, canvas.height);
      
      this.trackImageData = myData.data;
      //console.log("grabbed track image data");
    }

    if (!this.trackImageData) // still downloading?
    {
      return 'rgb(0,0,0)'; // black default
    }

    var lightenDust = 30; // make more white like in real life due to density

    var dataOffset = ((y-1) * Images[imageName].width * 4) + (x*4);
    rgb = 'rgb(' + 
    Math.min(this.trackImageData[dataOffset]+lightenDust,255)+ ', ' +
    Math.min(this.trackImageData[dataOffset+1]+lightenDust,255) + ', ' + 
    Math.min(this.trackImageData[dataOffset+2]+lightenDust,255) + ')';

    //console.log('pixelColor if img wh:'+Images[imageName].width+','+Images[imageName].height+' at dataOffset:'+dataOffset+'/'+this.trackImageData.length+' xy:'+x+','+y+'='+rgb);
    
    return rgb;

  };
  
  this.draw = function() {
    if (imageName) {
      gameContext.drawImage(Images[imageName], 0, TRACK_PADDING_TOP);
    }

    drawText(gameContext, 0, 0, '#fff', GAME_FONT, 'left', 'top', 'Lap: 01');
    drawText(gameContext, 100, 0, '#fff', GAME_FONT, 'left', 'top', 'Time: ' + lapTimeStr);
    drawText(gameContext, 260, 0, '#fff', GAME_FONT, 'left', 'top', 'Ghost: ' + ghostLapTimeStr);
    drawText(gameContext, gameCanvas.width, 0, '#fff', GAME_FONT, 'right', 'top', 'Track: ' + label);
    // @todo how to read this 'car.speed' some conversion to mph/kph?
    drawText(gameContext, 0, 30, '#fff', GAME_FONT, 'left', 'top', 'Speed: ' + Math.round(car.speed));
    // @todo replace with 2 wheels
    drawText(gameContext, 150, 30, '#fff', GAME_FONT, 'left', 'top', 'Angle: ' + Math.round(car.angle / DEC2RAD) + '°');

    if (DEBUG) {
      gameContext.save();
      if (!TRACK_SCREENSHOT) {
        gameContext.globalAlpha = 0.5;
      }

      var i = 0, x = 0, y = TRACK_PADDING_TOP;
      for (var r = 0; r < TRACK_ROWS; r++) {
        for (var c = 0; c < TRACK_COLS; c++) {
          var type = TRACK_IMAGES[grid[i]];

          if (type && Images[type]) {
            gameContext.drawImage(Images[type], x, y);
          }
          i++;
          x += TRACK_WIDTH;
        }
        x = 0;
        y += TRACK_HEIGHT;
      }

      gameContext.restore();
    }

    if (showCountdown) {
      gameContext.shadowBlur = 6;
      gameContext.shadowColor = '#222';
      drawText(gameContext, gameCanvas.width / 2, gameCanvas.height / 2, '#fff', GAME_FONT_LARGE, 'center', 'middle', 'Starting race in: ' + Math.ceil(countdownRemaining / 1000));
      gameContext.shadowBlur = 0;
      gameContext.shadowColor = 'transparent';
    }
  };

  this.update = function(delta) {
    if (showCountdown && !isEditToggling) {
      countdownRemaining -= delta;
      if (countdownRemaining <= 0) {
        countdownRemaining = 0;
        showCountdown = false;
        car.isRacing = true;
        ghost.isRacing = true;
      }
    }
  };

};
