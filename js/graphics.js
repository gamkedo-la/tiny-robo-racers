function drawImage(canvasContext, image, x, y, angle) {
  canvasContext.save();
  canvasContext.translate(x, y);
  if (angle !== undefined) {
    canvasContext.rotate(angle);
  }
  canvasContext.drawImage(image, -image.width / 2, -image.height / 2);
  canvasContext.restore();
}

function drawFillRectRotated(canvasContext, topLeftX, topLeftY, boxWidth, boxHeight, fillColor, angle) {
  var hw = boxWidth / 2;
  var hh = boxHeight / 2;
  canvasContext.save();
  canvasContext.translate(topLeftX + hw, topLeftY + hh);
  canvasContext.rotate(angle);

  canvasContext.fillStyle = fillColor;
  canvasContext.fillRect(-hw, -hh, boxWidth, boxHeight);

  canvasContext.restore()
}

function drawFillRect(canvasContext, topLeftX, topLeftY, boxWidth, boxHeight, fillColor) {
  canvasContext.fillStyle = fillColor;
  canvasContext.fillRect(topLeftX, topLeftY, boxWidth, boxHeight);
}

function drawStrokeRect(canvasContext, topLeftX, topLeftY, boxWidth, boxHeight, strokeColor, lineWidth) {
  canvasContext.strokeStyle = strokeColor;
  if (lineWidth !== undefined) {
    var oldLineWidth = canvasContext.lineWidth;
    canvasContext.lineWidth = lineWidth;
  }
  canvasContext.strokeRect(topLeftX, topLeftY, boxWidth, boxHeight);
  if (lineWidth !== undefined) {
    canvasContext.lineWidth = oldLineWidth;
  }
}

function drawStrokeCircle(canvasContext, x, y, radius, percentage, strokeColor, lineWidth) {
  var startAngle = Math.PI * -0.5;
  var endAngle = Math.PI * 2 * percentage + startAngle;
  canvasContext.strokeStyle = strokeColor;
  canvasContext.lineWidth = lineWidth;
  canvasContext.beginPath();
  canvasContext.arc(x, y, radius, startAngle, endAngle, false);
  canvasContext.stroke();
}

function drawLines(canvasContext, color, lineWidth, points) {
  canvasContext.beginPath();
  canvasContext.moveTo(points[0].x, points[0].y);
  for (var i = 1; i < points.length; i++) {
    canvasContext.lineTo(points[i].x, points[i].y);
  }
  canvasContext.strokeStyle = color;
  canvasContext.lineWidth = lineWidth;
  canvasContext.stroke();
}

function drawText(canvasContext, x, y, color, font, align, baseline, text, alpha) {
  if (alpha !== undefined) {
    canvasContext.save();
    canvasContext.globalAlpha = alpha;
  }

  canvasContext.font = font;
  canvasContext.textBaseline = baseline;
  canvasContext.textAlign = align;
  canvasContext.fillStyle = color;
  canvasContext.fillText(text, x, y);

  if (alpha !== undefined) {
    canvasContext.restore();
  }
}

// takes an image and colors and fades it as required
// returns a new canvas we can use as a sprite
// reuses the same temp buffer over and over for performance reasons
var _tintImageCanvas = document.createElement('canvas');
var _tintImageCTX = _tintImageCanvas.getContext('2d');
function tintImage (image, color) {
  _tintImageCanvas.width = image.width;
  _tintImageCanvas.height = image.height;
  _tintImageCTX.fillStyle = color;
  _tintImageCTX.fillRect(0, 0, _tintImageCanvas.width, _tintImageCanvas.height);
  _tintImageCTX.globalCompositeOperation = 'destination-atop';
  _tintImageCTX.globalAlpha = 1;
  _tintImageCTX.drawImage(image, 0, 0);
  return _tintImageCanvas;
}

// creates a brand new sprite in a new color
function createTintedSprite (image, color) {
  var newCanvas = document.createElement('canvas');
  var newContext = newCanvas.getContext('2d');
  newCanvas.width = image.width;
  newCanvas.height = image.height;
  newContext.fillStyle = color;
  newContext.fillRect(0, 0, newCanvas.width, newCanvas.height);
  newContext.globalCompositeOperation = 'destination-atop';
  newContext.globalAlpha = 1;
  newContext.drawImage(image, 0, 0);
  return newCanvas;
}

// draw a rotated colored alpha faded sprite! (warning: costly, use sparingly)
function drawImageTinted(canvasContext, image, x, y, angle, color, opacity) {
  canvasContext.save();
  canvasContext.translate(x, y);
  if (angle !== undefined) {
    canvasContext.rotate(angle);
  }
  if (opacity != null) canvasContext.globalAlpha = opacity;
  canvasContext.drawImage(tintImage(image,color), -image.width / 2, -image.height / 2);
  canvasContext.restore();
}

function drawImageRotatedAlpha(canvasContext, image, x, y, angle, opacity) {
  canvasContext.save();
  canvasContext.translate(x, y);
  if (angle !== undefined) {
    canvasContext.rotate(angle);
  }
  if (opacity != null) canvasContext.globalAlpha = opacity;
  canvasContext.drawImage(image, -image.width / 2, -image.height / 2);
  canvasContext.restore();
}
