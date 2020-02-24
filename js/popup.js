const getGitMateData = (url) => {
    return new Promise((resolve, reject) => {

        chrome.storage.local.get(url, function (jsonData) {
            // after obtaining storage data, index it using the current url
            jsonData[url].project = url.replace("https://github.com/", "");
            resolve(jsonData[url]);
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
            resolve( [url, owner, name] );

        });
    })
};


function init() {
    const link = document.getElementById('old');
    const current = document.getElementById('current');


    getCurrentTab().then(url => {

        current.innerHTML = url[0];
        link.href = `minisite_old.html?url=${url[0]}&owner=${url[1]}/${url[2]}`;

    }).catch( err => {
        console.log(err);
    });

}

window.onload = init;

