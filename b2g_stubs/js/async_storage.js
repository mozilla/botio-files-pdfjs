// Mocks for testing the B2G PDF Viewer in the browser.
var asyncStorage = {
  getItem: function(key, callback) {
    callback(null);
  },
  setItem: function(key, value) {}
};

window.navigator.mozSetMessageHandler = function(activity, callback) {
  setTimeout(function() {
    callback({
      source: {
        data: {
          url: '/shared/tracemonkey.pdf'
        }
      }
    });
  })
};
