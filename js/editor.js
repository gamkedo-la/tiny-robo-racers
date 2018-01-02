var Editor = function(levelIndex) {

  var imageName = false;
  var imageNameOverlay = false;
  var grid = [];

  this.size = 1;
  this.type = TRACK_ROAD;

  if (levels[levelIndex]) {
    grid = levels[levelIndex].grid.slice();
    imageName = levels[levelIndex].image;
    imageNameOverlay = imageName + '-overlay';

    if (!Images[imageName]) {
      Images.loadImage(imageName, 'img/tracks/' + imageName + '.png');
    }

    if (!Images[imageNameOverlay]) {
      Images.loadImage(imageNameOverlay, 'img/tracks/' + imageNameOverlay + '.png');
    }
  }

  if (grid.length === 0) {
    var i = 0;
    for (var r = 0; r < TRACK_ROWS; r++) {
      for (var c = 0; c < TRACK_COLS; c++) {
        grid[i] = -1;
        i++;
      }
    }
  }

  var grid_original = grid.slice();

  this.saveTrack = function() {
    if (!this.validateGrid()) {
      return;
    }

    if (levels[levelIndex] && !levels[levelIndex].custom) {
      // Output level grid for saving in levels.js
      prompt('Save grid in levels.js', JSON.stringify(grid));
      return;
    }

    if (levels[levelIndex] && levels[levelIndex].custom) {
      saveCustomLevel(levels[levelIndex].label, grid, levels[levelIndex].index);
      return;
    }

    var label = prompt('Level label?', '');
    if (label === null) {
      alert('Saving canceled');
      return;
    }

    if (label === '') {
      alert('Type a proper label for this level.');
      return this.saveTrack();
    }

    saveCustomLevel(label, grid);
  };

  this.selectTrackType = function(type) {
    this.type = type;
  };

  this.resetGrid = function() {
    grid = grid_original.slice();
  };

  this.selectSize = function(size) {
    this.size = size;
  };

  this.selectTool = function(tool) {
    this.tool = tool;
  };

  this.validateGrid = function() {
    alert('Validation not implemented yet');
    return true;
  };

  var buttons = [
    new ButtonImage(gameContext, 10, 10, Images.button_save, false, false, this.saveTrack.bind(this)),
    new ButtonImage(gameContext, 60, 10, Images.button_reset, false, false, this.resetGrid.bind(this)),
    new ButtonImage(gameContext, 110, 10, Images.button_pencil, 'draw', true, this.selectTool.bind(this, EDITOR_PENCIL)),
    new ButtonImage(gameContext, 160, 10, Images.button_bucket, 'draw', false, this.selectTool.bind(this, EDITOR_BUCKET)),
    new ButtonImage(gameContext, 210, 10, Images.button_1, 'size', true, this.selectSize.bind(this, 1)),
    new ButtonImage(gameContext, 260, 10, Images.button_2, 'size', false, this.selectSize.bind(this, 2)),
    new ButtonImage(gameContext, 310, 10, Images.button_4, 'size', false, this.selectSize.bind(this, 4)),

    new ButtonText(gameContext, 370, 10, 'road', GAME_FONT, 'type', true, this.selectTrackType.bind(this, TRACK_ROAD)),
    new ButtonText(gameContext, 440, 10, 'wall', GAME_FONT, 'type', false, this.selectTrackType.bind(this, TRACK_WALL)),
    new ButtonText(gameContext, 510, 10, 'start', GAME_FONT, 'type', false, this.selectTrackType.bind(this, TRACK_PLAYERSTART)),
  ];

  this.update = function(delta) {
    for (var b = 0; b < buttons.length; b++) {
      buttons[b].update(delta);
    }

    if (TRACK_PADDING_TOP <= mouse.y && mouse.button !== -1) {
      this.d(function(col, row) {
        var index = rowColToArrayIndex(col, row);
        if (0 <= index && index < grid.length) {
          grid[index] = this.type;
        }
      }.bind(this));
    }
  };

  this.draw = function() {
    gameContext.save();
    if (imageName) {
      gameContext.drawImage(Images[imageName], 0, TRACK_PADDING_TOP);
      if (imageNameOverlay) {
        gameContext.drawImage(Images[imageNameOverlay], 0, TRACK_PADDING_TOP);
      }

      gameContext.globalAlpha = 0.5;
    }

    var i = 0, x = 0, y = TRACK_PADDING_TOP;
    for (var r = 0; r < TRACK_ROWS; r++) {
      for (var c = 0; c < TRACK_COLS; c++) {
        var type = TRACK_IMAGES[grid[i]];

        if (0 <= grid[i] && Images[type]) {
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

    gameContext.restore();

    for (var b = 0; b < buttons.length; b++) {
      buttons[b].draw();
    }

    if (TRACK_PADDING_TOP <= mouse.y) {
      this.d(function(col, row) {
        drawStrokeRect(gameContext, col * TRACK_WIDTH, row * TRACK_HEIGHT + TRACK_PADDING_TOP, TRACK_WIDTH, TRACK_HEIGHT, '#fff', 1);
      });
    }
  };

  this.d = function(callback) {
    var rowCol = coordsToRowCol(mouse.x, mouse.y);
    var s = (this.tool === EDITOR_BUCKET) ? 0 : this.size - 1;
    var startCol = rowCol.col - s;
    var startRow = rowCol.row - s;

    if (startCol < 0) {
      startCol = 0;
    }
    if (startRow < 0) {
      startRow = 0;
    }

    for (var tc = 0; tc <= s; tc++) {
      for (var tr = 0; tr <= s; tr++) {
        callback(startCol + tc, startRow + tr);
      }
    }
  }

};
