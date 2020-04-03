var GitMate_Preferences = {
	pane: {},
	content: {},
	visiblePaneName: null,
	init: async function () {
            console.log("Init!");
	}

	};

document.getElementById("savemetrics").onclick = function(){
	
	const data = GitMate_Preferences.table.getData();
	const sum = data.map(el => parseFloat(el.W)).reduce( (accumulator, currentValue) => accumulator + currentValue );

	if ( Math.abs(1 - sum) <=  Number.EPSILON ){
		Swal.fire(
			'Values saved!',
			'The new values will be applied immediately',
			'success'
		);
	} else {
		Swal.fire(
			'Values were saved with an error',
			'Weight values should sum up 1 <br> and now they sum ' + Math.round((sum + Number.EPSILON) * 100) / 100,
			'error'
		);
	}

	chrome.storage.local.set({"tabledata": GitMate_Preferences.table.getData()});
};

window.addEventListener("load", GitMate_Preferences.init, false);
