var Car = function(startPosition, drivePower, sensors) {

  var x = startPosition.x;
  var y = startPosition.y;

  this.angle = 0;
  this.speed = 0; 
  this.sensors = [];

  for (var s = 0; s < sensors.length; s++) {
    this.sensors.push(new Sensor(this, sensors[s].x, sensors[s].y, sensors[s].length, sensors[s].angle, sensors[s].steerAngle));
  }

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

    tireTracks.add(x,y,this.angle);

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
  };

};
