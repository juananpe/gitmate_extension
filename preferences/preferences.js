var OSSinSE_Preferences = {
	pane: {},
	content: {},
	visiblePaneName: null,
	init: async function () {
            console.log("Init!");
	}

	};

document.getElementById("editmetrics").onclick = function(){
	console.log('clicked')
	// console.log(OSSinSE_Preferences.table);
	chrome.storage.sync.set({"tabledata": OSSinSE_Preferences.table.getData()});
}

window.addEventListener("load", OSSinSE_Preferences.init, false);
