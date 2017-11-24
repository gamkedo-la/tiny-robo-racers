var drawCanvas, drawContext;
var gameCanvas, gameContext;

var screenShakeAmount = 0;
var screenShakeAmountHalf = 0;

var isPlaying = false;
var isPaused = false;
var isGameOver = false;

var track;
var car;

var settings = {};

window.onload = function() {
  gameCanvas = document.getElementById('gameCanvas');
  gameContext = gameCanvas.getContext('2d');

  window.addEventListener("focus", windowOnFocus);
  window.addEventListener("blur", windowOnBlur);

  initDrawingCanvas();

  var _settings = JSON.parse(localStorage.getItem('settings'));
  if (_settings) {
    settings = _settings;
  }

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

function windowOnFocus() {
  if (!MainLoop.isRunning()) {
    MainLoop.start();
  }
}

function windowOnBlur() {
  if (MainLoop.isRunning()) {
    MainLoop.stop();
  }
}

function gameInitialize() {
  isPlaying = true;

  track = new Track(0);
  car = new Car(track.playerStart, DRIVE_POWER);

  MainLoop.start();
}

function setSetting(setting, value) {
  settings[setting] = value;

  if (localStorage && localStorage.setItem) {
    localStorage.setItem('settings', JSON.stringify(settings));
  }

  return settings[setting];
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
