var Track = function(levelIndex) {

  var label = levels[levelIndex].label;
  var grid = levels[levelIndex].grid.slice();
  var imageName = levels[levelIndex].image;

  if (!Images[imageName]) {
    Images.loadImage(imageName, 'img/tracks/' + imageName + '.png');
  }

  this.playerStart = initializeTrack();

  function initializeTrack() {
    var i = 0, x = TRACK_WIDTH / 2, y = TRACK_PADDING_TOP + TRACK_HEIGHT / 2;
    for (var r = 0; r < TRACK_ROWS; r++) {
      for (var c = 0; c < TRACK_COLS; c++) {
        if (grid[i] === TRACK_PLAYERSTART) {
          grid[i] = TRACK_ROAD;

          return {
            x: x,
            y: y
          };
        }

        i++;
        x += TRACK_WIDTH;
      }
      x = 0;
      y += TRACK_HEIGHT;
    }
  }

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

  this.draw = function() {
    gameContext.drawImage(Images[imageName], 0, TRACK_PADDING_TOP);

    drawText(gameContext, 0, 0, '#fff', GAME_FONT, 'left', 'Lap: 01');
    drawText(gameContext, 100, 0, '#fff', GAME_FONT, 'left', 'Time: 00:00');
    drawText(gameContext, 260, 0, '#fff', GAME_FONT, 'left', 'Ghost: 00:00');
    drawText(gameContext, gameCanvas.width, 0, '#fff', GAME_FONT, 'right', 'Track: ' + label);
    // @todo how to read this 'car.speed' some conversion to mph/kph?
    drawText(gameContext, 0, 30, '#fff', GAME_FONT, 'left', 'Speed: ' + Math.round(car.speed));
    // @todo replace with 2 wheels
    drawText(gameContext, 150, 30, '#fff', GAME_FONT, 'left', 'Angle: ' + Math.round(car.angle / DEC2RAD) + '°');

    if (TRACK_DEBUG_OVERLAY) {
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
