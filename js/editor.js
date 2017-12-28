var Editor = function(levelIndex) {

  var grid = [];

  this.type = TRACK_ROAD;

  // @todo load levels from localStorage, not levels variable
  if (levels[levelIndex]) {
    grid = levels[levelIndex].grid.slice();
  }
  else {
    var i = 0;
    for (var r = 0; r < TRACK_ROWS; r++) {
      for (var c = 0; c < TRACK_COLS; c++) {
        grid[i] = -1;
        i++;
      }
    }
  }

  this.selectTrackType = function(type) {
    this.type = type;
  };

  // @todo more buttons: save, reset, player start
  var buttons = [
    new Button(gameContext, 10, 10, 'wall', GAME_FONT, this.selectTrackType.bind(this, TRACK_WALL)),
    new Button(gameContext, 80, 10, 'road', GAME_FONT, this.selectTrackType.bind(this, TRACK_ROAD)),
    new Button(gameContext, 150, 10, 'start', GAME_FONT, this.selectTrackType.bind(this, TRACK_PLAYERSTART))
  ];

  this.update = function(delta) {
    for (var b = 0; b < buttons.length; b++) {
      buttons[b].update(delta);
    }

    if (mouse.button !== -1) {
      var index = coordsToArrayIndex(mouse.x, mouse.y);
      if (0 <= index && index < grid.length) {
        grid[index] = this.type;
      }
    }
  };

  this.draw = function() {
    for (var b = 0; b < buttons.length; b++) {
      buttons[b].draw();
    }

    var i = 0, x = 0, y = TRACK_PADDING_TOP;
    for (var r = 0; r < TRACK_ROWS; r++) {
      for (var c = 0; c < TRACK_COLS; c++) {
        var type = TRACK_IMAGES[grid[i]];

        if (Images[type]) {
          gameContext.drawImage(Images[type], x, y);
        }
        else {
          drawFillRect(gameContext, x, y, TRACK_WIDTH, TRACK_HEIGHT, '#333', 1);
        }
        i++;
        x += TRACK_WIDTH;
      }
      x = 0;
      y += TRACK_HEIGHT;
    }

    if (TRACK_PADDING_TOP <= mouse.y) {
      var rowCol = coordsToRowCol(mouse.x, mouse.y);
      drawStrokeRect(gameContext, rowCol.col * TRACK_WIDTH, rowCol.row * TRACK_HEIGHT + TRACK_PADDING_TOP, TRACK_WIDTH, TRACK_HEIGHT, '#fff', 1);
    }
  };

};
