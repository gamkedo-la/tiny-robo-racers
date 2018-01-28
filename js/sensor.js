var Sensor = function(car, x, y, length, angle, steerAngle) {

  this.length = length;
  this.angle = angle;
  this.steerAngle = steerAngle;

  var start_x, start_y;
  var end_x, end_y;
  var edit_start_x, edit_start_y;
  var edit_end_x, edit_end_y;
  var colorOk = '#0f0';
  var colorTriggering = '#ff0';

  var isTriggering = false;

  var scale = sidebar.image.width / car.image.height;

  this.getSensorData = function() {
    return {
      x: x,
      y: y,
      length: this.length,
      angle: this.angle,
      steerAngle: this.steerAngle
    };
  };

  this.addAngle = function(addAngle) {
    this.angle += addAngle;
  };

  this.addSteerAngle = function(addSteerAngle) {
    this.steerAngle += addSteerAngle;
  };

  this.addLength = function(addLength) {
    this.length += addLength;
    if (SENSOR_MAX_LENGTH < this.length) {
      this.length = SENSOR_MAX_LENGTH;
    }
    else if (this.length < SENSOR_MIN_LENGTH) {
      this.length = SENSOR_MIN_LENGTH;
    }
  };

  this.getEditBounds = function() {
    var x1 = (edit_start_x < edit_end_x) ? edit_start_x : edit_end_x;
    var x2 = (edit_start_x < edit_end_x) ? edit_end_x : edit_start_x;
    var y1 = (edit_start_y < edit_end_y) ? edit_start_y : edit_end_y;
    var y2 = (edit_start_y < edit_end_y) ? edit_end_y : edit_start_y;

    return {
      top: y1,
      left: x1,
      bottom: y2,
      right: x2
    };
  };

  this.update = function(delta) {
    start_x = x * Math.cos(car.angle) - y * Math.sin(car.angle) + car.getPosition().x;
    start_y = x * Math.sin(car.angle) + y * Math.cos(car.angle) + car.getPosition().y;
    end_x = start_x + Math.cos(this.angle + car.angle) * this.length;
    end_y = start_y + Math.sin(this.angle + car.angle) * this.length;

    if (!car.isGhost && (isEditing || isEditToggling)) {
      edit_start_x = y * scale + sidebar.carX;
      edit_start_y = x * -scale + sidebar.carY;
      edit_end_x = edit_start_x + Math.cos(this.angle - Math.PI / 2) * this.length * 2;
      edit_end_y = edit_start_y + Math.sin(this.angle - Math.PI / 2) * this.length * 2;
    }

    isTriggering = !track.coordsAreDriveable(end_x, end_y);

    if (isTriggering) {
      car.steer(this.steerAngle * delta);
    }
  };

  this.draw = function() {
    var c = isTriggering ? colorTriggering : colorOk;

    drawLines(gameContext, c, 2, [
      {x: start_x, y: start_y},
      {x: end_x, y: end_y}
    ]);


    if (!car.isGhost && (isEditing || isEditToggling)) {
      if (!sidebar.editingSensor || this === sidebar.editingSensor) {
        // Also draw it in the sidebar
        drawLines(editContext, c, 4, [
          { x: edit_start_x, y: edit_start_y },
          { x: edit_end_x, y: edit_end_y }
        ]);
      }
    }
  };

};
