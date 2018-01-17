// Prevents player from drag selecting
document.onselectstart = function() {
  window.getSelection().removeAllRanges();
};
document.onmousedown = function() {
  window.getSelection().removeAllRanges();
};
document.oncontextmenu = function() {
  return false;
};

function setupInput() {
  $(document).on('keydown', keyDown)
    .on('keyup', keyUp);

  $(drawCanvas).on('mousemove', updateMousePosition)
    .on('mousedown', clickOrTouch)
    .on('mouseup', clickOrTouchEnd);

  $(drawCanvas).on('touchmove', updateMousePosition)
    .on('touchstart', clickOrTouch)
    .on('touchend', clickOrTouchEnd)
    .on('touchcancel', clickOrTouchEnd);
}

function keyDown(event) {
}

function keyUp(event) {
  switch (event.keyCode) {
    case KEY_ESC:
      if (IS_EDITOR) {
        showMenu();
      }
      else if (isPaused) {
        continueGame();
      }
      else if (isPlaying) {
        showGamePause();
      }
      else {
        showMenu();
      }
      break;
    case KEY_D:
      if (isPlaying) {
        DEBUG = !DEBUG;
        TRACK_SCREENSHOT = false;
      }
      break;
    case KEY_E:
      if (isPlaying) {
        sidebar.toggle();
      }
      break;
    case KEY_S:
      if (isPlaying && DEBUG) {
        TRACK_SCREENSHOT = !TRACK_SCREENSHOT;
      }
      break;
	  case KEY_T:
		  ghost.useSensors([
			{x: 15, y: -7, length: 80, angle: -Math.PI / 10, steerAngle: 0.04 / FRAME_RATE_DELTA},
			{x: 15, y: 7, length: 80, angle: Math.PI / 10, steerAngle: -0.04 / FRAME_RATE_DELTA}
		  ]);
	  break;
    case KEY_M: // mute music toggle
      if (window.MutingMusic) // just a bool for the toggling
      {
        Sound.unMuteSoundByName('music');
        Sound.unMuteSoundByName('menu');
        window.MutingMusic = false;
      }
      else // might be undefined at this point
      {
        Sound.muteSoundByName('music');
        Sound.muteSoundByName('menu');
        window.MutingMusic = true;
      }
      console.log('[M] Mute Music: ' + window.MutingMusic);
      break;
  }
  if (DEBUG) {
    console.log('key ' + event.keyCode);
  }
}

function setMousePos(posX, posY) {
  var rect = drawCanvas.getBoundingClientRect();

  var scaled = scaleCoordinates(posX - rect.left, posY - rect.top);
  mouse.x = scaled.x;
  mouse.y = scaled.y;
}

function updateMousePosition(event) {
  var x, y;

  if (event.targetTouches && event.targetTouches[0]) {
    x = event.targetTouches[0].pageX;
    y = event.targetTouches[0].pageY;
  }
  else {
    x = event.clientX;
    y = event.clientY;
  }

  setMousePos(x, y);
}

function clickOrTouch(event) {
  event.preventDefault();

  updateMousePosition(event);

  if (event.type === 'touchstart') {
    // Left click
    mouse.button = 0;
  }
  else {
    mouse.button = event.button;
  }
}

function clickOrTouchEnd(event) {
  mouse.button = -1;
}
