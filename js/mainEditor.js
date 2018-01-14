var gameCanvas, gameContext;

var mouse = {
  x: 0,
  y: 0,
  button: -1
};

IS_EDITOR = true;
var isPlaying = false;
var isEditing = false;
var isEditToggling = false;
var isPaused = false;
var isGameOver = false;

var settings;
var levelsList;

var editor;

window.onload = function() {
  gameCanvas = document.getElementById('gameCanvas');
  gameContext = gameCanvas.getContext('2d');

  settings = new LocalStorage('trr', 'settings');
  levelsList = new LocalStorage('trr', 'levelsList');

  loadCustomLevels();

  initDrawingCanvas();

  MainLoop
    .stop()
    .setMaxAllowedFPS(FRAME_RATE)
    .setUpdate(gameUpdate)
    .setDraw(gameDraw);

  Images.initialize(menuInitialize);
};

function gameInitialize(levelIndex) {
  if (levelIndex !== '_new' && !levels[levelIndex]) {
    alert('No level? ' + levelIndex);
    return;
  }
  isPlaying = true;

  editor = new Editor(levelIndex);

  MainLoop.start();
}

function gameUpdate(delta) {
  // Call the update methods of all objects.

  editor.update(delta);

  TWEEN.update();
}

function gameDraw(interpolationPercentage) {
  clearCanvas();
  gameContext.save();

  // Call the draw methods of all objects.
  editor.draw();

  gameContext.restore();
  redrawCanvas();
}

function clearCanvas() {
  gameContext.clearRect(0, 0, gameCanvas.width, gameCanvas.height);
  drawContext.clearRect(0, 0, drawCanvas.width, drawCanvas.height);
}

// Make sure we can handle the game when it has fallen too far behind real time.
// For example when the browser window is hidden or moved to the background.
MainLoop.setEnd(function(fps, panic) {
  if (panic) {
    var discardedTime = Math.round(MainLoop.resetFrameDelta());
    // console.warn('Main loop panicked, probably because the browser tab was put in the background. Discarding ' + discardedTime + 'ms');
  }
});
