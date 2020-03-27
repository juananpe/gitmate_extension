import {createTable} from "./related.js";
import {addSite} from "./sites.js";

let storedURLs = [];

let chart = null;
const backgroundColors = ['rgba(255, 99, 132, 0.2)', 'rgba(54, 162, 235, 0.2)', 'rgba(255, 206, 86, 0.2)', 'rgba(75, 192, 192, 0.2)'];
const borderColors = ['rgb(255, 99, 132)', 'rgb(54, 162, 235)', 'rgba(255, 206, 86, 1)', 'rgba(75, 192, 192, 1)'];
const pointBackgroundColors = ['rgb(255, 99, 132)', 'rgb(54, 162, 235)', 'rgba(255, 206, 86)', 'rgba(75, 192, 192)'];
const pointHoverBorderColors = ['rgb(255, 99, 132)', 'rgb(54, 162, 235)', 'rgba(255, 206, 86)', 'rgba(75, 192, 192)'];
const fill = false;
let sitesNum = 0;

const svglock = "M12 15V17M6 21H18C19.1046 21 20 20.1046 20 19V13C20 11.8954 19.1046 11 18 11H6C4.89543 11 4 11.8954 4 13V19C4 20.1046 4.89543 21 6 21ZM16 11V7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7V11H16Z";
const svgunlock = "M8 11V7C8 4.79086 9.79086 3 12 3C14.2091 3 16 4.79086 16 7M12 15V17M6 21H18C19.1046 21 20 20.1046 20 19V13C20 11.8954 19.1046 11 18 11H6C4.89543 11 4 11.8954 4 13V19C4 20.1046 4.89543 21 6 21Z";

const svgadd = "M12 9V12M12 12V15M12 12H15M12 12H9M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z"
const svgremove = "M15 12H9M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z"

function tolikert(value, index){
    if (index%2===0)
        return "";
    if (value >= 90){
        return "Excellent";
    } else if (value >=70){
        return "Good";
    } else if (value >=50){
        return "Fair";
    } else if (value >=30){
        return "Poor";
    } else {
        return "Very Poor";
    }
}

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
                    tooltips: {
                        enabled: true,
                        callbacks: {
                            label: function(tooltipItem, data) {
                                return data.datasets[tooltipItem.datasetIndex].label + ":" + data.labels[tooltipItem.index] + ' : ' + data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index];
                            }
                        }
                    },
                    "elements":
                        {
                            "line":
                                {"tension": 0, "borderWidth": 3}
                        },
                    "scale": {
                        "ticks": {
                            "min": 0,
                            "max": 100,
                            // Include a dollar sign in the ticks
                            callback: function(value, index, values) {
                                return tolikert(value, index);
                            }
                        },
                    },
                    "legend":
                        {
                            "display": false,
                        }
                }
        });

}


function addToChart(data) {
    const datasets = chart.data.datasets;
    const labels = datasets.map( dataset => dataset.label);

    let idx = 1;

    data.forEach(gitmateData => {

        const project = gitmateData.project;
        if (labels.includes(project)){
            return;
        }

        const values = Object.values(gitmateData).filter(elem => !isNaN(elem.value)).map(e => e.value * 100);


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

        idx++;
    });
}


function showRelated(reference) {
    // http://www.yasiv.com/github/#/costars?q=edx%2Fedx-platform
    const url = reference.getAttribute('url');

    let slices, owner, name;
    slices = url.split("/");
    owner = slices[3];
    name = slices[4];

    const project = `${owner}/${name}`;
    return createTable(project);

}


function setRemove(url, addremove) {
    if (!storedURLs.includes(url)) {
        storedURLs.push(url);
    }
    addremove._tippy.setContent("Added!");
    addremove.firstElementChild.setAttribute('d', svgremove);
    addremove.setAttribute('action', 'remove');
}

function setAdd(url, addremove) {
    storedURLs = storedURLs.filter(e => e !== url);
    addremove.firstElementChild.setAttribute('d', svgadd);
    addremove.setAttribute('action', 'add');
    addremove._tippy.setContent("Removed!");
    // addremove.setAttribute('data-tippy-content', 'added!');
}

