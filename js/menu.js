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

    if ($this.hasClass('continue') || $this.hasClass('continue-editor')) {
      continueGame();
    }
    else if ($this.hasClass('race-again')) {
      raceAgain();
    }
    else if ($this.hasClass('challenge')) {
      loadChallenge();
    }
    else if (this.hash) {
      callShowMenuScreen(this.hash);
    }
  });

  $('#resetTrackData').on('click', function(event) {
    event.preventDefault();
    if (confirm('Are you sure you want to set all track data?')) {
      playerSettings.clear();
      ghostSettings.clear();
    }
  });

  $('#makeChallenge').show().on('click', function(event) {
    event.preventDefault();
    if (track) {
      track.makeChallengeCode();
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
  }).on('click', 'button.challenge', function(event) {
    makeChallengeCode(this.value);
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

  // Initialize sound setting
  toggleSound(settings.get('mute-sound', true));
}

function callShowMenuScreen(hash) {
  stopGameForMenu();
  var functionName = 'show' + hash.substr(1).ucFirst();
  if (typeof window[functionName] === 'function') {
    window[functionName]();
  }
  $activeWrapperScreen = $(hash).show();
}

function loadChallenge() {
  var challengeCode = prompt('Paste here your Challenge code:');
  if (!challengeCode) {
    return callShowMenuScreen('#menu');
  }

  var challengeData = null;
  try {
    challengeData = JSON.parse(LZString.decompressFromEncodedURIComponent(challengeCode));
  }
  catch (e) {}

  if (!challengeData || (!challengeData.level && !challengeData.index) || !challengeData.bestTime || !challengeData.sensors) {
    alert('Invalid Challenge code?');
    return callShowMenuScreen('#menu');
  }

  setTimeout(function () {
    gameInitialize(null, challengeData);
  }, 10);
}

function showMenu(keepPlaying) {
  if (!keepPlaying) {
    stopGameForMenu();
  }
  clearCanvas();

  if ($activeWrapperScreen) {
    $activeWrapperScreen.hide();
  }

  if (IS_EDITOR) {
    // @todo show button only when already editing a level
    $('#continueEditor').toggle(!!editor);
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
  $('#gameOverWon, #gameOverLost, #makeChallenge').hide();

  var resultId = '#gameOverLost';
  if (car.bestRaceTime === 0 || car.raceTime < car.bestRaceTime) {
    resultId = '#gameOverWon';
    $('#makeChallenge').show();
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
  if (IS_EDITOR) {
    showMenu(true);
  }
  else {
    $activeWrapperScreen = $('#gamePause').show();
  }
}

function continueGame() {
  isPaused = false;
  MainLoop.start();
  $(document).trigger('play');
  $activeWrapperScreen.hide();
  $activeWrapperScreen = null;
}

function showLevels() {
  loadCustomLevels();
  var $list = $('#levels table tbody').empty();

  if (IS_EDITOR) {
    $list.append($('<tr><th>- New level -</th><td class="time"></td>' +
      '<td class="buttons"><button class="load" value="_new">Load</button>' +
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
      '<td class="buttons"><button class="load" value="' + i + '">Load</button>';

    if (bestTime && !IS_EDITOR) {
      row += '&nbsp;<button class="challenge" value="' + i + '">Challenge</button>';
    }

    if (levels[i].custom && IS_EDITOR) {
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

  settingImgToggle($('#settingSound'), 'mute-sound','img/icons/sound-', toggleSound.bind(null, true), toggleSound.bind(null, false));

  function settingImgToggle($button, settingName, src, enableCallback, disableCallback) {
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

function toggleSound(force) {
  if (force !== undefined) {
    window.enabledSounds = !force;
  }

  if (window.enabledSounds) {
    Sound.Mute();
    window.enabledSounds = false;
  }
  else {
    Sound.unMute();
    window.enabledSounds = true;
  }
}
