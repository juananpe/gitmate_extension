const params = new URLSearchParams(window.location.search);
const owner = params.get("owner");
const url = params.get("url");
let suitability = 65;


function draw(criteria){
    return criteria.raw + " (+" + criteria.value + ")";
}

chrome.storage.sync.get(url, function(jsonData) {
    // console.log("result:");
    let data = jsonData[url];

    $(document).ready( function() {
        $("#domain").text( owner );


        Object.keys(data).forEach( k => {
            let name = "#" + k;
            $(name).text( draw(data[k]) );
        });

        $("#suitability").text( suitability );

        document.title = name;

    })


});






/* var data = {
    popularity: {
        raw : 900,
        value: 5,
    },
    workForce: {
        raw : 7,
        value: 15,
    },
    recentActivity: {
        raw : 8,
        value: 15,
    },
    continuousActivity: {
        raw : 35,
        value: 15,
    },
    forkDegree: {
        raw : 46,
        value: 15,
    },
    beginnerFriendly: {
        raw : 12,
        value: 15,
    },
    docWiki: {
        raw : 10,
        value: 1,
    },
    docWeb: {
        raw : 1,
        value: 1,
    },
    contributionOpportunities: {
        raw : 60,
        value: 15,
    },
    closingFactor: {
        raw : 0.30,
        value: 15,
    },
    pullRequests: {
        raw : 30,
        value: 15,
    },
}*/

