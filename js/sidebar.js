var Sidebar = function(image, tintColor) {

  var that = this;

  if (tintColor != null)
    this.image = createTintedSprite(image, tintColor);
  else
    this.image = image;

  this.carX = 180;
  this.carY = 350;

  this.editingSensor = false;
  var prevAngle, prevSteerAngle, prevlength;
  var editingAngle = false;
  var editingSteerAngle = false;
  var editingLength = false;

  var minPercentage = 0.08;

  this.editingAnimationPercentage = isEditing ? 1 : minPercentage;

  var btnReset = new ButtonText(editContext, 60, 700, 'Reset car', GAME_FONT_BUTTON, false, false, resetCar);
  var btnStart = new ButtonText(editContext, 200, 700, 'Start race!', GAME_FONT_BUTTON, false, false, startRace);

  var dialogBox = new Drawbox(editContext, Images.button_inactive, 200, 300);
  var btnSave = new ButtonText(editContext, 200, 700, 'Save', GAME_FONT_BUTTON, false, false, saveSensor);
  var btnCancel = new ButtonText(editContext, 100, 700, 'Cancel', GAME_FONT_BUTTON, false, false, cancelEditSensor);

  function resetCar() {
    track.reset();
    mouse.button = -1;
  }

  function startRace() {
    that.toggle();
    resetCar();
    track.startRace();
    mouse.button = -1;
  }

  function saveSensor() {
    that.editingSensor = false;
    mouse.button = -1;
  }

  function cancelEditSensor() {
    that.editingSensor.angle = prevAngle;
    that.editingSensor.steerAngle = prevSteerAngle;
    that.editingSensor.length = prevlength;

    that.editingSensor = false;
    mouse.button = -1;
  }

  this.show = function() {
    if (!isEditing && !isEditToggling) {
      this.toggle();
    }
  };

  this.toggle = function() {
    if (isEditToggling) {
      return;
    }

    car.stopRacing();

    isEditToggling = true;

    var p = {
      percentage: sidebar.editingAnimationPercentage
    };

    new TWEEN.Tween(p)
      .to({ percentage: isEditing ? minPercentage : 1 }, 600)
      .easing(TWEEN.Easing.Quadratic.Out)
      .onUpdate(function() {
        sidebar.editingAnimationPercentage = p.percentage;
      })
      .onComplete(function() {
        isEditing = !isEditing;
        isEditToggling = false;
      })
      .start();
  };

  this.update = function(delta) {
    if (!isEditing && !isEditToggling) {
      return;
    }

    // @todo fix selecting of sensor
    if (!this.editingSensor && mouse.button !== -1) {
      for (var s = 0; s < car.sensors.length; s++) {
        var b = car.sensors[s].getEditBounds();
        if (b.left < mouse.x && mouse.x < b.right && b.top < mouse.y && mouse.y < b.bottom) {
          this.editingSensor = car.sensors[s];

          prevAngle = this.editingSensor.angle;
          prevSteerAngle = this.editingSensor.steerAngle;
          prevlength = this.editingSensor.length;

          return;
        }
      }
    }

    if (this.editingSensor) {
      if (mouse.button !== -1 && 80 < mouse.x && mouse.x < 280) {
        var dX = mouse.x - 180;

        // Angle: 420 - 500
        if (420 < mouse.y && mouse.y < 500) {
          if (!editingAngle) {
            editingAngle = true;
          }
          else if (dX !== 0) {
            this.editingSensor.addAngle((dX / Math.abs(dX)) / 50);
          }
        }

        // Steering angle: 530 - 610
        else if (530 < mouse.y && mouse.y < 610) {
          if (!editingSteerAngle) {
            editingSteerAngle = true;
          }
          else if (dX !== 0) {
            this.editingSensor.addSteerAngle((dX / Math.abs(dX)) / 50000);
          }
        }

        // Length: 640 - 680
        else if (640 < mouse.y && mouse.y < 680) {
          if (!editingLength) {
            editingLength = true;
          }
          else if (dX !== 0) {
            this.editingSensor.addLength((dX / Math.abs(dX)) / 5);
          }
        }
      }
      else {
        // Reset editing properties
        editingAngle = false;
        editingSteerAngle = false;
        editingLength = false;
      }

      btnSave.update(delta);
      btnCancel.update(delta);
    }
    else {
      btnReset.update(delta);
      btnStart.update(delta);
    }
  };

  this.draw = function() {
    if (!isEditing && !isEditToggling) {
      return;
    }

    editContext.clearRect(0, 0, editCanvas.width, editCanvas.height);

    drawText(editContext, 180, 50, '#fff', GAME_FONT, 'center', 'top', 'Click a sensor');
    drawText(editContext, 180, 70, '#fff', GAME_FONT, 'center', 'top', 'to configure it');

    drawImage(editContext, this.image, this.carX, this.carY);

    if (this.editingSensor) {
      // ------------
      // | Angle    |
      // |<   \    >|
      // | Steering |
      // |<   (Y)  >|
      // | Length   |
      // |< -----  >|
      // ------------

      dialogBox.draw(80, 390);

      drawText(editContext, 90, 410, '#fff', GAME_FONT, 'left', 'middle', 'Angle');
      drawText(editContext, 90, 465, '#fff', GAME_FONT, 'left', 'middle', '<');
      drawText(editContext, 270, 465, '#fff', GAME_FONT, 'right', 'middle', '>');
      drawImageRotatedAlpha(editContext, Images.editAngle, 180, 500, this.editingSensor.angle, 1);

      drawText(editContext, 90, 520, '#fff', GAME_FONT, 'left', 'middle', 'Steering angle');
      drawText(editContext, 90, 575, '#fff', GAME_FONT, 'left', 'middle', '<');
      drawText(editContext, 270, 575, '#fff', GAME_FONT, 'right', 'middle', '>');
      drawImageRotatedAlpha(editContext, Images.editWheel, 180, 580, this.editingSensor.steerAngle * 100, 1);

      drawText(editContext, 90, 630, '#fff', GAME_FONT, 'left', 'middle', 'Length');
      drawText(editContext, 90, 665, '#fff', GAME_FONT, 'left', 'middle', '<');
      drawText(editContext, 270, 665, '#fff', GAME_FONT, 'right', 'middle', '>');
      drawFillRect(editContext, 120, 662, 10 + (110 * (this.editingSensor.length / SENSOR_MAX_LENGTH)), 6, '#fff');

      btnSave.draw();
      btnCancel.draw();
    }
    else {
      btnReset.draw();
      btnStart.draw();
    }
  };

};
