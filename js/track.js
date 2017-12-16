var lapTime = 0;
var Track = function(levelIndex) {

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
          this.playerStart = this.rowColToCoords(c, r);
        }
        else if (grid[i] === TRACK_GOALSTART) {
          grid[i] = TRACK_ROAD;
          this.goalStart = this.rowColToCoords(c, r);
        }
        else if (grid[i] === TRACK_GOALEND) {
          grid[i] = TRACK_ROAD;
          this.goalEnd = this.rowColToCoords(c, r);
        }

        i++;
      }
    }
  };

  this.coordsAreDriveable = function(x, y) {
    var col = Math.floor(x / TRACK_WIDTH);
    var row = Math.floor((y - TRACK_PADDING_TOP) / TRACK_HEIGHT);
    var tileHere = track.getTileTypeAtColRow(col, row);

    return (tileHere === TRACK_ROAD);
  };

  this.rowColToArrayIndex = function(col, row) {
    return col + TRACK_COLS * row;
  };

  this.getTileTypeAtColRow = function(col, row) {
    if (col >= 0 && col < TRACK_COLS && row >= 0 && row < TRACK_ROWS) {
      var trackIndex = this.rowColToArrayIndex(col, row);

      return grid[trackIndex];
    }

    return TRACK_WALL;
  };

  this.rowColToCoords = function(col, row) {
    return {
      x: col * TRACK_WIDTH + TRACK_WIDTH / 2,
      y: row * TRACK_HEIGHT + TRACK_PADDING_TOP + TRACK_HEIGHT / 2
    };
  };

  this.drawOverlay = function() { // the lights, scaffolding, clouds: anything drawn above cars
    gameContext.drawImage(Images[imageNameOverlay], 0, TRACK_PADDING_TOP);
  };

  this.draw = function() {
    gameContext.drawImage(Images[imageName], 0, TRACK_PADDING_TOP);

    drawText(gameContext, 0, 0, '#fff', GAME_FONT, 'left', 'top', 'Lap: 01');
    drawText(gameContext, 100, 0, '#fff', GAME_FONT, 'left', 'top', 'Time: ' + lapTime);
    drawText(gameContext, 260, 0, '#fff', GAME_FONT, 'left', 'top', 'Ghost: 00:00');
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
  };

  this.update = function(delta) {};

};
