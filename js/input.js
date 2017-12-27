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
  document.addEventListener('keydown', keyDown);
  document.addEventListener('keyup', keyUp);

  drawCanvas.addEventListener('mousemove', updateMousePosition);
  drawCanvas.addEventListener('mousedown', clickOrTouch);
  drawCanvas.addEventListener('mouseup', clickOrTouchEnd);

  drawCanvas.addEventListener('touchmove', updateMousePosition);
  drawCanvas.addEventListener('touchstart', clickOrTouch);
  drawCanvas.addEventListener('touchend', clickOrTouchEnd);
  drawCanvas.addEventListener('touchcancel', clickOrTouchEnd);
}

function keyDown(event) {
}

function keyUp(event) {
  switch (event.keyCode) {
    case KEY_ESC:
      if (isPaused) {
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
  }
  if (DEBUG) {
    console.log('key ' + event.keyCode);
  }
}

function setMousePos(posX, posY) {
  var rect = drawCanvas.getBoundingClientRect();

  mouse = scaleCoordinates(posX - rect.left, posY - rect.top);

  mouse.button = -1;
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
