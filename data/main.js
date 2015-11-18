var rawBlocklist = '';
var blockList = '';
var pluginState = 'ON';

var reloadState = function() {
  chrome.storage.local.get(['pluginState', 'rawBlockList'], function(result) {
    pluginState = result.pluginState || 'ON';
    rawBlockList = result.rawBlockList || '';
    blockList = rawBlockList.toLowerCase().replace(/^#.*\n$/g, "").split("\n");
    var icon = (pluginState === 'ON') ? '/data/focus-32.png' : '/data/rest-32.png';
    chrome.browserAction.setIcon({path: icon});
  });
};

// If the blocklist is updated
chrome.storage.onChanged.addListener(function(changes, namespace) {
  reloadState();
});

// Detect request
var callback = function(details) {
  // Redirect to Cabana Labs 
  if (details.type === 'main_frame') {
    var requestURL = details.url.toLowerCase();
    for (var counter=0; counter < blockList.length; counter++) {
      var listItem = blockList[counter].trim();
      if (listItem != '' && requestURL.indexOf(listItem) > -1) {
        return {redirectUrl: 'http://focus.cabanalabs.com/'}; 
      }
    }
  }
};

// Start here
window.addEventListener('load', function(evt) {
  reloadState();
  var filter = {"urls":  ["*://*/*"] };
  var opt_extraInfoSpec = ["blocking"];
  chrome.webRequest.onBeforeRequest.addListener(
          callback, filter, opt_extraInfoSpec);
});

// Todo:
// Allow setting office hours
