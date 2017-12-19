var Sidebar = function(image) {

  var that = this;

  this.image = image;
  this.carX = 180;
  this.carY = 350;

  var editingSensor = true;

  var minPercentage = 0.08;

  this.editingAnimationPercentage = isEditing ? 1 : minPercentage;

  var btnReset = new Button(editContext, 60, 700, 'Reset car', GAME_FONT_BUTTON, resetCar);
  var btnStart = new Button(editContext, 200, 700, 'Start race!', GAME_FONT_BUTTON, startRace);

  var dialogBox = new Drawbox(editContext, Images.button_inactive, 200, 300);
  var btnSave = new Button(editContext, 200, 700, 'Save', GAME_FONT_BUTTON, saveSensor);
  var btnCancel = new Button(editContext, 100, 700, 'Cancel', GAME_FONT_BUTTON, cancelEditSensor);

  function resetCar() {
    car.reset();
    ghost.reset();
  }

  function startRace() {
    that.toggle();
    resetCar();
    track.startRace();
  }

  function saveSensor() {
    editingSensor = false;
  }

  function cancelEditSensor() {
    editingSensor = false;
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

    if (editingSensor) {
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
      // |    \     |
      // | Steering |
      // |   (Y)    |
      // | Length   |
      // | ------|- |
      // ------------

      dialogBox.draw(80, 390);
      drawText(editContext, 90, 410, '#fff', GAME_FONT, 'left', 'middle', 'Angle');
      drawText(editContext, 90, 520, '#fff', GAME_FONT, 'left', 'middle', 'Steering angle');
      drawText(editContext, 90, 630, '#fff', GAME_FONT, 'left', 'middle', 'Length');

      btnSave.draw();
      btnCancel.draw();
    }
    else {
      btnReset.draw();
      btnStart.draw();
    }
  };

};
