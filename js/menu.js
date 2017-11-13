var $activeWrapperScreen;

function menuInitialize() {
  $('#loading').remove();

  setupInput();

  showMenu();

  $('#wrapper a').on('click', function (event) {
    event.preventDefault();

    $activeWrapperScreen.hide();

    if ($(this).hasClass('play')) {
      gameInitialize();
    }
    else if ($(this).hasClass('continue')) {
      continueGame();
    }
    else {
      stopGameForMenu();
      $activeWrapperScreen = $(this.hash).show();
    }
  });

  if (DEBUG) {
    // start play now!
    $('a.play').trigger('click');
  }
}

function showMenu() {
  stopGameForMenu();

  if ($activeWrapperScreen) {
    $activeWrapperScreen.hide();
  }

  $activeWrapperScreen = $('#menu').show();
}

function stopGameForMenu() {
  if (isPlaying || isGameOver) {
    isPaused = false;
    isPlaying = false;
    isGameOver = false;
    MainLoop.stop();
    clearCanvas();
  }
}

function showGameOver() {
  MainLoop.stop();
  $activeWrapperScreen = $('#gameOver').show();
}

function showGamePause() {
  isPaused = true;
  MainLoop.stop();
  $activeWrapperScreen = $('#gamePause').show();
}

function continueGame() {
  isPaused = false;
  MainLoop.start();
  $activeWrapperScreen = $('#gamePause').hide();
}
