const SPEED_TO_ENGINE_SOUND_SAMPLERATE_RATIO = 1.0;

var Car = function(startPosition, carSettings, sourceImage, drivePower, tintColor) {

  this.setSetting = function(name, value) {
    return carSettings.set(track.getKey() + '--' + name, value);
  };

  this.getSetting = function(name, defaultValue) {
    return carSettings.get(track.getKey() + '--' + name, defaultValue);
  };

  var x = startPosition.x;
  var y = startPosition.y;
  var lastX;
  var lastY;

  // finish line: derived from car start point! FIXME
  // FIXME: is this wide enough?
  // FIXME: what about starting points pointing up or down or left?
  var goalX = startPosition.x;
  var goalMinY = startPosition.y - 50;
  var goalMaxY = startPosition.y + 50;

  if (tintColor != null)
    this.image = createTintedSprite(sourceImage,tintColor);
  else
    this.image = sourceImage;

  this.isRacing = true;
  this.isGhost = false;
  this.angle = 0;
  this.speed = 0;
  this.sensors = [];
  this.isBraking = false; // used for tire tracks
  this.isTurning = false; // used for skid marks
  this.lapTime = 0;
  this.bestLapTime = this.getSetting('lapTime', 0);
  this.lapTimeString = '00:00.000';

  // Clear tracks when creating a new car
  tireTracks.reset();

  // Start your engines!
  this.engineSound = Sound.play('carSound',true,0.1); // the sample may be playing on >1 channel
  this.engineSoundplayID =  Sound.lastChannelID; // so we know WHICH one is this car

  $(document).on('stopGame', function() {
    if (this.engineSound) {
      this.engineSound.stop();
    }
  }.bind(this));
  $(document).on('pause', function() {
    if (this.engineSound) {
      this.engineSound.pause();
    }
  }.bind(this));
  $(document).on('play', function() {
    if (this.engineSound) {
      this.engineSound.play();
    }
  }.bind(this));
  
  this.useSensors = function(sensorList){
	  this.sensors = [];
    for (var s = 0; s < sensorList.length; s++) {
      this.sensors.push(new Sensor(this, sensorList[s].x, sensorList[s].y, sensorList[s].length, sensorList[s].angle, sensorList[s].steerAngle));
    }
  };

  this.useSensors(this.getSetting('sensors', [
    { x: 15, y: -7, length: 40, angle: -Math.PI / 4, steerAngle: 0.04 / FRAME_RATE_DELTA },
    { x: 15, y: 7, length: 40, angle: Math.PI / 4, steerAngle: -0.04 / FRAME_RATE_DELTA }
  ]));
	
  this.getPosition = function() {
    return {
      x: x,
      y: y
    }
  };

  this.reset = function() {
    x = startPosition.x;
    y = startPosition.y;
    this.angle = 0;
    this.speed = 0;
    this.isBraking = false;
    this.isTurning = false;
    this.lapTime = 0;
//    tireTracks.reset();
  };

  // currently reduces speed based on what is under the tires
  // but what we REALLY want is turning slipping and drifting too FIXME TODO
  // maybe we could affect the turnangle and add some randomness
  // as if we are bumping around on a rough track surface
  this.roadSurfaceDrag = function(currentSpeed) {

    if (!this.tireSurface) // sanity check
      return currentSpeed;

    return currentSpeed * ROAD_SURFACE_FRICTION[this.tireSurface]; // scale it
  };

  // wobble the car's angle based on surface bumpiness
  this.roadSurfaceWobble = function() {

    if (!this.tireSurface) // sanity check
      return 0.0;

    // plus or minus half the size
    var thisMuchWobble = Math.random() * ROAD_SURFACE_ROUGHNESS[this.tireSurface] - (ROAD_SURFACE_ROUGHNESS[this.tireSurface]/2); 
    //console.log("ROAD_SURFACE_ROUGHNESS["+this.tireSurface+"]:"+ROAD_SURFACE_ROUGHNESS[this.tireSurface]+ ' thisMuchWobble='+thisMuchWobble);

    return thisMuchWobble;
  };

  this.update = function(delta) {
    if (!this.isRacing) {
      return;
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

    // terrain affects driving forces
    speed = this.roadSurfaceDrag(speed);
    var angleWobble = this.roadSurfaceWobble();

    //console.log('speed='+speed+' angleWobble='+angleWobble);

    x += Math.cos(this.angle+angleWobble) * speed;
    y += Math.sin(this.angle+angleWobble) * speed;

    this.carTrackHandling(delta);
    
    // marks on the road when we skid
    this.skidMarkHandling();

    // dirt/gravel/dust particles kicked up by the tires
    if (Math.random()>0.666) // not every frame
    {
      var dustColor = track.pixelColor(x,y);
      particles.add(x+Math.random()*20-10,y+Math.random()*20-10,Images.smoke,1500,80,dustColor);

      // check SAME pixel rgb again! (FIXME!) to determine track surface type
      this.tireSurface = track.testRoadSurface(x,y); // eg ROAD_SURFACE_ASPHALT

      // pitch shift the engine sound loop based on speed
      if (this.engineSound)
      {
        var sampleRate = speed*SPEED_TO_ENGINE_SOUND_SAMPLERATE_RATIO;
        //console.log('sampleRate:'+sampleRate);
        if (sampleRate<0.5) sampleRate=0.5;
        if (sampleRate>3.0) sampleRate=3.0;
        this.engineSound.rate(sampleRate,this.engineSoundplayID);
      }

    }

    this.checkGoal();
  };

  this.getSensorData = function() {
    var d = [];

    for (var s = 0; s < this.sensors.length; s++) {
      d.push(this.sensors[s].getSensorData());
    }

    return d;
  };

  this.checkGoal = function(){
    if (x >= goalX && lastX <= goalX && y > goalMinY && y < goalMaxY && this.lapTime > 20) {
      // Save best lap time and copy sensors to ghost if better
      if (this.bestLapTime === 0 || this.lapTime < this.bestLapTime) {
        ghost.useSensors(this.getSensorData());
        ghost.setSetting('lapTime', this.lapTime);
        ghost.setSetting('sensors', this.getSensorData());
        this.setSetting('lapTime', this.lapTime);
        this.setSetting('sensors', this.getSensorData());
        this.bestLapTime = this.lapTime;
      }

      var seconds = Math.floor(this.lapTime / 1000);
      var thousands = Math.round(this.lapTime - seconds * 1000);
      var minutes = Math.floor(seconds / 60);
      if (minutes < 10) {
        minutes = '0' + minutes;
      }
      var leftOverSeconds = seconds % 60;
      if (leftOverSeconds < 10) {
        leftOverSeconds = '0' + leftOverSeconds;
      }

      this.lapTimeString = minutes + ':' + leftOverSeconds + '.' + thousands;
      this.lapTime = 0;
    }
  };

  this.skidMarkHandling = function() {
    // draw tire tracks / skid marks
    //console.log(this.speed); // normally in the 160 range
    var tireTrackAlpha = this.speed / 3200;
    if (this.isTurning) {
      tireTrackAlpha = 0.75;
    }
    else if (this.isBraking) {
      tireTrackAlpha = 1.0;
    }
    // fun idea: we could tint the image for mud/water/oil...
    // the alphas above are now scaled to a tiny range
    tireTrackAlpha *= this.isGhost ? 0.02 : 0.04;
    tireTracks.add(x, y, this.angle, tireTrackAlpha);
  };

  this.steer = function(angle) {
    this.angle += angle;
    if (ANGLE360 <= this.angle) {
      this.angle -= ANGLE360;
    }
    this.isTurning = true;
  };

  this.carTrackHandling = function(delta) {
    if (!track.coordsAreDriveable(x, y)) {
      this.undoMove(delta);
      this.isBraking = true;
      this.speed = -this.speed / 2;
    }
    else {
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

    drawImage(gameContext, this.image, x, y, this.angle);

    if (!this.isGhost && (isEditing || isEditToggling)) {

      // tire surface debug text - FIXME / remove?
      if (this.tireSurface) {
        drawText(gameContext, x+24, y, "WHITE", "12px arial", "left", 0, ROAD_SURFACE_STRINGS[this.tireSurface]);
      }

      for (var s = 0; s < this.sensors.length; s++) {
        this.sensors[s].draw();
      }
    }
  };

};
