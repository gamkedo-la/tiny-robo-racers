var Sensor = function(car, x, y, length, angle, steerAngle) {

  var start_x, start_y;
  var end_x, end_y;
  var edit_start_x, edit_start_y;
  var edit_end_x, edit_end_y;
  var colorOk = '#0f0';
  var colorTriggering = '#ff0';

  var isTriggering = false;

  var scale = sidebar.image.width / car.image.height;

  this.update = function(delta) {
    start_x = x * Math.cos(car.angle) - y * Math.sin(car.angle) + car.getPosition().x;
    start_y = x * Math.sin(car.angle) + y * Math.cos(car.angle) + car.getPosition().y;
    end_x = start_x + Math.cos(angle + car.angle) * length;
    end_y = start_y + Math.sin(angle + car.angle) * length;

    if (!car.isGhost && (isEditing || isEditToggling)) {
      edit_start_x = y * scale + sidebar.carX;
      edit_start_y = x * -scale + sidebar.carY;
      edit_end_x = edit_start_x + Math.cos(angle - Math.PI / 2) * length * 2;
      edit_end_y = edit_start_y + Math.sin(angle - Math.PI / 2) * length * 2;
    }

    isTriggering = !track.coordsAreDriveable(end_x, end_y);

    if (isTriggering) {
      car.steer(steerAngle * delta);
    }
  };

  this.draw = function() {
    var c = isTriggering ? colorTriggering : colorOk;

    drawLines(gameContext, c, 2, [
      {x: start_x, y: start_y},
      {x: end_x, y: end_y}
    ]);


    if (!car.isGhost && (isEditing || isEditToggling)) {
      // Also draw it in the sidebar
      drawLines(editContext, c, 4, [
        {x: edit_start_x, y: edit_start_y},
        {x: edit_end_x, y: edit_end_y}
      ]);
    }
  };

};
