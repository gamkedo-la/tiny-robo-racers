var Track = function(levelIndex) {

  var grid = levels[levelIndex].slice();

  this.playerStart = initializeTrack();

  function initializeTrack() {
    var i = 0, x = TRACK_WIDTH / 2, y = TRACK_HEIGHT / 2;
    for (var r = 0; r < TRACK_ROWS; r++) {
      for (var c = 0; c < TRACK_COLS; c++) {
        if (grid[i] === TRACK_PLAYERSTART) {
          grid[i] = TRACK_ROAD;

          return {
            x: x + TRACK_WIDTH / 2,
            y: y + TRACK_HEIGHT / 2
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
    var row = Math.floor(y / TRACK_HEIGHT);
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
    var i = 0, x = 0, y = 0;
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
  };

  this.update = function(delta) {};

};