function showHideChart(addremove, action) {
    const index = addremove.parentElement.getAttribute("id");
    chart.getDatasetMeta(index).hidden = action==='remove';
    chart.update();
}

function setupButtons(locked) {
    tippy('.addremove', {
        trigger: 'manual',
        // hideOnClick: false,
        animateFill: false,
        arrow: false,
        animation: 'shift-away',
    });

    const relatedDiv = document.getElementById("related");

    // FIXME: this is ugly
    [0, 1, 2, 3].forEach(sitenum => {
        const addremove = document.getElementById(`add${sitenum}`);
        if (!addremove) return;
        const url = addremove.getAttribute("url");

        if (addremove.getAttribute('action') === 'add' && storedURLs.includes(url)) {
            console.log("change to remove");
            addremove.firstElementChild.setAttribute('d', svgremove);
            addremove.setAttribute('action', 'remove');
            addremove._tippy.setContent("Removed!");
        }

        // if (addremove != undefined) {
        addremove.onclick = function () {
            const action = addremove.getAttribute('action');
            addremove._tippy.show();
            setTimeout(function () {
                addremove._tippy.hide();
            }, 1000);

            if (action === 'remove') {
                showHideChart(addremove, action);
                setAdd(url, addremove);
            } else {
                showHideChart(addremove, action);
                setRemove(url, addremove);
            }
            chrome.storage.local.set({"storedurls": storedURLs});
        };

        const related = document.getElementById(`related${sitenum}`);
        if (related != undefined) {
            related.onclick = function (e) {
                showRelated(related).then(table => {
                    relatedDiv.innerHTML = table;
                });
            }
        }

        function fillChart(index, fill){
            if (index < chart.config.data.datasets.length){
                chart.config.data.datasets[index].fill = fill;
                chart.update();
            }
        }

        function showUnlock() {
            lock.parentElement.classList.remove("locked");
            lock.firstElementChild.setAttribute('d', svgunlock);
            fillChart(lock.parentElement.getAttribute("id"), false);
        }

        function showLock() {
            lock.parentElement.classList.add("locked");
            lock.firstElementChild.setAttribute('d', svglock);
            fillChart(lock.parentElement.getAttribute("id"), true);
        }

        const lock = document.getElementById(`lock${sitenum}`);

        if (locked.includes(lock.getAttribute('url'))) {
            showLock();
        } else {
            showUnlock();
        }

        if (lock != undefined) {
            lock.onclick = function (e) {
                if (lock.parentElement.classList.contains("locked")) {
                    showUnlock();
                    locked = '';
                } else {
                    showLock();
                    locked = url;
                }
                chrome.storage.local.set({'locked': locked});
            }
        }
    });
}

function addStored(actualUrl) {

    chrome.storage.local.get("storedurls", function (jsonURLs) {
        storedURLs = jsonURLs.storedurls;

        if (!storedURLs.includes(actualUrl)) {
            addSite(actualUrl, sitesNum, borderColors);
            sitesNum++;
        }

        storedURLs.forEach(url => {
            //if (url !== actualUrl) {
            addSite(url, sitesNum, borderColors);
            sitesNum++;
            //}
        });

        chrome.storage.local.get("locked", function (locked) {
            if (Object.keys(locked).length === 0)
                setupButtons([]);
            else
                setupButtons([locked.locked]);
        });

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
            if (Object.keys(jsonData).length === 0 || days_since(jsonData[url].cached) >= 7) {
                fetch(query).then(response => response.json()).then(data => {
                    chrome.storage.local.set({[url]: data}, function () {
                        // after obtaining storage data, index it using the current url
                        jsonData[url] = {};
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

document.addEventListener('DOMContentLoaded', function () {

    getCurrentTab().then(urldata => {

        const url = urldata[0];
        const link = document.getElementById('old');

        link.href = `minisite_old.html?url=${urldata[0]}&owner=${urldata[1]}/${urldata[2]}`;

        getGitMateData(url).then(gitmateData => {
                setupChart(gitmateData);
                addStored(url);
            }
        );

    }).catch(err => {
        console.log(err);
    });
});
