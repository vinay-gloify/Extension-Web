/*global chrome*/
// background.js

chrome.runtime.onInstalled.addListener(() => {
    console.log("onInstalled...");
  });

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete') {
    chrome.tabs.executeScript(tabId, { file: 'App.js' });
  }
});
  
  