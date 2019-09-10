function getPR(url, tabId) {
	query = 'https://86fae67a.ngrok.io/&q=info:' + url;
    fetch(query).then( response => response.json() ).then( myJson => {
            var value =  JSON.stringify(myJson) ; 
       
        chrome.storage.sync.set({[url]: value}, function() {
          // console.log("Set value:" + url + ':' + value);
        });

            updatePR( value , url, tabId) ;
    });
}

function showPR(url, tabId) {
	console.log('url:'+url+', tabId:'+tabId);
	if(url) {
		var domain = url.match(/^(http|https):\/\/([\w.]+)(:\d+)?/);
		if(domain != null) {
			getPR(url, tabId);
        }
    }
}

function updatePR(value, url, tabId) {
    // console.log("v:"+ value, "u:" + url, "t:" + tabId);
	chrome.browserAction.setBadgeText({text: value, 'tabId': tabId});
	chrome.browserAction.setBadgeBackgroundColor({color: value == '?' ? [190, 190, 190, 230] : [208, 0, 24, 255], 'tabId': tabId});
	chrome.browserAction.setTitle({title: value == '?' ? 'Page has no PR' : url + ' has PR ' + value, 'tabId': tabId});
	chrome.browserAction.setIcon({path: value == '?' ? 'img/0.png' : 'img/' + parseInt(value) + '.png', 'tabId': tabId});
}

chrome.tabs.onUpdated.addListener(function(tabId, changeInfo) {
    if (changeInfo.url) showPR(changeInfo.url, tabId);
    else {
        if(changeInfo["status"] != undefined && changeInfo["status"] != "loading"){
        chrome.tabs.get(tabId, function (tab) {
            let url = tab.url;
            // console.log(url);
            chrome.storage.sync.get(url, function(result) {
                // console.log("result:");
                // console.log(result);
                if (typeof result[url] !== 'undefined' && result[url] !== null) {
                    updatePR("" + result[url], url, tabId);
                }
            })
        }
        )
        }
    }
});



/*chrome.runtime.onInstalled.addListener(function() {
    chrome.storage.sync.set({color: '#3aa757'}, function() {
      console.log("The color is green.");
    });
  });
  */
