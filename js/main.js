var gameCanvas, gameContext;

var screenShakeAmount = 0;
var screenShakeAmountHalf = 0;

var isPlaying = false;
var isPaused = false;
var isGameOver = false;

var track;
var car;

var settings;
var levelsList;

window.onload = function() {
  gameCanvas = document.getElementById('gameCanvas');
  gameContext = gameCanvas.getContext('2d');

  window.addEventListener("blur", windowOnBlur);

  settings = new LocalStorage('trr', 'settings');
  levelsList = new LocalStorage('trr', 'levelsList');

  initDrawingCanvas();

  MainLoop
    .stop()
    .setMaxAllowedFPS(FRAME_RATE)
    .setUpdate(gameUpdate)
    .setDraw(gameDraw);

  Sounds.initialize(function() {
    Music.initialize(function() {
      Images.initialize(menuInitialize);
    })
  });
};

function windowOnBlur() {
  if (MainLoop.isRunning()) {
    showGamePause();
  }
}

function gameInitialize() {
  isPlaying = true;

  track = new Track(0);
  car = new Car(track.playerStart, DRIVE_POWER);

  MainLoop.start();
}

function shakeScreen(amount) {
  screenShakeAmountHalf = amount / 2;
  screenShakeAmount = amount;
}

function gameUpdate(delta) {
  // Call the update methods of all objects.
  track.update(delta);
  car.update(delta);

  TWEEN.update(delta);
}

function gameDraw(interpolationPercentage) {
  clearCanvas();
  gameContext.save();

  if (screenShakeAmount) {
    if (screenShakeAmount < screenShakeAmountHalf) {
      screenShakeAmount *= 0.75;
    }
    else {
      screenShakeAmount *= 0.95;
    }

    gameContext.translate(Math.random() * screenShakeAmount - screenShakeAmount * 0.5, Math.random() * screenShakeAmount - screenShakeAmount * 0.5);

    if (screenShakeAmount <= 0.02) {
      screenShakeAmount = 0;
    }
  }

  // Call the draw methods of all objects.
  track.draw();
  car.draw();

  gameContext.restore();
  redrawCanvas();
}

function clearCanvas() {
  gameContext.clearRect(0, 0, gameCanvas.width, gameCanvas.height);
  redrawCanvas();
}

// Make sure we can handle the game when it has fallen too far behind real time.
// For example when the browser window is hidden or moved to the background.
MainLoop.setEnd(function(fps, panic) {
  if (panic) {
    var discardedTime = Math.round(MainLoop.resetFrameDelta());
    console.warn('Main loop panicked, probably because the browser tab was put in the background. Discarding ' + discardedTime + 'ms');
  }
});
