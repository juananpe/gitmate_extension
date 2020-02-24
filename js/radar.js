function showChart(data, project) {

    const labels = Object.keys(data).filter(e => e !== 'suitability');
    const values = Object.values(data).filter(elem => !isNaN(elem.value)).map(e => e.value*100);

    console.log(values);


// Disable automatic style injection
    Chart.platform.disableCSSInjection = true;

    new Chart(
        document.getElementById("chartjs-3"),
        {
            "type": "radar",
            "data":
                {
                    "labels":
                    labels,
                    "datasets":
                        [
                            {
                                "label": project,
                                "data": values,
                                "fill": true,
                                "backgroundColor": "rgba(255, 99, 132, 0.2)",
                                "borderColor": "rgb(255, 99, 132)",
                                "pointBackgroundColor": "rgb(255, 99, 132)",
                                "pointBorderColor": "#fff",
                                "pointHoverBackgroundColor": "#fff",
                                "pointHoverBorderColor": "rgb(255, 99, 132)"
                            },

                        ]
                },
            "options":
                {
                    "elements":
                        {
                            "line":
                                {"tension": 0, "borderWidth": 3}
                        },
                    scale: {
                        "ticks": {
                            "min": 0,
                            "max": 100
                        }
                    }
                }
        });


}


document.addEventListener('DOMContentLoaded', function () {

    getCurrentTab().then(urldata => {

        const url = urldata[0];
        const owner = urldata[1];
        const name = urldata[2];

        chrome.storage.local.get("storedurls", function (jsonURLs) {
            storedURLs = jsonURLs.storedurls;
            storedURLs.push(url);


            Promise.all ( storedURLs.map( u => {return getGitMateData(u) }) ).then( values => {


                // TODO: meter getMitateData dentro de este Promise.all
                console.log(values);

                }
            );


            getGitMateData(url).then( data => {
                showChart(data, `${owner}/${name}`);
            });



        });


        const save = document.getElementById('save');
        save.onclick = function() {
            chrome.storage.local.set({"storedurls": storedURLs });
        };



        // chrome.storage.local.get(url, function (jsonData) {
        //
        //     // after obtaining storage data, index it using the current url
        //     let data = jsonData[url];
        //
        //     showChart(data, `${owner}/${name}`);
        //
        // });

    });
});



