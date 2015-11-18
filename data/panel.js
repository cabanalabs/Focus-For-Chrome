var reloadPluginState = function() {
  chrome.storage.local.get(['pluginState', 'rawBlockList'], function(result) {
    siteList.value = result.rawBlockList;
    var pluginState = result.pluginState || 'ON';
    onOffToggle.checked = (pluginState === 'ON');
    onOffText.innerHTML = pluginState;
  });
  
};
window.addEventListener('load', function(evt) {
  reloadPluginState();
});

onOffToggle.onchange = function() {
  var pluginState = onOffToggle.checked ? 'ON' : 'OFF';
  chrome.storage.local.set({'pluginState': pluginState}, function() {
    onOffText.innerHTML = pluginState;
  });
};

saveButton.onclick = function() {
  chrome.storage.local.set({'rawBlockList' : siteList.value}, function() {
    self.close();
  });
};
  
undoButton.onclick = function() {
  chrome.storage.local.get(['rawBlockList'], function(result) {
    siteList.value = result.rawBlockList || 'nada senor';
  });
};
