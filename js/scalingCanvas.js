const PADDING = 60;
var drawCanvas, drawContext;
var drawScaleX, drawScaleY, aspectRatio;

function initDrawingCanvas() {
  drawCanvas = document.getElementById('drawCanvas');
  drawContext = drawCanvas.getContext('2d');

  $(window).on('resize', resizeWindow);

  aspectRatio = gameCanvas.width / gameCanvas.height;

  setTimeout(resizeWindow, 1);
}

function scaleCoordinates(x, y) {
  return {
    x: x / drawScaleX,
    y: y / drawScaleY
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

    drawContext.drawImage(editCanvas, 0, 0, editCanvas.width, editCanvas.height, 0, 0, sidebarWidth, drawCanvas.height);
    drawContext.drawImage(gameCanvas, 0, 0, gameCanvas.width, gameCanvas.height, sidebarWidth, gamePaddingTop, gameWidth, gameHeight);
  }
  else {
    drawContext.drawImage(gameCanvas, 0, 0, gameCanvas.width, gameCanvas.height, 0, 0, drawCanvas.width, drawCanvas.height);
  }


  drawStrokeRect(drawContext, mouse.x-3, mouse.y-3, 6, 6, '#f00', 2);
  drawStrokeRect(drawContext, 0, 0, drawCanvas.width, drawCanvas.height, '#f00', 2);
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

  drawCanvas.width -= PADDING;
  drawCanvas.height -= PADDING;

  drawScaleX = drawCanvas.width / gameCanvas.width;
  drawScaleY = drawCanvas.height / gameCanvas.height;
}
