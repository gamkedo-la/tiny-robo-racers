const DEC2RAD = (Math.PI / 180);

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
