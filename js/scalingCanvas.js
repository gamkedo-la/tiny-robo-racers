const PADDING = 30;
var drawCanvas, drawContext;
var drawScale, aspectRatio;

function initDrawingCanvas() {
  drawCanvas = document.getElementById('drawCanvas');
  drawContext = drawCanvas.getContext('2d');

  $(window).on('resize', resizeWindow);

  aspectRatio = gameCanvas.width / gameCanvas.height;

  setTimeout(resizeWindow, 1);
}

function scaleCoordinates(x, y) {
  return {
    x: x / drawScale,
    y: y / drawScale
  };
}

function redrawCanvas() {
  drawContext.clearRect(0, 0, drawCanvas.width, drawCanvas.height);

  if (isEditing || isEditToggling) {
    var sidebarPercentage = .3;

    if (isEditToggling) {
      sidebarPercentage *= sidebar.editingAnimationPercentage;
    }

    var sidebarWidth = drawCanvas.width * sidebarPercentage;
    var gameWidth = drawCanvas.width * (1 - sidebarPercentage);
    var gameHeight = drawCanvas.height * (1 - sidebarPercentage);
    var gamePaddingTop = drawCanvas.height * (sidebarPercentage / 2);

    drawContext.drawImage(editCanvas, 0, 0, editCanvas.width, editCanvas.height, PADDING, PADDING, sidebarWidth - PADDING, drawCanvas.height - (2 * PADDING));
    drawContext.drawImage(gameCanvas, 0, 0, gameCanvas.width, gameCanvas.height, sidebarWidth, PADDING + gamePaddingTop, gameWidth - PADDING, gameHeight - (2 * PADDING));
  }
  else {
    drawContext.drawImage(gameCanvas, 0, 0, gameCanvas.width, gameCanvas.height, PADDING, PADDING, drawCanvas.width - (2 * PADDING), drawCanvas.height - (2 * PADDING));
  }
}

function resizeWindow() {
  var maxHeight = window.innerHeight - 2;
  var maxWidth = window.innerWidth - 2;

  if (maxWidth / maxHeight < aspectRatio) {
    drawCanvas.width = maxWidth;
    drawCanvas.height = Math.floor(maxWidth / aspectRatio);
  }
  else {
    drawCanvas.height = maxHeight;
    drawCanvas.width = Math.floor(maxHeight * aspectRatio);
  }

  drawScale = drawCanvas.width / gameCanvas.width;
}
