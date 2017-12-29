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

  var grid_original = grid.slice();

  this.selectTrackType = function(type) {
    this.type = type;
  };

  this.resetGrid = function() {
    grid = grid_original.slice();
  };

  var buttons = [
    new ButtonImage(gameContext, 10, 10, Images.button_save, false, false, function(){}),
    new ButtonImage(gameContext, 60, 10, Images.button_reset, false, false, this.resetGrid.bind(this)),
    new ButtonImage(gameContext, 110, 10, Images.button_pencil, 'draw', true, function(){}),
    new ButtonImage(gameContext, 160, 10, Images.button_bucket, 'draw', false, function(){}),
    new ButtonImage(gameContext, 210, 10, Images.button_1, 'size', true, function(){}),
    new ButtonImage(gameContext, 260, 10, Images.button_2, 'size', false, function(){}),
    new ButtonImage(gameContext, 310, 10, Images.button_4, 'size', false, function(){}),

    new ButtonText(gameContext, 370, 10, 'road', GAME_FONT, 'type', true, this.selectTrackType.bind(this, TRACK_ROAD)),
    new ButtonText(gameContext, 440, 10, 'wall', GAME_FONT, 'type', false, this.selectTrackType.bind(this, TRACK_WALL)),
    new ButtonText(gameContext, 510, 10, 'start', GAME_FONT, 'type', false, this.selectTrackType.bind(this, TRACK_PLAYERSTART)),
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
