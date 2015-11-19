var offTime = new Date();
var rawBlocklist = '';
var blockList = '';
var pluginState = 'ON';

// Setup Office Hours
var officeHoursChecker = {
  'enable': function() {
    chrome.alarms.create("officeHoursChecker", 
                        {'delayInMinutes': 1.0, 
                         'periodInMinutes': 1.0});      
  },
  'disable': function() {
    chrome.alarms.clear("officeHoursChecker");
  }
};

// Make time pretty
var padZero = function(num) {
  var retval = ''+num;
  if (num < 10) {
    retval = "0"+num;
  }
  return retval;
}

chrome.alarms.onAlarm.addListener(function(alarm) {
  if (alarm.name === 'officeHoursChecker') {
    // The checker is on, we must be in office hours
    chrome.storage.local.get(['pluginState', 'officeHours', 'startTime', 
              'stopTime', 'workDay[0]', 'workDay[1]', 'workDay[2]', 'workDay[3]', 
              'workDay[4]', 'workDay[5]', 'workDay[6]'], function(result) {
      var rightNow = new Date();
      var currentTime = padZero(rightNow.getHours())+":"+padZero(rightNow.getMinutes());
      var startTime = result.startTime;
      var stopTime = result.stopTime;
      var today = rightNow.getDay();
      var startDay = today;
      var inOfficeHours = false;
      // if you are between start and end - then good
      // if you are greater than start and end; but start > end; then good
      // if you are less than start and end; but start > end; then good
      if (((currentTime > startTime) && (currentTime < stopTime)) ||  
         ((currentTime > startTime) && (currentTime > stopTime) && (startTime > stopTime)) || 
         ((currentTime < startTime) && (currentTime < stopTime) && (startTime > stopTime))) {
        startDay = ((today - 1) >= 0) ? (today - 1) : 6;
        inOfficeHours = true;
      }
      
      if ((result.officeHours === true) &&
         (result['workDay['+startDay+']'] === true) &&
         (inOfficeHours === true) &&
         ((rightNow.getTime() - offTime.getTime())/1000 > 420)) {
        chrome.storage.local.set({'pluginState': 'ON'}, function() {
          // Back to work! 
          // console.log('turning it back onnn');
        });
      }

    });
  }
});

// Reload state
var reloadState = function() {
  chrome.storage.local.get(['pluginState', 'rawBlockList', 'officeHours', 'startTime', 'stopTime'], function(result) {
    pluginState = result.pluginState || 'ON';
    rawBlockList = result.rawBlockList || '';
    blockList = rawBlockList.toLowerCase().replace(/^#.*\n$/g, "").split("\n");

    // Set icon to bike or cocktail
    var icon = (pluginState === 'ON') ? '/data/focus-32.png' : '/data/rest-32.png';
    chrome.browserAction.setIcon({path: icon});

    // Turn on office hours checker
    if (pluginState === 'OFF') {
      offTime = new Date();
      officeHoursChecker.enable();
    } else {
      officeHoursChecker.disable();
    }
  });
};

// If the blocklist is updated
chrome.storage.onChanged.addListener(function(changes, namespace) {
  reloadState();
});

// Detect request
var callback = function(details) {
  // Redirect to Cabana Labs 
  if ((pluginState === 'OFF') &&
     (details.type === 'main_frame')) {
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
