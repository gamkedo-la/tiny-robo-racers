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
}

function keyDown(event) {
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
  }
  if (DEBUG) {
    console.log('key ' + event.keyCode);
  }
}

function keyUp(event) {
}
