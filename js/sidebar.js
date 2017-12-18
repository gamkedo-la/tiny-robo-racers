var Sidebar = function() {

  var that = this;

  var minPercentage = 0.08;

  this.editingAnimationPercentage = isEditing ? 1 : minPercentage;

  var btnReset = new Button(editContext, 60, 700, 'Reset car', GAME_FONT_BUTTON, resetCar);
  var btnStart = new Button(editContext, 200, 700, 'Start race!', GAME_FONT_BUTTON, startRace);

  function resetCar() {
    car.reset();
    ghost.reset();
  }

  function startRace() {
    that.toggle();
    resetCar();
    track.startRace();
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

    btnReset.update(delta);
    btnStart.update(delta);
  };

  this.draw = function() {
    if (!isEditing && !isEditToggling) {
      return;
    }

    editContext.clearRect(0, 0, editCanvas.width, editCanvas.height);

    drawImage(editContext, Images.carRedBig, 180, 350);

    btnReset.draw();
    btnStart.draw();
  };

};
