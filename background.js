/*var  tabledata = [
    {id:1, name:"popularity",                A:"v>=500", B:"v>=400", C:"v>=300",         D:"v>=200"},
    {id:2, name:"workForce",                A:"v>=10 ", B:"v>8",    C:"v>6",            D:"v>4"},
    {id:3, name:"recentActivity",           A:"v<=2",   B:"v<=7",   C:"v>7 and v<=14",    D:"v<= 21"},
    {id:4, name:"continuousActivity",       A:"v>40",   B:"v>30",   C:"v>20",           D:"v>10"},
    {id:5, name:"forkDegree",               A:"v>50",   B:"v>40",   C:"v>30",           D:"v>20"},
    {id:6, name:"beginnerFriendly",         A:"v>10",   B:"v>8",    C:"v>6",            D:"v>4"},
    {id:7, name:"docWiki", 				    A:"v>10",   B:"v>7",    C:"v>5",            D:"v>=3"},
    {id:7, name:"docWeb", 				    A:"v>0",    B:"v!=v",    C:"v!=v",            D:"v!=v"},
    {id:9, name:"contributionOpportunities",A:"v>200",  B:"v>100",  C:"v>75",           D:"v>50"},
    {id:10, name:"closingFactor",            A:"v>0.25",  B:"v>0.20",  C:"v>0.15",          D:"v>0.10"},
    {id:11, name:"pullRequests",            A:"v>200",  B:"v>100",  C:"v>50",           D:"v>25"},
];

chrome.storage.sync.set({"tabledata": tabledata});*/


var keys = ['A','B','C','D'];
var grading = [1, .75, .5, .25];



function getPR(url, tabId) {
    var loc = new URL(url);
    let found = loc.pathname.match(/\/(.*)\/(.*)/);
    if ( !found || found.length < 3 || loc.hostname != 'github.com') return;
   	// query = 'https://9fcb2903.ngrok.io/?q=' + url;
   	query = 'http://127.0.0.1:3000/?q=' + url;
    console.log(query);
    chrome.storage.sync.get("tabledata", tabledata => {
        fetch(query).then(response => response.json()).then(data => {

            var sum = 0;
            tabledata.forEach((c, idx) => {
                var found = false;
                for (var ind = 0; ind < keys.length && !found; ind++) {
                    var myfilter = compileExpression(c[keys[ind]]);
                    if (myfilter({v: data[c.name].raw})) {
                        sum += grading[ind];
                        console.log(c['name'] + " Grade: " + grading[ind]);
                        found = true;
                    }
                }
                if (!found) {
                    console.log(c['name'] + " Grade: 0");
                }
            });

            chrome.storage.sync.set({[url]: data}, function () {
                // console.log("Set value:" + url + ':' + value);
            });

            updatePR(sum.toString(), url, tabId);
        });

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
