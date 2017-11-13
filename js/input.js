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
  if (event.keyCode === KEY_ESC) {
    if (isPaused) {
      continueGame();
    }
    else if (isPlaying) {
      showGamePause();
    }
    else {
      showMenu();
    }
  }

  // Call each play field and let them handle the key press.
}

function keyUp(event) {
  // Call each play field and let them handle the key release.
}
