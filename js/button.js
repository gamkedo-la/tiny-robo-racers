var fontHeightCache = [];

var Button = function(canvasContext, x, y, text, font, callback) {

  canvasContext.font = font;
  var boxWidth = 20 + canvasContext.measureText(text).width;
  var boxHeight = 20 + determineFontHeight(font);

  var isHover = 0;
  var callbackFired = false;
  var normalColor = '#fff';
  var activeColor = '#fff';

  var buttonCanvas = document.createElement('canvas');
	buttonCanvas.width = boxWidth;
	buttonCanvas.height = boxHeight * 2;
	var buttonContext = buttonCanvas.getContext('2d');

  createButton(buttonContext, Images.button, boxWidth, boxHeight);

  this.update = function(delta) {
    isHover = (x < mouse.x && mouse.x < x + boxWidth && y < mouse.y && mouse.y < y + boxHeight);
    drawCanvas.style.cursor = isHover ? 'pointer' : 'default';

    if (isHover && mouse.button === 0) {
      if (!callbackFired) {
        callbackFired = true;
        callback();
      }
    }
    else {
      callbackFired = false;
    }
  };

  this.draw = function() {
    editContext.drawImage(buttonCanvas, 0, isHover ? boxHeight : 0, boxWidth, boxHeight, x, y, boxWidth, boxHeight);
  };

  function createButton(buttonContext, image, width, height) {
    var centerX = Math.floor(width / 2);
    var centerY = Math.floor(height / 2);

    var partWidth = image.width / 4;
    var partHeight = image.height / 8;

    var partHeightOffset = 0;
    var heightOffset = 0;
    var color = normalColor;

    for (var i = 0; i < 2; i++) {
      // Top left / right
      buttonContext.drawImage(image, 0, partHeightOffset, partWidth, partHeight, 0, heightOffset, partWidth, partHeight);
      buttonContext.drawImage(image, partWidth * 3, partHeightOffset, partWidth, partHeight, width - partWidth, heightOffset, partWidth, partHeight);
      // Bottom left / right
      buttonContext.drawImage(image, 0, partHeight * 3 + partHeightOffset, partWidth, partHeight, 0, height - partHeight + heightOffset, partWidth, partHeight);
      buttonContext.drawImage(image, partWidth * 3, partHeight * 3 + partHeightOffset, partWidth, partHeight, width - partWidth, height - partHeight + heightOffset, partWidth, partHeight);
      // Top / bottom
      buttonContext.drawImage(image, partWidth, partHeightOffset, partWidth, partHeight, partWidth, heightOffset, width - partWidth * 2, partHeight);
      buttonContext.drawImage(image, partWidth, partHeight * 3 + partHeightOffset, partWidth, partHeight, partWidth, height - partHeight + heightOffset, width - partWidth * 2, partHeight);
      // Left / right
      buttonContext.drawImage(image, 0, partHeight + partHeightOffset, partWidth, partHeight, 0, partHeight + heightOffset, partWidth, height - partHeight * 2);
      buttonContext.drawImage(image, partWidth * 3, partHeight + partHeightOffset, partWidth, partHeight, width - partWidth, partHeight + heightOffset, partWidth, height - partHeight * 2);

      // Center area
      var d = buttonContext.getImageData(partWidth - 1, partHeight - 1 + heightOffset, 1, 1).data;
      var centerColor = rgbToHex(d[0], d[1], d[2]);
      drawFillRect(buttonContext, partWidth, partHeight + heightOffset, width - partWidth * 2, height - partHeight * 2, centerColor);

      drawText(buttonContext, centerX, centerY + heightOffset, color, font, 'center', 'middle', text);

      color = activeColor;
      heightOffset += height;
      partHeightOffset += partHeight * 4;
    }
  }

  function determineFontHeight(font) {
    var result = fontHeightCache[font];

    if (!result) {
      var body = document.getElementsByTagName('body')[0];
      var dummy = document.createElement('div');

      var dummyText = document.createTextNode('(AbqMjgL');
      dummy.appendChild(dummyText);
      dummy.setAttribute('style', 'font:' + font + ';position:absolute;top:0;left:0;margin:0;padding:0');
      body.appendChild(dummy);
      result = dummy.offsetHeight;

      fontHeightCache[font] = result;
      body.removeChild(dummy);
    }

    return result;
  }

};
