var Car = function(startPosition, drivePower, sensors) {

  var x = startPosition.x;
  var y = startPosition.y;

  this.angle = 0;
  this.speed = 0; 
  this.sensors = [];
  
  if(!sensors){
    sensors = []
  }
  if(!sensors.length || sensors.length != 2){
    sensors = [
     {x: 30, y: -20, length: 40, angle: -Math.PI / 4, steerAngle: 0.04 / FRAME_RATE_DELTA},
     {x: 30, y: 20, length: 40, angle: Math.PI / 4, steerAngle: -0.04 / FRAME_RATE_DELTA}
    ]
  }
  this.sensors.push(new Sensor(this,sensors[0].x, sensors[0].y, sensors[0].length, sensors[0].angle, sensors[0].steerAngle))
  this.sensors.push(new Sensor(this,sensors[1].x, sensors[1].y, sensors[1].length, sensors[1].angle, sensors[1].steerAngle))
  

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
