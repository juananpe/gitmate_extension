var GitMate_Preferences = {
	pane: {},
	content: {},
	visiblePaneName: null,
	init: async function () {
            console.log("Init!");
	}

	};

document.getElementById("savemetrics").onclick = function(){
	console.log('clicked')
	// console.log(GitMate_Preferences.table);
	chrome.storage.local.set({"tabledata": GitMate_Preferences.table.getData()});
}

window.addEventListener("load", GitMate_Preferences.init, false);
