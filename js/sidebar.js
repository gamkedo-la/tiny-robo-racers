var Sidebar = function(image) {

  var that = this;

  this.image = image;
  this.carX = 180;
  this.carY = 350;

  var editingSensor = false;
  var prevAngle, prevSteerAngle, prevlength;
  var editingAngle = false;
  var editingSteerAngle = false;
  var editingLength = false;

  var minPercentage = 0.08;

  this.editingAnimationPercentage = isEditing ? 1 : minPercentage;

  var btnReset = new ButtonText(editContext, 60, 700, 'Reset car', GAME_FONT_BUTTON, resetCar);
  var btnStart = new ButtonText(editContext, 200, 700, 'Start race!', GAME_FONT_BUTTON, startRace);

  var dialogBox = new Drawbox(editContext, Images.button_inactive, 200, 300);
  var btnSave = new ButtonText(editContext, 200, 700, 'Save', GAME_FONT_BUTTON, saveSensor);
  var btnCancel = new ButtonText(editContext, 100, 700, 'Cancel', GAME_FONT_BUTTON, cancelEditSensor);

  function resetCar() {
    car.reset();
    ghost.reset();
    mouse.button = -1;
  }

  function startRace() {
    that.toggle();
    resetCar();
    track.startRace();
    mouse.button = -1;
  }

  function saveSensor() {
    editingSensor = false;
    mouse.button = -1;
  }

  function cancelEditSensor() {
    editingSensor.angle = prevAngle;
    editingSensor.steerAngle = prevSteerAngle;
    editingSensor.length = prevlength;

    editingSensor = false;
    mouse.button = -1;
  }

  this.toggle = function() {
    if (isEditToggling) {
      return;
    }

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
    if (!editingSensor && mouse.button !== -1) {
      for (var s = 0; s < car.sensors.length; s++) {
        var b = car.sensors[s].getEditBounds();
        if (b.left < mouse.x && mouse.x < b.right && b.top < mouse.y && mouse.y < b.bottom) {
          editingSensor = car.sensors[s];

          prevAngle = editingSensor.angle;
          prevSteerAngle = editingSensor.steerAngle;
          prevlength = editingSensor.length;

          return;
        }
      }
    }

    if (editingSensor) {
      if (mouse.button !== -1 && 80 < mouse.x && mouse.x < 280) {
        var dX = mouse.x - 180;

        // Angle: 420 - 500
        if (420 < mouse.y && mouse.y < 500) {
          if (!editingAngle) {
            editingAngle = true;
          }
          else if (dX !== 0) {
            editingSensor.addAngle((dX / Math.abs(dX)) / 50);
          }
        }

        // Steering angle: 530 - 610
        else if (530 < mouse.y && mouse.y < 610) {
          if (!editingSteerAngle) {
            editingSteerAngle = true;
          }
          else if (dX !== 0) {
            editingSensor.addSteerAngle((dX / Math.abs(dX)) / 50000);
          }
        }

        // Length: 640 - 680
        else if (640 < mouse.y && mouse.y < 680) {
          if (!editingLength) {
            editingLength = true;
          }
          else if (dX !== 0) {
            editingSensor.addLength((dX / Math.abs(dX)) / 5);
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

    drawImage(editContext, image, this.carX, this.carY);

    if (editingSensor) {
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
      drawImageRotatedAlpha(editContext, Images.editAngle, 180, 500, editingSensor.angle, 1);

      drawText(editContext, 90, 520, '#fff', GAME_FONT, 'left', 'middle', 'Steering angle');
      drawText(editContext, 90, 575, '#fff', GAME_FONT, 'left', 'middle', '<');
      drawText(editContext, 270, 575, '#fff', GAME_FONT, 'right', 'middle', '>');
      drawImageRotatedAlpha(editContext, Images.editWheel, 180, 580, editingSensor.steerAngle * 100, 1);

      drawText(editContext, 90, 630, '#fff', GAME_FONT, 'left', 'middle', 'Length');
      drawText(editContext, 90, 665, '#fff', GAME_FONT, 'left', 'middle', '<');
      drawText(editContext, 270, 665, '#fff', GAME_FONT, 'right', 'middle', '>');
      drawFillRect(editContext, 120, 662, 10 + (110 * (editingSensor.length / SENSOR_MAX_LENGTH)), 6, '#fff');

      btnSave.draw();
      btnCancel.draw();
    }
    else {
      btnReset.draw();
      btnStart.draw();
    }
  };

};
