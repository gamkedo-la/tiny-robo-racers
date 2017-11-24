var Sensor = function(car, x, y, length, angle, steerAngle) {

  var start_x, start_y;
  var end_x, end_y;
  var colorOk = '#0f0';
  var colorTriggering = '#ff0';

  var isTriggering = false;

  this.update = function(delta) {
    start_x = x * Math.cos(car.angle) - y * Math.sin(car.angle) + car.getPosition().x;
    start_y = x * Math.sin(car.angle) + y * Math.cos(car.angle) + car.getPosition().y;
    end_x = start_x + Math.cos(angle + car.angle) * length;
    end_y = start_y + Math.sin(angle + car.angle) * length;

    isTriggering = !track.coordsAreDriveable(end_x, end_y);

    if (isTriggering) {
      car.angle += steerAngle * delta;
    }
  };

  this.draw = function() {
    var c = isTriggering ? colorTriggering : colorOk;

    drawLines(gameContext, c, 2, [
      {x: start_x, y: start_y},
      {x: end_x, y: end_y}
    ]);
  };

};
