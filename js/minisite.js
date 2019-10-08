const params = new URLSearchParams(window.location.search);
const name = params.get("q");
let suitability = 65;

var data = {
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
    documentationFriendly: {
        raw : 20,
        value: 15,
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
}


function draw(criteria){
    return criteria.raw + " (+" + criteria.value + ")";
}


$(document).ready( function() {
    $("#domain").text( name );


    Object.keys(data).forEach( k => {
        let name = "#" + k;
        $(name).text( draw(data[k]) );
    });

    $("#suitability").text( suitability );

    document.title = name; 

})
