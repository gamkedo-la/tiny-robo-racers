var Car = function(startPosition, image, drivePower, sensors) {

  var x = startPosition.x;
  var y = startPosition.y;
  var lastX;
  var lastY;
  
  // finish line: derived from car start point! FIXME
  var goalX;
  var goalMinY;
  var goalMaxY;
  
  this.isGhost = false;
  this.angle = 0;
  this.speed = 0; 
  this.sensors = [];
  this.isBraking=false; // used for tire tracks
  this.isTurning=false; // used for skid marks
  this.lapTime = 0;

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

    // determine finish line location if first update
    if (goalX==undefined)
    {
      goalX = x;
      goalMinY = y - 50; // FIXME: is this wide enough?
      goalMax = y + 50;
    }

    this.lapTime += delta;
    this.speed *= GROUNDSPEED_DECAY_MULT * delta;
    this.speed += drivePower * delta;

    this.isTurning = false; // did ANY sensor trigger a steering change?
    for (var s = 0; s < this.sensors.length; s++) {
      this.sensors[s].update(delta);
    }

    var speed = this.speed * (delta / 1000);
      lastX = x;
      lastY = y;
    x += Math.cos(this.angle) * speed;
    y += Math.sin(this.angle) * speed;

    this.carTrackHandling(delta);
    this.skidMarkHandling();
//    this.checkGoal();
  };

  this.checkGoal = function(){
    if(x >= goalX && lastX <= goalX && y > goalMinY && y < goalMaxY && this.lapTime > 20){
      //goal
      if(!this.isGhost){
        lapTime = this.lapTime;
      }
      this.lapTime = 0;
    }
  };

  this.skidMarkHandling = function() {
    // draw tire tracks / skid marks
    //console.log(this.speed); // normally in the 160 range
    var tireTrackAlpha = this.speed/3200;
    if (this.isTurning) tireTrackAlpha = 0.75;
    else if (this.isBraking) tireTrackAlpha = 1.0;
    // fun idea: we could tint the image for mud/water/oil...
    // the alphas above are now scaled to a tiny range
    tireTrackAlpha *= this.isGhost ? 0.015 : 0.035;
    tireTracks.add(x,y,this.angle,tireTrackAlpha);
  };

  this.steer = function(angle) {
    this.angle += angle;
    this.isTurning = true;
  };

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
    drawImage(gameContext, Images.head_lights, x, y, this.angle);

    drawImage(gameContext, image, x, y, this.angle);

    if (DEBUG) {
      for (var s = 0; s < this.sensors.length; s++) {
        this.sensors[s].draw();
      }
    }
  };

};
