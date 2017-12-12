var Car = function(startPosition, drivePower, sensors) {

  var x = startPosition.x;
  var y = startPosition.y;

  this.angle = 0;
  this.speed = 0; 
  this.sensors = [];
  this.isBraking=false; // used for tire tracks
  this.isTurning=false; // used for skid marks

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

    this.isTurning = false; // did ANY sensor trigger a steering change?
    for (var s = 0; s < this.sensors.length; s++) {
      this.isTurning = this.isTurning || this.sensors[s].update(delta);
    }

    var speed = this.speed * (delta / 1000);
    x += Math.cos(this.angle) * speed;
    y += Math.sin(this.angle) * speed;

    this.carTrackHandling(delta);
    this.skidMarkHandling();

  };

  this.skidMarkHandling = function() {
    // draw tire tracks / skid marks
    //console.log(this.speed); // normally in the 160 range
    var tireTrackAlpha = this.speed/3200;
    if (this.isTurning) tireTrackAlpha = 0.75;
    else if (this.isBraking) tireTrackAlpha = 1.0;
    // all alphas are way less than 50% dark
    tireTrackAlpha *= 0.05;
    tireTracks.add(x,y,this.angle,tireTrackAlpha);
  }

  this.carTrackHandling = function(delta) {
    if (!track.coordsAreDriveable(x, y)) {
      this.undoMove(delta);
      this.isBraking = true;
      this.speed = -this.speed / 2;
    }
    else
    {
      this.isBraking = false;
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
