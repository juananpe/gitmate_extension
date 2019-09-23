var OSSinSE_Preferences = {
	pane: {},
	content: {},
	visiblePaneName: null,
	init: async function () {
            console.log("Init!");
		}

	};

document.getElementById("general-button-authorize").onclick = function(){ console.log('clicked') }

window.addEventListener("load", OSSinSE_Preferences.init, false);
