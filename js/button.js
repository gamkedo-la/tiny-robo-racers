var _buttonToggleGroups = {};

var _Button = function(canvasContext, x, y, image, toggleGroup, toggleState, callback) {

  var width = image.width;
  var height = image.height / 2;

  var isHover = false;
  var prevIsHover = false;
  var callbackFired = false;

  if (isString(toggleGroup) && toggleState) {
    _buttonToggleGroups[toggleGroup] = this;
  }

  this.setToggleState = function(_state) {
    toggleState = _state;
  };

  this.update = function(delta) {
    isHover = (x < mouse.x && mouse.x < x + width && y < mouse.y && mouse.y < y + height);
    if (prevIsHover !== isHover) {
      drawCanvas.style.cursor = isHover ? 'pointer' : 'default';
    }

    if (isHover && mouse.button === 0) {
      if (!callbackFired) {
        callbackFired = true;
        if (isString(toggleGroup)) {
          if (_buttonToggleGroups[toggleGroup] !== this) {
            _buttonToggleGroups[toggleGroup].setToggleState(false);
            _buttonToggleGroups[toggleGroup] = this;
            this.setToggleState(true);
          }
        }
        else if (toggleGroup) {
          toggleState = !toggleState;
        }

        Sound.play('button-click');

        callback();
      }
    }
    else {
      callbackFired = false;
    }

    prevIsHover = isHover;
  };

  this.draw = function() {
    var active = isHover || (toggleGroup && toggleState);
    canvasContext.drawImage(image, 0, active ? height : 0, width, height, x, y, width, height);
  };

};

var ButtonText = function(canvasContext, x, y, text, font, toggleGroup, toggleState, callback) {

  // Set font for measuring text width
  canvasContext.font = font;

  var boxWidth = 20 + canvasContext.measureText(text).width;
  var boxHeight = 20 + determineFontHeight(font);

  var buttonCanvas = document.createElement('canvas');
  buttonCanvas.width = boxWidth;
  buttonCanvas.height = boxHeight * 2;
  var buttonContext = buttonCanvas.getContext('2d');

  var centerX = Math.floor(boxWidth / 2);
  var centerY = Math.floor(boxHeight / 2);

  (new Drawbox(buttonContext, Images.button_inactive, boxWidth, boxHeight)).draw(0, 0);
  drawText(buttonContext, centerX, centerY, '#fff', font, 'center', 'middle', text);
  (new Drawbox(buttonContext, Images.button_active, boxWidth, boxHeight)).draw(0, boxHeight);
  drawText(buttonContext, centerX, centerY + boxHeight, '#fff', font, 'center', 'middle', text);

  _Button.call(this, canvasContext, x, y, buttonCanvas, toggleGroup, toggleState, callback);
};

ButtonText.prototype = Object.create(_Button.prototype);
ButtonText.prototype.constructor = ButtonText;

var ButtonImage = function(canvasContext, x, y, image, toggleGroup, toggleState, callback) {

  var buttonCanvas = document.createElement('canvas');
  buttonCanvas.width = image.width;
  buttonCanvas.height = image.height * 2;
  var buttonContext = buttonCanvas.getContext('2d');

  var centerX = Math.floor(image.width / 2);
  var centerY = Math.floor(image.height / 2);

  (new Drawbox(buttonContext, Images.button_inactive, image.width, image.height)).draw(0, 0);
  drawImage(buttonContext, image, centerX, centerY);
  (new Drawbox(buttonContext, Images.button_active, image.width, image.height)).draw(0, image.height);
  drawImage(buttonContext, image, centerX, centerY + image.height);

  _Button.call(this, canvasContext, x, y, buttonCanvas, toggleGroup, toggleState, callback);
};

ButtonImage.prototype = Object.create(_Button.prototype);
ButtonImage.prototype.constructor = ButtonImage;
