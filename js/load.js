var Images = new (function() {
  var images = {
    // key: 'img/image_name.png'
    button_inactive: 'img/buttonInactive.png',
    button_active: 'img/buttonActive.png',
    button_pencil: 'img/icons/editor-pencil.png',
    button_bucket: 'img/icons/editor-bucket.png',
    button_save: 'img/icons/editor-save.png',
    button_reset: 'img/icons/editor-reset.png',
    button_1: 'img/icons/editor-1x1.png',
    button_2: 'img/icons/editor-2x2.png',
    button_4: 'img/icons/editor-4x4.png',
    track_wall: 'img/track_wall.png',
    track_road: 'img/track_road.png',
    track_playerstart: 'img/track_playerstart.png',
    carYellow: 'img/carYellow.png',
    carRed: 'img/carRed.png',
    carRedBig: 'img/carRed-big.png',
    tire_tracks: 'img/tire_tracks.png',
    head_lights: 'img/headlights.png',
    smoke: 'img/smoke.png',
    editWheel: 'img/edit-wheel.png',
    editAngle: 'img/edit-angle.png'
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
    img.onload = function() {
      this.downloaded = true;
    }
  };

})();
