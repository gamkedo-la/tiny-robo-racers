var $activeWrapperScreen;

function menuInitialize() {
  $('#loading').remove();

  setupInput();

  showMenu();

  $('#wrapper a').on('click', function (event) {
    event.preventDefault();

    $activeWrapperScreen.hide();

    if ($(this).hasClass('level-editor')) {
      showMenu();
      alert('Level editor is not yet implemented.');
    }
    else if ($(this).hasClass('continue')) {
      continueGame();
    }
    else if (this.hash) {
      stopGameForMenu();
      callShowMenuScreen(this.hash.substr(1));
      $activeWrapperScreen = $(this.hash).show();
    }
  });

  // Level load buttons
  $('#levels').on('click', 'button.load', function(event) {
    event.preventDefault();
    $activeWrapperScreen.hide();
    gameInitialize(this.value);
  });

  $('#levels').on('click', 'button.delete', function(event) {
    alert('Deleting of custom levels not yet implemented. (' + this.value + ')');
  });

  if (DEBUG) {
    // start play now!
    $activeWrapperScreen.hide();
    gameInitialize(0);
  }
}

function callShowMenuScreen(screen) {
  var functionName = 'show' + screen.ucFirst();
  if (typeof window[functionName] === 'function') {
    window[functionName]();
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

function showLevels() {
  var $list = $('#levels table tbody').empty();

  var numLevels = levels.length;
  for (var i = 0; i < numLevels; i++) {
    $list.append($('<tr><th>' + levels[i].label + '</th><td>' +
      '<button class="load" value="' + i + '">Load</button>' +
//      '<button class="delete" value="' + i + '">Delete</button>' +
      '</td><tr>'));
  }
}

function showHiscore() {
  var $list = $('#hiscore table tbody').empty();

  var numLevels = 2;
  var numHiscores = 4;
  for (var l = 1; l <= numLevels; l++) {
    if (1 < l) {
      $list.append($('<tr><td colspan="3" class="spacer"></td></tr>'));
    }
    for (var i = 1; i <= numHiscores; i++) {
      $list.append($('<tr><th>Name</th>' +
        '<td>Track ' + l + '</td>' +
        '<td>01:0' + i + '</td></tr>'));
    }
  }
}

function showSettings() {
  settingImgToggle($('#settingSound'), 'sound', 'img/icons/sound-');
  settingImgToggle($('#settingMusic'), 'music', 'img/icons/music-');

  function settingImgToggle($button, settingName, src) {
    var $img = $('img', $button);
    $button
      .on('show', function() {
        $img.attr('src', src + (settings.get(settingName, true) ? 'on' : 'off') + '.png');
      })
      .on('click', function(event) {
        event.preventDefault();

        settings.set(settingName, !settings.get(settingName, true));
        $button.trigger('show');
      })
      .trigger('show');
  }
}
