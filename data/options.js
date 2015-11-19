var element = function(id) {
  return document.getElementById(id);
}

var reloadPluginOptions = function() {
  chrome.storage.local.get([
    'officeHours', 'startTime', 'stopTime',
    'workDay[0]', 'workDay[1]', 'workDay[2]',
    'workDay[3]', 'workDay[4]', 'workDay[4]',
    'workDay[5]', 'workDay[6]'], function(result) {
    
    element('officeHours').checked = result.officeHours || false;
    element('startTime').value = result.startTime || '';
    element('stopTime').value = result.stopTime || '';
    
    element('workDay[0]').checked = result['workDay[0]'] || false;
    element('workDay[1]').checked = result['workDay[1]'] || false;
    element('workDay[2]').checked = result['workDay[2]'] || false;
    element('workDay[3]').checked = result['workDay[3]'] || false;
    element('workDay[4]').checked = result['workDay[4]'] || false;
    element('workDay[5]').checked = result['workDay[5]'] || false;
    element('workDay[6]').checked = result['workDay[6]'] || false;
  });
};

saveButton.onclick = function() {
  chrome.storage.local.set({
    'officeHours': element('officeHours').checked,
    'startTime'  : element('startTime').value,
    'stopTime'   : element('stopTime').value,
    'workDay[1]' : element('workDay[1]').checked,
    'workDay[2]' : element('workDay[2]').checked,
    'workDay[3]' : element('workDay[3]').checked,
    'workDay[4]' : element('workDay[4]').checked,
    'workDay[5]' : element('workDay[5]').checked,
    'workDay[6]' : element('workDay[6]').checked,
    'workDay[0]' : element('workDay[0]').checked
  }, function() {
    // Saved!
  });
};

undoButton.onclick = function() {
  reloadPluginOptions();
};

window.addEventListener('load', function(evt) {
  reloadPluginOptions();
});
