var Car = function(startPosition, carSettings, sourceImage, drivePower, isGhost, tintColor) {

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

  this.isRacing = false;
  this.isDriving = true;
  this.isGhost = isGhost;
  this.angle = 0;
  this.speed = 0;
  this.sensors = [];
  this.isBraking = false; // used for tire tracks
  this.isTurning = false; // used for skid marks
  this.raceTime = 0;
  this.lapTime = 0;
  this.bestRaceTime = this.getSetting('bestTime', 0);
  this.lapTimeString = '00:00.000';
  this.lapCounter = 1; // in a race you start on lap 1
  this.lapNumberString = this.lapCounter + '/' + RACE_LAP_COUNT;

  var ghostAlphaDistanceSquared = Math.pow(this.image.width, 2) + Math.pow(this.image.height, 2);

  // Clear tracks when creating a new car
  tireTracks.reset();

  // Start your engines!
  this.engineSound = false;
  if (!this.isGhost) {
    this.engineSound = Sound.play('carSound', true, 0.04); // the sample may be playing on >1 channel
    this.engineSoundplayID = Sound.lastChannelID; // so we know WHICH one is this car
  }

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
    this.raceTime = 0;
    this.lapTime = 0;
    this.lapCounter = 1;
    this.lapNumberString = this.lapCounter + '/' + RACE_LAP_COUNT;
//    tireTracks.reset();
  };

  this.startRace = function() {
    this.raceTime = 0;
    this.startDriving();
    if (!this.isGhost) {
      this.isRacing = true;
    }
  };

  this.stopRacing = function() {
    this.lapCounter = 1;
    this.isRacing = false;
  };

  this.startDriving = function() {
    this.isDriving = true;
    if (this.engineSound) {
      this.engineSound.play();
    }
  };

  this.stopDriving = function() {
    this.isRacing = false;
    this.isDriving = false;
    if (this.engineSound) {
      this.engineSound.pause();
    }
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
    if (!this.isDriving) {
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

    if (!this.isGhost) {
      // marks on the road when we skid
      this.skidMarkHandling();
    }

    // dirt/gravel/dust particles kicked up by the tires
    if (Math.random()>0.666) { // not every frame
      if (!this.isGhost) {
        var dustColor = track.pixelColor(x, y);
        particles.add(x + Math.random() * 20 - 10, y + Math.random() * 20 - 10, Images.smoke, 1500, 80, dustColor);
      }

      // check SAME pixel rgb again! (FIXME!) to determine track surface type
      this.tireSurface = track.testRoadSurface(x,y); // eg ROAD_SURFACE_ASPHALT

      // pitch shift the engine sound loop based on speed
      if (this.engineSound) {
        var sampleRate = clamp(speed*SPEED_TO_ENGINE_SOUND_SAMPLERATE_RATIO, 0.15, 2.0);
        //console.log('sampleRate:'+sampleRate);
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

  this.checkGoal = function() {
    if (x >= goalX && lastX <= goalX && y > goalMinY && y < goalMaxY && this.lapTime > 20) {
      this.raceTime += this.lapTime;

      this.lapTimeString = makeTimeString(this.lapTime);
      this.lapTime = 0;

      if (this.isRacing && !this.isGhost) {
        if (this.lapCounter < RACE_LAP_COUNT) {
          this.lapCounter++;
          this.lapNumberString = this.lapCounter + '/' + RACE_LAP_COUNT;
        }

        if (RACE_LAP_COUNT === this.lapCounter) {
          this.lapCounter++;
          //console.log('FINAL LAP!');
          track.showFinalLap();
        }
        else if (RACE_LAP_COUNT < this.lapCounter) {
          showGameOver();

          // Save best lap time and copy sensors to ghost if better
          if (this.isRacing && !this.isGhost && (this.bestRaceTime === 0 || this.raceTime < this.bestRaceTime)) {
            ghost.useSensors(this.getSensorData());
            ghost.setSetting('bestTime', this.raceTime);
            ghost.setSetting('sensors', this.getSensorData());
            this.setSetting('bestTime', this.raceTime);
            this.setSetting('sensors', this.getSensorData());
            this.bestRaceTime = this.raceTime;
            console.log('stored best race time');
          }

          this.stopDriving();
          ghost.stopDriving();
        }
      }
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
    if (this.isGhost) {
      var carPosition = car.getPosition();
      var dist = distanceBetweenPointsSquared({x: carPosition.x, y: carPosition.y}, {x: x, y: y});
      if (dist < ghostAlphaDistanceSquared) {
        gameContext.save();
        gameContext.globalAlpha = 0.3 + (dist / ghostAlphaDistanceSquared);
      }
    }
    drawImage(gameContext, Images.head_lights, x, y, this.angle);

    drawImage(gameContext, this.image, x, y, this.angle);

    if (this.isGhost && dist < ghostAlphaDistanceSquared) {
      gameContext.restore();
    }

    if (!this.isGhost && (isEditing || isEditToggling)) {

      // tire surface debug text - FIXME / remove?
      if (this.tireSurface && DEBUG) {
        drawText(gameContext, x+24, y, "WHITE", "12px arial", "left", 0, ROAD_SURFACE_STRINGS[this.tireSurface]);
      }

      for (var s = 0; s < this.sensors.length; s++) {
        this.sensors[s].draw();
      }
    }
  };

};
