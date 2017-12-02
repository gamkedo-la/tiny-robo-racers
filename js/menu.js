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
    else if ($(this).hasClass('level-editor')) {
      showMenu();
      alert('Level editor is not yet implemented.');
    }
    else if ($(this).hasClass('continue')) {
      continueGame();
    }
    else {
      stopGameForMenu();
      callShowMenuScreen(this.hash.substr(1));
      $activeWrapperScreen = $(this.hash).show();
    }
  });

  // Level load buttons
  $('#levels').on('click', 'button', function(event) {
    event.preventDefault();
    alert('Loading of levels not yet implemented. (' + this.value + ')');
  });

  if (DEBUG) {
    // start play now!
    $('a.play').trigger('click');
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
  var $tpl = $.templates('#levelsItem');

  var numLevels = 50;
  for (var i = 1; i <= numLevels; i++) {
    var item = {
      key: 'level_' + i,
      name: 'Level ' + i
    };
    var $item = $tpl.render(item);
    $list.append($item);
  }
}

function showHiscore() {
  var $list = $('#hiscore table tbody').empty();
  var $tpl = $.templates('#hiscoresItem');

  var numLevels = 2;
  var numHiscores = 4;
  for (var l = 1; l <= numLevels; l++) {
    if (1 < l) {
      $list.append($('<tr><td colspan="3" class="spacer"></td></tr>'));
    }
    for (var i = 1; i <= numHiscores; i++) {
      var item = {
        name: 'Name',
        track: 'Level ' + l,
        time: '01:0' + i
      };
      var $item = $tpl.render(item);
      $list.append($item);
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
