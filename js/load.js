var Images = new (function() {
  var images = {
    // key: 'img/image_name.png'
    track_wall: 'img/track_wall.png',
    track_road: 'img/track_road.png',
    carYellow: 'img/carYellow.png',
    carRed: 'img/carRed.png',
    tire_tracks: 'img/tire_tracks.png',
  };

  this.initialize = function(callback) {
    var numToLoad = Object.keys(images).length;
    if (numToLoad === 0 && callback) {
      callback();
      return;
    }

    for (var key in images) {
      if (images.hasOwnProperty(key)) {
        this.loadImage(key, images[key]);
        this[key].onload = doneLoading;
      }
    }

    function doneLoading() {
      numToLoad--;
      if (numToLoad === 0) {
        callback();
      }
    }

    return this;
  };

  this.loadImage = function(key, src) {
    var img = document.createElement('img');
    img.src = src;
    this[key] = img;
  };

})();

var Sounds = new (function() {
  this.audioFormat = '.mp3';
  var audio = new Audio();
  if (audio.canPlayType('audio/ogg')) {
    this.audioFormat = '.ogg';
  }

  var sounds = {
    // key: 'sfx/file_name_without_extension'
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
      if (!settings.get('sound')) {
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
    // key: 'music/file_name_without_extension'
  };

  this.initialize = function(callback) {
    var numToLoad = Object.keys(songs).length;
    if (numToLoad === 0 && callback) {
      callback();
      return;
    }

    for (var key in songs) {
      if (songs.hasOwnProperty(key)) {
        this[key] = new Audio(songs[key] + Sounds.audioFormat);
        this[key].addEventListener('canplaythrough', doneLoading);
        this[key].load();
        if (key.indexOf('_intro') === -1) {
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
      if (!settings.get('music')) {
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
