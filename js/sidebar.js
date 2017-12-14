var Sidebar = function() {

  var minPercentage = 0.2;

  this.editingAnimationPercentage = isEditing ? 1 : minPercentage;

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
      .easing(TWEEN.Easing.Linear.None)
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
  };

  this.draw = function() {
    if (!isEditing && !isEditToggling) {
      return;
    }

    editContext.clearRect(0, 0, editCanvas.width, editCanvas.height);

    drawLines(editContext, '#fff', 2, [
      {x: 0, y: 0},
      {x: editCanvas.width, y: 0},
      {x: 0, y: editCanvas.height},
      {x: editCanvas.width, y: editCanvas.height},
      {x: 0, y: 0},
      {x: 0, y: editCanvas.height},
      {x: editCanvas.width, y: editCanvas.height},
      {x: editCanvas.width, y: 0}
    ]);
  };

};
