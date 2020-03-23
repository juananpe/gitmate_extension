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
                    },
                    "legend":
                        {
                            "display": false,
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

    const project = `${owner}/${name}`;
    return createTable(project);

}

function setVisible(what, visible) {
    what.style.visibility = visible ? 'visible' : 'hidden';
    what.style.display = visible ? 'display' : 'none';
}

function setupButtons(locked) {
    tippy('[data-tippy-content]', {
        trigger: 'manual',
        // hideOnClick: false,
        animateFill: false,
        arrow: false,
        animation: 'shift-away',
    });

    const relatedDiv = document.getElementById("related");

    function setVisibility(add, remove, where, url) {
        add.style.visibility = where.includes(url) ? 'hidden' : 'visible';
        add.style.display = where.includes(url) ? 'none' : 'inline';

        remove.style.visibility = where.includes(url) ? 'visible' : 'hidden';
        remove.style.display = where.includes(url) ? 'inline' : 'none';
    }


    [0, 1, 2, 3].forEach(sitenum => {
        const add = document.getElementById(`add${sitenum}`);
        const remove = document.getElementById(`remove${sitenum}`);

        if (!add) return;

        const url = add.getAttribute("url");


        if (add != undefined) {
            add.onclick = function () {
                add._tippy.show();
                setTimeout(function () {
                    add._tippy.hide();
                }, 1000);

                console.log("On add: " + url);
                storedURLs.push(url);
                setVisibility(add, remove, storedURLs, url);

                chrome.storage.local.set({"storedurls": storedURLs});
            };
        }

        if (remove != undefined) {
            remove.onclick = function (e) {
                remove._tippy.show();
                setTimeout(function () {
                    remove._tippy.hide();
                    e.target.parentElement.style.display = "none"
                }, 1000);

                console.log("On remove: " + url);
                storedURLs = storedURLs.filter(e => e !== url);
                setVisibility(add, remove, storedURLs, url);

                chrome.storage.local.set({"storedurls": storedURLs});

            };
        }

        setVisibility(add, remove, storedURLs, url);

        const related = document.getElementById(`related${sitenum}`);
        if (related != undefined) {
            related.onclick = function (e) {
                showRelated(related).then(table => {
                    relatedDiv.innerHTML = table;
                });
            }
        }

        const lock = document.getElementById(`lock${sitenum}`);
        const unlock = document.getElementById(`unlock${sitenum}`);

        if (locked.includes(lock.getAttribute('url'))) {
            lock.parentElement.classList.add("locked");
        } else {
            lock.parentElement.classList.remove("locked");
        }

        setVisible(lock, locked.includes(url));
        setVisible(unlock, !locked.includes(url));


        if (lock != undefined) {
            lock.onclick = function (e) {
                setVisibility(lock, unlock, locked, url);
                lock.parentElement.classList.remove("locked");
                locked = [];
            }
        }

        if (unlock != undefined) {
            unlock.onclick = function (e) {
                unlock.parentElement.classList.add("locked");
                chrome.storage.local.set({'locked': url});
                setVisibility(lock, unlock, locked, url);
                locked = [url];
            }
        }

    });
}

function addStored(actualUrl) {
    chrome.storage.local.get("storedurls", function (jsonURLs) {
        storedURLs = jsonURLs.storedurls;

        storedURLs.forEach(url => {
            if (url !== actualUrl) {
                addSite(url, sitesNum, borderColors);
                sitesNum++;
            }
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

        addSite(url, sitesNum, borderColors);
        sitesNum++;

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
