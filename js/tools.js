const DEC2RAD = (Math.PI / 180);
const ANGLE360 = Math.PI * 2;

if (!Object.keys) {
  Object.keys = function(obj) {
    var arr = [],
      key;
    for (key in obj) {
      if (obj.hasOwnProperty(key)) {
        arr.push(key);
      }
    }
    return arr;
  };
}

String.prototype.ucFirst = function() {
  return this.charAt(0).toUpperCase() + this.slice(1);
};

function isString(obj) {
  return (Object.prototype.toString.call(obj) === '[object String]');
}

if (!console) {
  var console = {};
}
if (!console.log) {
  console.log = function() {};
}

function clone(item) {
  return JSON.parse(JSON.stringify(item));
}

function random(min, max, isFloat) {
  if (isFloat) {
    return Math.min(min + (Math.random() * (max - min + parseFloat('1e-' + ((Math.random() + '').length - 1)))), max);
  }

  return min + Math.floor(Math.random() * (max - min + 1));
}

function componentToHex(c) {
  var hex = c.toString(16);
  return hex.length === 1 ? "0" + hex : hex;
}

function rgbToHex(r, g, b) {
  return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
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

// Grid functions
function coordsAreDriveable(grid, x, y) {
  var col = Math.floor(x / TRACK_WIDTH);
  var row = Math.floor((y - TRACK_PADDING_TOP) / TRACK_HEIGHT);
  var tileHere = getTileTypeAtColRow(grid, col, row);

  return (tileHere === TRACK_ROAD);
}

function rowColToArrayIndex(col, row) {
  return col + TRACK_COLS * row;
}

function coordsToArrayIndex(x, y) {
  var rowCol = coordsToRowCol(x, y);

  return rowCol.col + TRACK_COLS * rowCol.row;
}

function getTileTypeAtColRow(grid, col, row) {
  if (col >= 0 && col < TRACK_COLS && row >= 0 && row < TRACK_ROWS) {
    var trackIndex = rowColToArrayIndex(col, row);

    return grid[trackIndex];
  }

  return TRACK_WALL;
}

function rowColToCoords(col, row) {
  return {
    x: col * TRACK_WIDTH + TRACK_WIDTH / 2,
    y: row * TRACK_HEIGHT + TRACK_PADDING_TOP + TRACK_HEIGHT / 2
  };
}

function coordsToRowCol(x, y) {
  return {
    col: Math.floor(x / TRACK_WIDTH),
    row: Math.floor((y - TRACK_PADDING_TOP) / TRACK_HEIGHT)
  };
}
