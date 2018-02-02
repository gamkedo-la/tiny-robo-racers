var $activeWrapperScreen;

function menuInitialize() {
  $('#loading').remove();

  setupInput();

  showMenu();

  $('#wrapper a').on('click', function (event) {
    var $this = $(this);
    if (this.hash) {
      event.preventDefault();
    }

    $activeWrapperScreen.hide();

    if ($this.hasClass('continue')) {
      continueGame();
    }
    else if ($this.hasClass('race-again')) {
      raceAgain();
    }
    else if (this.hash) {
      stopGameForMenu();
      callShowMenuScreen(this.hash.substr(1));
      $activeWrapperScreen = $(this.hash).show();
    }
  });

  $('#resetTrackData').on('click', function(event) {
    event.preventDefault();
    if (confirm('Are you sure you want to set all track data?')) {
      playerSettings.clear();
      ghostSettings.clear();
    }
  });

  // Level load buttons
  $('#levels').on('click', 'button.load', function(event) {
    event.preventDefault();
    $activeWrapperScreen.hide();
    if (!IS_EDITOR) {
      Sound.stop('menu');
    }
    gameInitialize(this.value);
  }).on('click', 'button.delete', function(event) {
    var label = levels[this.value].label;
    if (confirm('Are you sure you want to delete level "' + label + '"?')) {
      deleteCustomLevel(this.value);
    }
    $('#wrapper a[href="#levels"]').trigger('click');
  });

  if (DEBUG) {
    // start play now!
    $activeWrapperScreen.hide();
    if (!IS_EDITOR) {
      Sound.stop('menu');
    }
    gameInitialize(IS_EDITOR ? '_new' : 0);
  }

  // Initialize music setting
  toggleMuteMusic(!settings.get('music', true));
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

  if (IS_EDITOR) {
    // @todo show button only when already editing a level
    $('#continueEditor').toggle(0);
  }

  $activeWrapperScreen = $('#menu').show();
}

function stopGameForMenu() {
  if (isPlaying || isGameOver) {
    isPaused = false;
    isPlaying = false;
    isGameOver = false;
    MainLoop.stop();
    $(document).trigger('stopGame');
    clearCanvas();
  }

  Sound.playUnlessAlreadyPlaying('menu', true, 0.25);
}

function showGameOver() {
  isPaused = true;
  MainLoop.stop();
  $(document).trigger('pause');
  $activeWrapperScreen = $('#gameOver').show();

  $('#bestTime').html(makeTimeString(car.bestRaceTime));
  $('#currentTime').html(makeTimeString(car.raceTime));
  $('#gameOverWon, #gameOverLost').hide();

  var resultId = '#gameOverLost';
  if (car.raceTime < car.bestRaceTime) {
    resultId = '#gameOverWon';
  }
  $(resultId).show();
}

function raceAgain() {
  isPaused = false;
  MainLoop.start();
  $(document).trigger('play');
  $activeWrapperScreen = $('#gameOver').hide();
  track.startRace();
}

function showGamePause() {
  isPaused = true;
  MainLoop.stop();
  $(document).trigger('pause');
  $activeWrapperScreen = $('#gamePause').show();
}

function continueGame() {
  isPaused = false;
  MainLoop.start();
  $(document).trigger('play');
  $activeWrapperScreen = $('#gamePause').hide();
}

function showLevels() {
  loadCustomLevels();
  var $list = $('#levels table tbody').empty();

  if (IS_EDITOR) {
    $list.append($('<tr><th>- New level -</th><td>' +
      '<button class="load" value="_new">Load</button>' +
      '</td><tr>'));
  }

  var numLevels = levels.length;
  for (var i = 0; i < numLevels; i++) {
    var timeString = '(no time)';
    var bestTime = playerSettings.get(getLevelHash(i) + '--bestTime');
    if (bestTime) {
      timeString = makeTimeString(bestTime);
    }
    var row = '<tr><th>' + levels[i].label + '</th>' +
      '<td class="time">' + timeString + '</td>' +
      '<td><button class="load" value="' + i + '">Load</button>';

    if (levels[i].custom) {
      row += '&nbsp;<button class="delete" value="' + i + '">Delete</button>';
    }
    row += '</td><tr>';

    $list.append($(row));
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
  var $settingsWrapper = $('#settings');
  if ($settingsWrapper.data('initialized')) {
    return;
  }
  $settingsWrapper.data('initialized', true);

  settingImgToggle($('#settingSound'), 'sound', 'img/icons/sound-');
  settingImgToggle($('#settingMusic'), 'music', 'img/icons/music-', toggleMuteMusic.bind(null, true), toggleMuteMusic.bind(null, false));

  function settingImgToggle($button, settingName, src, enableCallback, disableCallback) {
    console.log('toggle', settingName);
    var $img = $('img', $button);
    $button
      .on('show', function() {
        $img.attr('src', src + (settings.get(settingName, true) ? 'on' : 'off') + '.png');
      })
      .on('click', function(event) {
        event.preventDefault();

        console.log('set', settingName, !settings.get(settingName, true));
        if (settings.set(settingName, !settings.get(settingName, true))) {
          if (enableCallback) {
            enableCallback();
          }
        }
        else if (disableCallback) {
          disableCallback();
        }
        $button.trigger('show');
      })
      .trigger('show');
  }
}

function toggleMuteMusic(force) {
  if (force !== undefined) {
    window.PlayingMusic = !force;
  }

  if (window.PlayingMusic) // just a bool for the toggling
  {
    Sound.muteSoundByName('music');
    Sound.muteSoundByName('menu');
    window.PlayingMusic = false;
  }
  else // might be undefined at this point
  {
    Sound.unMuteSoundByName('music');
    Sound.unMuteSoundByName('menu');
    window.PlayingMusic = true;
  }

  settings.set('music', window.PlayingMusic);
}
