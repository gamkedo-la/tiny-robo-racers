var Car = function(startPosition, drivePower) {

  var x = startPosition.x;
  var y = startPosition.y;

  this.angle = 0;
  this.speed = 0;

  this.sensors = [];
  this.sensors.push(new Sensor(this, 20, -10, 40, -Math.PI / 4, 0.04 / FRAME_RATE_DELTA));
  this.sensors.push(new Sensor(this, 20, 10, 40, Math.PI / 4, -0.04 / FRAME_RATE_DELTA));

  this.getPosition = function() {
    return {
      x: x,
      y: y
    }
  };

  this.update = function(delta) {
    this.speed *= GROUNDSPEED_DECAY_MULT * delta;
    this.speed += drivePower * delta;

    for (var s = 0; s < this.sensors.length; s++) {
      this.sensors[s].update(delta);
    }

    var speed = this.speed * (delta / 1000);
    x += Math.cos(this.angle) * speed;
    y += Math.sin(this.angle) * speed;

    this.carTrackHandling(delta);
  };

  this.carTrackHandling = function(delta) {
    if (!track.coordsAreDriveable(x, y)) {
      this.undoMove(delta);

      this.speed = -this.speed / 2;
    }
  };

  this.undoMove = function(delta) {
    var speed = this.speed * (delta / 1000);
    x -= Math.cos(this.angle) * speed;
    y -= Math.sin(this.angle) * speed;
  };

  this.draw = function() {
    drawImage(gameContext, Images.car, x, y, this.angle);

    for (var s = 0; s < this.sensors.length; s++) {
      this.sensors[s].draw();
    }

//    if (DEBUG) {
//      var col = Math.floor(x / TRACK_WIDTH);
//      var row = Math.floor(y / TRACK_HEIGHT);
//      drawStrokeRect(gameContext, col * TRACK_WIDTH, row * TRACK_HEIGHT, TRACK_WIDTH, TRACK_HEIGHT, '#fff', 1);
//    }
  };

};
