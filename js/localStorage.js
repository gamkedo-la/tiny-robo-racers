var LocalStorage = function(prefix, name) {

  var storageName = prefix + '--' + name;

  var settings = {};

  var _settings = JSON.parse(localStorage.getItem(storageName));
  if (_settings) {
    settings = _settings;
  }

  this.set = function(key, data) {
    settings[key] = data;

    if (localStorage && localStorage.setItem) {
      localStorage.setItem(storageName, JSON.stringify(settings));
    }

    return settings[key];
  };

  this.get = function(key, defaultData) {
    if (settings.hasOwnProperty(key)) {
      return settings[key];
    }

    return defaultData;
  };
};
