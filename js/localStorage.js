var LocalStorage = function(prefix, name) {

  var storageName = prefix + '--' + name;

  var settings = {};

  var _settings = JSON.parse(localStorage.getItem(storageName));
  if (_settings) {
    settings = _settings;
  }

  function saveSettings() {
    if (localStorage && localStorage.setItem) {
      localStorage.setItem(storageName, JSON.stringify(settings));
    }
  }

  this.set = function(key, data) {
    settings[key] = data;

    saveSettings();

    return settings[key];
  };

  this.get = function(key, defaultData) {
    if (settings.hasOwnProperty(key)) {
      return settings[key];
    }

    return defaultData;
  };

  this.del = function(key) {
    if (settings.hasOwnProperty(key)) {
      delete settings[key];
      saveSettings();
    }
  };

};
