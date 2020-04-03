var GitMate_Preferences = {
	pane: {},
	content: {},
	visiblePaneName: null,
	init: async function () {
            console.log("Init!");
	}

	};

document.getElementById("savemetrics").onclick = function(){
	Swal.fire(
		'Values saved!',
		'The new values will be applied immediately',
		'success'
	);
	chrome.storage.local.set({"tabledata": GitMate_Preferences.table.getData()});
};

window.addEventListener("load", GitMate_Preferences.init, false);
