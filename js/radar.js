let storedURLs = [];

function showChart(data, project) {

    const labels = Object.keys(data[0]).filter(e => e !== 'suitability' && e !== 'project');

    console.log("Labels " + labels);

    let datasets = [];

    const backgroundColors = ['rgba(255, 99, 132, 0.2)', 'rgba(54, 162, 235, 0.2)', 'rgba(255, 206, 86, 0.2)', 'rgba(75, 192, 192, 0.2)'];
    const borderColors = ['rgb(255, 99, 132)', 'rgb(54, 162, 235)', 'rgba(255, 206, 86, 1)', 'rgba(75, 192, 192, 1)'];
    const pointBackgroundColors = ['rgb(255, 99, 132)', 'rgb(54, 162, 235)', 'rgba(255, 206, 86)', 'rgba(75, 192, 192)'];
    const pointHoverBorderColors = ['rgb(255, 99, 132)', 'rgb(54, 162, 235)', 'rgba(255, 206, 86)', 'rgba(75, 192, 192)'];


    data.forEach((dataset, idx) => {
        const values = Object.values(dataset).filter(elem => !isNaN(elem.value)).map(e => e.value * 100);
        const project = dataset.project;
        datasets.push(
            {
                "label": project,
                "data": values,
                "fill": true,
                "backgroundColor": backgroundColors[idx],
                "borderColor": borderColors[idx],
                "pointBackgroundColor": pointBackgroundColors[idx],
                "pointBorderColor": "#fff",
                "pointHoverBackgroundColor": "#fff",
                "pointHoverBorderColor": pointHoverBorderColors[idx]
            }
        );
    });

    console.log("Datasets " + JSON.stringify(datasets));


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
                    datasets
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

        const add = document.getElementById('add');
        add.onclick = function () {
            add._tippy.show();
            setTimeout(function() {
                add._tippy.hide();
            }, 1000);


            chrome.storage.local.set({"storedurls": storedURLs});
        };

        tippy('#add', {
            content: 'Added!',
            trigger: 'manual',
            hideOnClick: false,
            animateFill: false,
            arrow: false,
            animation: 'shift-away',
        });

        tippy('#remove', {
            content: 'Removed!',
            trigger: 'manual',
            hideOnClick: false,
            animateFill: false,
            arrow: false,
            animation: 'shift-away',
        });


        const remove = document.getElementById('remove');
        remove.onclick = function () {
            remove._tippy.show();
            setTimeout(function() {
                remove._tippy.hide();
            }, 1000);

            storedURLs = storedURLs.filter(e => e !== url);
            chrome.storage.local.set({"storedurls": storedURLs});
            console.log(storedURLs);
        };

        chrome.storage.local.get("storedurls", function (jsonURLs) {
            storedURLs = jsonURLs.storedurls;
            storedURLs.push(url);

            Promise.all(storedURLs.map(u => {
                return getGitMateData(u)
            })).then(values => {
                    console.log(values);
                    showChart(values, `${owner}/${name}`);

                }
            );

        });
    });
});



