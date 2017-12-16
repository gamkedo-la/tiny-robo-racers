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

function drawText(canvasContext, x, y, color, font, align, baseline, text) {
  canvasContext.font = font;
  canvasContext.textBaseline = baseline;
  canvasContext.textAlign = align;
  canvasContext.fillStyle = color;
  canvasContext.fillText(text, x, y);
}
