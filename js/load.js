var Images = new (function() {
  var images = {
    // key: 'img/image_name.png'
  };

  this.initialize = function(callback) {
    var numToLoad = Object.keys(images).length;
    if (numToLoad === 0 && callback) {
      callback();
      return;
    }

    for (var key in images) {
      if (images.hasOwnProperty(key)) {
        this[key] = loadImage(images[key]);
      }
    }

    function loadImage(src) {
      var img = document.createElement('img');
      img.onload = doneLoading;
      img.src = src;

      return img;
    }

    function doneLoading() {
      numToLoad--;
      if (numToLoad === 0) {
        callback();
      }
    }

    return this;
  }
})();

var Sounds = new (function() {
  this.audioFormat = '.mp3';
  var audio = new Audio();
  if (audio.canPlayType('audio/ogg')) {
    this.audioFormat = '.ogg';
  }

  var sounds = {
    // key_theme: 'sfx/file_name'
  };

  this.initialize = function(callback) {
    var numToLoad = Object.keys(sounds).length;
    if (numToLoad === 0 && callback) {
      callback();
      return;
    }
    for (var key in sounds) {
      if (sounds.hasOwnProperty(key)) {
        this[key] = new Sound(sounds[key] + this.audioFormat, doneLoading);
      }
    }

    function doneLoading(event) {
      if (event) {
        // Remove event-listener so it only fires once!
        event.target.removeEventListener(event.type, arguments.callee);
      }
      numToLoad--;
      if (numToLoad <= 0 && callback) {
        callback();
      }
    }
  };

  this.play = function(sound) {
    sound += '_' + settings['theme'];
    if (this[sound]) {
      this[sound].play();
    }
  };

  var Sound = function(_file, callback) {
    var timeOut = 8;
    var lastPlay = 0;
    var numSounds = 5;
    var index = 0;
    var file = new Audio(_file);
    file.addEventListener('canplaythrough', callback);
    file.load();
    var queue = [file];

    for (var i = 1; i < numSounds; i++) {
      queue[i] = queue[0].cloneNode(false);
    }

    this.play = function() {
      if (!settings.sound) {
        return;
      }
      if (Date.now() - lastPlay > timeOut) {
        lastPlay = Date.now();
        queue[index].currentTime = 0;
        queue[index].play();
        var s = queue[index];

        index++;
        if (index >= numSounds) {
          index = 0;
        }

        return s;
      }
    };
  };
})();

var Music = new (function() {
  var songPlaying = '';
  var songs = {
  };

  this.initialize = function(callback) {
    var numToLoad = Object.keys(songs).length;
    if (numToLoad == 0 && callback) {
      callback();
      return;
    }
    for (var key in songs) {
      if (songs.hasOwnProperty(key)) {
        this[key] = new Audio(songs[key] + Sounds.audioFormat);
        this[key].addEventListener('canplaythrough', doneLoading);
        this[key].load();
        if (key.indexOf('_intro') == -1) {
          this[key].loop = true;
        }
      }
    }

    function doneLoading(event) {
      if (event) {
        // Remove event-listener so it only fires once!
        event.target.removeEventListener(event.type, arguments.callee);
      }
      numToLoad--;
      if (numToLoad <= 0 && callback) {
        callback();
      }
    }

    this.play = function(song) {
      if (!settings.music) {
        return;
      }
      if (!song) {
        if (!songPlaying) {
          return;
        }
        song = songPlaying;
      }

      songPlaying = song;
      if (this[song + '_intro']) {
        this[song + '_intro'].play();
        var loop = this[song + '_loop'];
        this[song + '_intro'].addEventListener('ended', function(event) {
          if (event) {
            // Remove event-listener so it only fires once!
            event.target.removeEventListener(event.type, arguments.callee);
          }

          loop.play();
        });
      }
      else if (this[song + '_loop']) {
        this[song + '_loop'].play();
      }
    };
  };

  this.stop = function() {
    for (var key in songs) {
      if (songs.hasOwnProperty(key)) {
        this[key].currentTime = 0;
        this[key].pause();
      }
    }
  };
})();
