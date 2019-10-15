const params = new URLSearchParams(window.location.search);
const owner = params.get("owner");
const url = params.get("url");

function draw(criteria){
    return criteria.raw + " (+" + criteria.value + ")";
}

chrome.storage.sync.get(url, function(jsonData) {
    let data = jsonData[url];

    $(document).ready( function() {
        $("#domain").text( owner );


        Object.keys(data).forEach( k => {
            if (k != "suitability"){
                let name = "#" + k;
                $(name).text( draw(data[k]) );
            }
        });

        $("#suitability").text( data.suitability );

        document.title = name;

    })


});