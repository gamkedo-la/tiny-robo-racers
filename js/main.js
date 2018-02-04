var gameCanvas, gameContext;
var editCanvas, editContext;

var screenShakeAmount = 0;
var screenShakeAmountHalf = 0;

var mouse = {
  x: 0,
  y: 0,
  button: -1
};

var isPlaying = false;
var isEditing = false;
var isEditToggling = false;
var isPaused = false;
var isGameOver = false;

var track;
var sidebar;
var car;
var ghost;

var btnPause, btnEdit;

if (STRESSTEST_AI) {
  var manyGhosts = [];
}

var settings;
var levelsList;
var playerSettings;
var ghostSettings;

window.onload = function() {
  gameCanvas = document.getElementById('gameCanvas');
  gameContext = gameCanvas.getContext('2d');
  editCanvas = document.getElementById('editCanvas');
  editContext = editCanvas.getContext('2d');

  window.addEventListener('blur', windowOnBlur);

  settings = new LocalStorage('trr', 'settings');
  levelsList = new LocalStorage('trr', 'levelsList');
  playerSettings = new LocalStorage('trr', 'player');
  ghostSettings = new LocalStorage('trr', 'ghost');
  
  loadCustomLevels();

  initDrawingCanvas();

  MainLoop
    .stop()
    .setMaxAllowedFPS(FRAME_RATE)
    .setUpdate(gameUpdate)
    .setDraw(gameDraw);

  Images.initialize(menuInitialize);
};

function windowOnBlur() {
  if (MainLoop.isRunning()) {
    showGamePause();
  }
}

function gameInitialize(levelIndex) {
  if (!levels[levelIndex]) {
    alert('No level? ' + levelIndex);
    return;
  }
  isPlaying = true;

  // FIXME: 'rgba(10,10,255,0.5)' tint according the player prefs and use a B&W source image
  var tintColor = null;

  sidebar = new Sidebar(Images.carRedBig, tintColor);
  track = new Track(levelIndex);
  track.initializeTrack();

  btnPause = new ButtonImage(drawContext, 0, 0, Images.button_pause, false, false, showGamePause);
  btnEdit = new ButtonImage(drawContext, 44, 0, Images.button_pencil, false, false, sidebar.toggle.bind(sidebar));

  car = new Car(track.playerStart, playerSettings, Images.carRed, DRIVE_POWER, false, tintColor);

  ghost = new Car(track.playerStart, ghostSettings, Images.carYellow, DRIVE_POWER, true);

  sidebar.toggle();

  if (STRESSTEST_AI) {
    for (var nextone, loop=0; loop<20; loop++) {
      nextone = new Car(
        {x:track.playerStart.x-80*Math.random(), // mostly behind the player
          y:track.playerStart.y+60*Math.random()-30}
          , Images.carYellow, DRIVE_POWER, [
          {x: 15, y: -7, length: 40, angle: -Math.PI / 10 * Math.random(), steerAngle: 0.1 / FRAME_RATE_DELTA * Math.random()},
          {x: 15, y: 7, length: 40, angle: Math.PI / 10 * Math.random(), steerAngle: -0.1 / FRAME_RATE_DELTA * Math.random()}
        ]);
      nextone.isGhost = true;
      manyGhosts[manyGhosts.length] = nextone;
    }
  }

  MainLoop.start();
}

function shakeScreen(amount) {
  screenShakeAmountHalf = amount / 2;
  screenShakeAmount = amount;
}

function gameUpdate(delta) {
  // Call the update methods of all objects.
  track.update(delta);
  sidebar.update(delta);

  btnPause.update(delta);
  btnEdit.update(delta);

  particles.update();
  if (STRESSTEST_AI) { 
    manyGhosts.map(function(nextone){nextone.update(delta);});
  }
  ghost.update(delta);
  car.update(delta);

  TWEEN.update();
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
  sidebar.draw();
  track.draw();
  tireTracks.draw();

  if (STRESSTEST_AI) { 
    manyGhosts.map(function(nextone){nextone.draw();});
  }

  particles.draw();
  ghost.draw();
  car.draw();
  track.drawOverlay();
  track.drawText();

  gameContext.restore();
  redrawCanvas();

  btnPause.draw();
  btnEdit.draw();
}

function clearCanvas() {
  editContext.clearRect(0, 0, editCanvas.width, editCanvas.height);
  gameContext.clearRect(0, 0, gameCanvas.width, gameCanvas.height);
  drawContext.clearRect(0, 0, drawCanvas.width, drawCanvas.height);
}

// Make sure we can handle the game when it has fallen too far behind real time.
// For example when the browser window is hidden or moved to the background.
MainLoop.setEnd(function(fps, panic) {
  if (panic) {
    var discardedTime = Math.round(MainLoop.resetFrameDelta());
    console.warn('Main loop panicked, probably because the browser tab was put in the background. Discarding ' + discardedTime + 'ms');
  }
});
