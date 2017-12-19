// Requires a square image with a width dividable by 3!
var Drawbox = function(canvasContext, image, width, height) {

  var boxCanvas = createBoxCanvas();

  this.draw = function(x, y) {
    canvasContext.drawImage(boxCanvas, x, y);
  };

  function createBoxCanvas() {
    var boxCanvas = document.createElement('canvas');
    boxCanvas.width = width;
    boxCanvas.height = height;
    var boxContext = boxCanvas.getContext('2d');

    var partWidth = image.width / 3;
    var partHeight = image.height / 3;

    // Top left / right
    boxContext.drawImage(image, 0, 0, partWidth, partHeight, 0, 0, partWidth, partHeight);
    boxContext.drawImage(image, partWidth * 2, 0, partWidth, partHeight, width - partWidth, 0, partWidth, partHeight);
    // Bottom left / right
    boxContext.drawImage(image, 0, partHeight * 2, partWidth, partHeight, 0, height - partHeight, partWidth, partHeight);
    boxContext.drawImage(image, partWidth * 2, partHeight * 2, partWidth, partHeight, width - partWidth, height - partHeight , partWidth, partHeight);
    // Top / bottom
    boxContext.drawImage(image, partWidth, 0, partWidth, partHeight, partWidth, 0, width - partWidth * 2, partHeight);
    boxContext.drawImage(image, partWidth, partHeight * 2, partWidth, partHeight, partWidth, height - partHeight , width - partWidth * 2, partHeight);
    // Left / right
    boxContext.drawImage(image, 0, partHeight, partWidth, partHeight, 0, partHeight , partWidth, height - partHeight * 2);
    boxContext.drawImage(image, partWidth * 2, partHeight, partWidth, partHeight, width - partWidth, partHeight , partWidth, height - partHeight * 2);

    // Center area
    var d = boxContext.getImageData(partWidth - 1, partHeight - 1, 1, 1).data;
    var centerColor = rgbToHex(d[0], d[1], d[2]);
    drawFillRect(boxContext, partWidth, partHeight, width - partWidth * 2, height - partHeight * 2, centerColor);

    return boxCanvas;
  }

};
