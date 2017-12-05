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
  drawContext.drawImage(gameCanvas, 0, 0, gameCanvas.width, gameCanvas.height, PADDING, PADDING, drawCanvas.width - (2 * PADDING), drawCanvas.height - (2 * PADDING));
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
