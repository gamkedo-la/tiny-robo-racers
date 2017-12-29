var fontHeightCache = [];

var ButtonText = function(canvasContext, x, y, text, font, callback) {

  canvasContext.font = font;

  var boxWidth = 20 + canvasContext.measureText(text).width;
  var boxHeight = 20 + determineFontHeight(font);

  var normalColor = '#fff';
  var activeColor = '#fff';

  var buttonCanvas = createButtonCanvas(Images.button_active, Images.button_inactive, boxWidth, boxHeight);

  var button = new _Button(canvasContext, x, y, buttonCanvas, callback);

  this.update = function(delta) {
    button.update(delta);
  };

  this.draw = function() {
    button.draw();
  };

  function createButtonCanvas(imageActive, imageInactive, boxWidth, boxHeight) {
    var buttonCanvas = document.createElement('canvas');
    buttonCanvas.width = boxWidth;
    buttonCanvas.height = boxHeight * 2;
    var buttonContext = buttonCanvas.getContext('2d');

    var centerX = Math.floor(boxWidth / 2);
    var centerY = Math.floor(boxHeight / 2);

    (new Drawbox(buttonContext, imageInactive, boxWidth, boxHeight)).draw(0, 0);
    drawText(buttonContext, centerX, centerY, normalColor, font, 'center', 'middle', text);
    (new Drawbox(buttonContext, imageActive, boxWidth, boxHeight)).draw(0, boxHeight);
    drawText(buttonContext, centerX, centerY + boxHeight, activeColor, font, 'center', 'middle', text);

    return buttonCanvas;
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

var ButtonImage = function(canvasContext, x, y, image, callback) {

  var buttonCanvas = createButtonCanvas(Images.button_active, Images.button_inactive);

  var button = new _Button(canvasContext, x, y, buttonCanvas, callback);

  this.update = function(delta) {
    button.update(delta);
  };

  this.draw = function() {
    button.draw();
  };

  function createButtonCanvas(imageActive, imageInactive, width, height) {
    var buttonCanvas = document.createElement('canvas');
    buttonCanvas.width = image.width;
    buttonCanvas.height = image.height * 2;
    var buttonContext = buttonCanvas.getContext('2d');

    var centerX = Math.floor(image.width / 2);
    var centerY = Math.floor(image.height / 2);

    (new Drawbox(buttonContext, imageInactive, image.width, image.height)).draw(0, 0);
    drawImage(buttonContext, image, centerX, centerY);
    (new Drawbox(buttonContext, imageActive, image.width, image.height)).draw(0, image.height);
    drawImage(buttonContext, image, centerX, centerY + image.height);

    return buttonCanvas;
  }

};

var _Button = function(canvasContext, x, y, image, callback) {

  var width = image.width;
  var height = image.height / 2;

  var isHover = 0;
  var callbackFired = false;

  this.update = function(delta) {
    isHover = (x < mouse.x && mouse.x < x + width && y < mouse.y && mouse.y < y + height);
    // @todo fix cursor: only works for "last button"
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
    canvasContext.drawImage(image, 0, isHover ? height : 0, width, height, x, y, width, height);
  };

};
