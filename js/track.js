var lapTime = 0;
var lapTimeStr = "00:00"
var ghostLapTime = 0;
var ghostLapTimeStr = "00:00"
var Track = function(levelIndex) {

  var showCountdown = false;
  var countdownRemaining = 0;

  var label = levels[levelIndex].label;
  var grid = levels[levelIndex].grid.slice();
  var imageName = levels[levelIndex].image;
  var imageNameOverlay = imageName+"-overlay";
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
    gameContext.drawImage(Images[imageNameOverlay], 0, TRACK_PADDING_TOP);
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

    var dataOffset = ((y-1) * Images[imageName].width * 4) + (x*4);
    rgb = 'rgb(' + 
    this.trackImageData[dataOffset] + ', ' +
    this.trackImageData[dataOffset+1] + ', ' + 
    this.trackImageData[dataOffset+2] + ')';

    //console.log('pixelColor if img wh:'+Images[imageName].width+','+Images[imageName].height+' at dataOffset:'+dataOffset+'/'+this.trackImageData.length+' xy:'+x+','+y+'='+rgb);
    
    return rgb;

  };
  
  this.draw = function() {
    gameContext.drawImage(Images[imageName], 0, TRACK_PADDING_TOP);

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

          gameContext.drawImage(Images[type], x, y);
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
