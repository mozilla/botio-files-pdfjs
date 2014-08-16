// Mocks for testing the B2G PDF Viewer in the browser.
var asyncStorage = {
  getItem: function(key, callback) {
    callback(null);
  },
  setItem: function(key, value, callback) {
    if (callback) {
      callback(true);
    }
  }
};

window.navigator.mozSetMessageHandler = function(activity, callback) {
  var xhr = new XMLHttpRequest();
  xhr.open('GET', '/shared/tracemonkey.pdf');
  xhr.responseType = 'blob';
  xhr.onload = function () {
    callback({
      source: {
        data: {
          blob: xhr.response
        }
      }
    });
  };
  xhr.send(null);
};
