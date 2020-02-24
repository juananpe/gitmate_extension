var OSSinSE_Preferences = {
	pane: {},
	content: {},
	visiblePaneName: null,
	init: async function () {
            console.log("Init!");
	}

	};

document.getElementById("savemetrics").onclick = function(){
	console.log('clicked')
	// console.log(OSSinSE_Preferences.table);
	chrome.storage.local.set({"tabledata": OSSinSE_Preferences.table.getData()});
}

window.addEventListener("load", OSSinSE_Preferences.init, false);
