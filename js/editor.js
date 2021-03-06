var Editor = function(levelIndex) {

  var imageName = false;
  var imageNameOverlay = false;
  var drawOverlay = true;
  var grid = [];

  var drawingBucket = false;

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
      console.log(JSON.stringify(grid));

      return;
    }

    if (levels[levelIndex] && levels[levelIndex].custom) {
      saveCustomLevel(levels[levelIndex].label, grid, levels[levelIndex].index);
      alert('Level saved');
      return;
    }

    var label = prompt('Level label?', '');
    if (label === null) {
      alert('Saving canceled');
      return;
    }

    if (label === '') {
      alert('Type a proper label for this level');
      return this.saveTrack();
    }

    var customIndex = saveCustomLevel(label, grid);

    levelIndex = levels.length;
    levels[levelIndex] = {
      custom: true,
      index: customIndex,
      label: label,
      grid: grid
    };

    alert('Level saved');
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

  this.toggleOverlay = function() {
    drawOverlay = !drawOverlay;
  };

  this.validateGrid = function() {
    if (!validateSingleStart()) {
      return false;
    }

    if (!validateDriveableTiles()) {
      return false;
    }

    // @todo validate checkpoints?

    return true;
  };

  function validateSingleStart() {
    var hasStart = false;

    for (var i = 0; i < grid.length; i++) {
      if (grid[i] === TRACK_PLAYERSTART) {
        if (hasStart) {
          alert('Only a single Player start should be added');
          return false;
        }

        hasStart = true;
      }
    }

    if (!hasStart) {
      alert('No Player start found');
    }
    return hasStart;
  }

  function validateDriveableTiles() {
    // Require at least 10% driveable tiles?
    var numDriveableTiles = Math.floor(grid.length * .10);

    for (var i = 0; i < grid.length; i++) {
      if (indexIsDriveable(grid, i)) {
        numDriveableTiles--;
        if (numDriveableTiles <= 0) {
          return true;
        }
      }
    }

    alert('Not enough driveable area!?');
    return false;
  }

  var buttons = [
    new ButtonImage(gameContext, 10, 10, Images.button_save, false, false, this.saveTrack.bind(this)),
    new ButtonImage(gameContext, 60, 10, Images.button_reset, false, false, this.resetGrid.bind(this)),

    new ButtonImage(gameContext, 120, 10, Images.button_pencil, 'draw', true, this.selectTool.bind(this, EDITOR_PENCIL)),
    new ButtonImage(gameContext, 170, 10, Images.button_bucket, 'draw', false, this.selectTool.bind(this, EDITOR_BUCKET)),

    new ButtonImage(gameContext, 230, 10, Images.button_1, 'size', true, this.selectSize.bind(this, 1)),
    new ButtonImage(gameContext, 280, 10, Images.button_2, 'size', false, this.selectSize.bind(this, 2)),
    new ButtonImage(gameContext, 330, 10, Images.button_4, 'size', false, this.selectSize.bind(this, 4)),

    new ButtonImage(gameContext, 400, 10, Images['button_' + TRACK_IMAGES[TRACK_ROAD]], 'type', true, this.selectTrackType.bind(this, TRACK_ROAD)),
    new ButtonImage(gameContext, 450, 10, Images['button_' + TRACK_IMAGES[TRACK_WALL]], 'type', false, this.selectTrackType.bind(this, TRACK_WALL)),
    new ButtonImage(gameContext, 500, 10, Images['button_' + TRACK_IMAGES[TRACK_PLAYERSTART]], 'type', false, this.selectTrackType.bind(this, TRACK_PLAYERSTART)),
  ];

  this.drawPencil = function(col, row) {
    var index = rowColToArrayIndex(col, row);
    if (0 <= index && index < grid.length) {
      grid[index] = this.type;
    }
  };

  this.drawBucket = function(col, row) {
    if (drawingBucket) {
      return;
    }
    drawingBucket = true;

    if (col < 0 || TRACK_COLS <= col) {
      return;
    }
    if (row < 0 || TRACK_ROWS <= row) {
      return;
    }
    var type = getTileTypeAtColRow(grid, col, row);
    var index = rowColToArrayIndex(col, row);

    if (grid[index] !== type || grid[index] === this.type) {
      return;
    }

    var q = [];
    q.push(index);

    while (q.length) {
      var curIndex = q.pop();

      var minIndex = curIndex - (curIndex % TRACK_COLS);
      var maxIndex = minIndex + TRACK_COLS;

      var westIndex = curIndex, eastIndex = curIndex;
      while (grid[westIndex] === type && minIndex <= westIndex) {
        westIndex--;
      }
      while (grid[eastIndex] === type && eastIndex < maxIndex) {
        eastIndex++;
      }

      for (var i = westIndex + 1; i < eastIndex; i++) {
        grid[i] = this.type;

        if (0 <= (i - TRACK_COLS) && grid[i - TRACK_COLS] === type) {
          q.push(i - TRACK_COLS);
        }
        if ((i + TRACK_COLS) < grid.length && grid[i + TRACK_COLS] === type) {
          q.push(i + TRACK_COLS);
        }
      }
    }
  };

  this.update = function(delta) {
    for (var b = 0; b < buttons.length; b++) {
      buttons[b].update(delta);
    }

    if (TRACK_PADDING_TOP <= mouse.y && mouse.button !== -1) {
      this.drawCallback((this.tool === EDITOR_BUCKET ? this.drawBucket : this.drawPencil).bind(this));
    }
    else {
      drawingBucket = false;
    }
  };

  this.draw = function() {
    gameContext.save();
    if (imageName) {
      gameContext.drawImage(Images[imageName], 0, TRACK_PADDING_TOP);
      if (drawOverlay && imageNameOverlay) {
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
      this.drawCallback(function(col, row) {
        drawStrokeRect(gameContext, col * TRACK_WIDTH, row * TRACK_HEIGHT + TRACK_PADDING_TOP, TRACK_WIDTH, TRACK_HEIGHT, '#fff', 1);
      });
    }

    var label = '- new level -';
    if (levels[levelIndex] && levels[levelIndex].label) {
      label = levels[levelIndex].label;
    }
    drawText(gameContext, gameCanvas.width, 10, '#fff', GAME_FONT, 'right', 'top', 'Track: ' + label);
  };

  this.drawCallback = function(callback) {
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
