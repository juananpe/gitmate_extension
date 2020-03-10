import {createTable} from "./related.js";

let storedURLs = [];
let chart = null;
const backgroundColors = ['rgba(255, 99, 132, 0.2)', 'rgba(54, 162, 235, 0.2)', 'rgba(255, 206, 86, 0.2)', 'rgba(75, 192, 192, 0.2)'];
const borderColors = ['rgb(255, 99, 132)', 'rgb(54, 162, 235)', 'rgba(255, 206, 86, 1)', 'rgba(75, 192, 192, 1)'];
const pointBackgroundColors = ['rgb(255, 99, 132)', 'rgb(54, 162, 235)', 'rgba(255, 206, 86)', 'rgba(75, 192, 192)'];
const pointHoverBorderColors = ['rgb(255, 99, 132)', 'rgb(54, 162, 235)', 'rgba(255, 206, 86)', 'rgba(75, 192, 192)'];
const fill = false;
let sitesNum = 0;

function setupChart(gitmateData) {

    const labels = Object.keys(gitmateData).filter(e => e !== 'suitability' && e !== 'project');
    const values = Object.values(gitmateData).filter(elem => !isNaN(elem.value)).map(e => e.value * 100);
    const project = gitmateData.project;

    // Disable automatic style injection
    Chart.platform.disableCSSInjection = true;

    const idx = 0;

    chart = new Chart(
        document.getElementById("chartjs-3"),
        {
            "type": "radar",
            "data":
                {
                    "labels": labels,
                    "datasets": [{
                        "label": project,
                        "data": values,
                        "fill": fill,
                        "backgroundColor": backgroundColors[idx],
                        "borderColor": borderColors[idx],
                        "pointBackgroundColor": pointBackgroundColors[idx],
                        "pointBorderColor": "#fff",
                        "pointHoverBackgroundColor": "#fff",
                        "pointHoverBorderColor": pointHoverBorderColors[idx]
                    }]
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


function addToChart(data) {
    data.forEach((gitmateData, idx) => {

        idx += 1;
        const datasets = chart.data.datasets;
        const values = Object.values(gitmateData).filter(elem => !isNaN(elem.value)).map(e => e.value * 100);
        const project = gitmateData.project;
        const newdata = {
            "label": project,
            "data": values,
            "fill": fill,
            "backgroundColor": backgroundColors[idx],
            "borderColor": borderColors[idx],
            "pointBackgroundColor": pointBackgroundColors[idx],
            "pointBorderColor": "#fff",
            "pointHoverBackgroundColor": "#fff",
            "pointHoverBorderColor": pointHoverBorderColors[idx]
        };
        datasets.push(
            newdata
        );
        chart.update();
    });
}


function showRelated(reference) {
    // http://www.yasiv.com/github/#/costars?q=edx%2Fedx-platform
    const url = reference.getAttribute('url');

    let slices, owner, name;
    slices = url.split("/");
    owner = slices[3];
    name = slices[4];

    const project =  `${owner}/${name}`;
    return createTable(project);

}

function setupButtons() {
    tippy('[data-tippy-content]', {
        trigger: 'manual',
        hideOnClick: false,
        animateFill: false,
        arrow: false,
        animation: 'shift-away',
    });


    tippy('.related', {
        content: 'showRelated',
        allowHTML: true,
        trigger: 'manual',
        hideOnClick: true,
        animateFill: false,
        arrow: false,
        interactive: true,
    });

    [0, 1, 2, 3].forEach(sitenum => {
        const add = document.getElementById(`add${sitenum}`);
        if (add != undefined) {
            add.onclick = function () {
                add._tippy.show();
                setTimeout(function () {
                    add._tippy.hide();
                }, 1000);

                let url = add.getAttribute("url");
                console.log("On add: " + url);
                storedURLs.push(url);

                chrome.storage.local.set({"storedurls": storedURLs});
            };
        }

        const remove = document.getElementById(`remove${sitenum}`);
        if (remove != undefined) {
            remove.onclick = function (e) {

                remove._tippy.show();
                setTimeout(function () {
                    remove._tippy.hide();
                    e.target.parentElement.style.display = "none"
                }, 1000);

                let url = remove.getAttribute("url");
                console.log("On remove: " + url);
                storedURLs = storedURLs.filter(e => e !== url);
                chrome.storage.local.set({"storedurls": storedURLs});

            };
        }
        const related = document.getElementById(`related${sitenum}`);
        if (related != undefined) {
            related.onclick = function (e) {
                showRelated(related).then( table => {
                    console.log(table);
                });
                // related._tippy.show();
                // setTimeout(function () {
                //     related._tippy.hide();
                // }, 1000);

            }
        }


    });
}

function addStored() {
    chrome.storage.local.get("storedurls", function (jsonURLs) {
        storedURLs = jsonURLs.storedurls;

        storedURLs.forEach(url => {
            addSite(url);
        });

        setupButtons();

        Promise.all(storedURLs.map(u => {
            return getGitMateData(u)
        })).then(values => {
                addToChart(values);
            }
        );

    });
}

const getGitMateData = (url) => {

    function days_since(cachedDate) {

        const today = new Date();

        // The number of milliseconds in one day
        const ONE_DAY = 1000 * 60 * 60 * 24;

        // Calculate the difference in milliseconds
        const differenceMs = Math.abs(today - cachedDate);

        // Convert back to days and return
        return Math.round(differenceMs / ONE_DAY);

    }

    return new Promise((resolve, reject) => {

        const query = 'http://167.71.248.67:3000/?q=' + url;

        chrome.storage.local.get(url, function (jsonData) {
            // use cached data it is less than 7 days old
            if (Object.keys(jsonData).length === 0 || days_since(jsonData[url].cached) >= 7 ){
                fetch(query).then(response => response.json()).then(data => {
                    chrome.storage.local.set({[url]: data}, function () {
                        // after obtaining storage data, index it using the current url
                        jsonData[url].project = url.replace("https://github.com/", "");
                        jsonData[url].cached = new Date().getTime();
                        resolve(jsonData[url]);
                    });
                }).catch(error => console.log(error.message));
            } else {
                jsonData[url].project = url.replace("https://github.com/", "");
                resolve(jsonData[url]);
            }
        });

    })
};


const getCurrentTab = (...args) => {
    return new Promise((resolve, reject) => {
        chrome.tabs.query({
            active: true,
            lastFocusedWindow: true
        }, function (tabs) {
            const url = tabs[0].url;
            const loc = new URL(url);
            let found = loc.pathname.match(/\/(.*)\/(.*)/);
            if (!found || found.length < 3 || loc.hostname != 'github.com') return reject("No github url");

            let foo, owner, name;
            [foo, owner, name] = loc.pathname.split("/");
            resolve([url, owner, name]);

        });
    })
};

function parseHTML(html) {
    const t = document.createElement('template');
    t.innerHTML = html;
    return t.content.cloneNode(true);
}

function addSite(url) {
    const sites = document.getElementById('sites');
    const site = `<div class"site" style="display: inline-block; margin: 4px">
        ${url}<br>
        
        <svg data-tippy-content="Added!" fill="none" height="24" id="add${sitesNum}" url="${url}" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 9V12M12 12V15M12 12H15M12 12H9M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z"
    stroke="#4A5568" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        
        <svg data-tippy-content="Removed!" fill="none" height="24" id="remove${sitesNum}" url="${url}" viewBox="0 0 24 24" width="24"
    xmlns="http://www.w3.org/2000/svg">
         <path d="M15 12H9M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z"
    stroke="#4A5568" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        
        <svg class="related" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg" id="related${sitesNum}" url="${url}">
         <path d="M3.9 12c0-1.71 1.39-3.1 3.1-3.1h4V7H7c-2.76 0-5 2.24-5 5s2.24 5 5 5h4v-1.9H7c-1.71 0-3.1-1.39-3.1-3.1zM8 13h8v-2H8v2zm9-6h-4v1.9h4c1.71 0 3.1 1.39 3.1 3.1s-1.39 3.1-3.1 3.1h-4V17h4c2.76 0 5-2.24 5-5s-2.24-5-5-5z"/>
        </svg>
        
        </div>`;
    sitesNum++;
    sites.appendChild(parseHTML(site));
}


document.addEventListener('DOMContentLoaded', function () {

    getCurrentTab().then(urldata => {

        const url = urldata[0];
        const link = document.getElementById('old');

        addSite(url);
        link.href = `minisite_old.html?url=${urldata[0]}&owner=${urldata[1]}/${urldata[2]}`;

        getGitMateData(url).then(gitmateData => {
                setupChart(gitmateData);
                addStored();
            }
        );

    }).catch(err => {
        console.log(err);
    });
});
