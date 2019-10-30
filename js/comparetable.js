window.onload = function () {

//  popularity (# of stars)
//  (#of committers)
//  (#days since last commit)
// (#commits since last month)
//  (# of forks)
//  (has easy-hacks, beginner-friendly labelled issues?)
//  (has documentation for new contributors?)
//  (#of current issues opened)
//  (#issues closed during last year)

    let tabla;
    let storedURLs;
    let keys = ["beginnerFriendly", "closingFactor", "continuousActivity", "contributionOpportunities", "docWeb", "docWiki", "forkDegree", "popularity", "pullRequests", "recentActivity", "suitability", "workForce"];
    let projects = [];
    let rows = [];
    let id = 0;


    chrome.storage.sync.get("storedurls", storedurls => {
        storedURLs = storedurls.storedurls;

        storedURLs.urls.forEach(e => {
            let project = "https://github.com/" + e.owner;
            projects.push(project);
            chrome.storage.sync.get(project, result => {
                obj = {};
                keys.forEach( key => {
                    // FIXME: this is a dirty hack, avoid this conditional if
                    if (key == "suitability")
                        obj[key] = result[project][key];
                    else
                        obj[key] = result[project][key].value;
                    // console.log(project + " " + key + " " + result[project][key].value);
                })
                obj["name"] = e.owner;
                obj["id"] = id++;

                rows.push(obj);
            })
        })

        setTimeout(() => {

            // console.log(rows);

            tabla = new Tabulator("#example-table", {
                data: rows,           //load row data from array
                // responsiveLayout: "hide",  //hide columns that dont fit on the table
                tooltips: true,            //show tool tips on cells
                addRowPos: "top",          //when adding a new row, add it to the top of the table
                history: true,             //allow undo and redo actions on the table
                movableColumns: true,      //allow column order to be changed
                resizableRows: true,       //allow row order to be changed
                initialSort: [             //set the initial sort order of the data
                    {column: "name", dir: "asc"},
                ],
                columns: [                 //define the table columns
                    {title: "Project", field: "name"},
                    {title: "suitability", field: "suitability", width: 130, editor: "input"},
                    {title: "beginnerFriendly" , field: "beginnerFriendly", width: 130, editor: "input"},
                    {title: "closingFactor", field: "closingFactor", width: 130, editor: "input"},
                    {title: "continuousActivity", field: "continuousActivity", width: 130, editor: "input"},
                    {title: "contributionOpportunities", field: "contributionOpportunities", width: 130, editor: "input"},
                    {title: "docWeb", field: "docWeb", width: 130, editor: "input"},
                    {title: "docWiki", field: "docWiki", width: 130, editor: "input"},
                    {title: "forkDegree", field: "forkDegree", width: 130, editor: "input"},
                    {title: "popularity", field: "popularity", width: 130, editor: "input"},
                    {title: "pullRequests", field: "pullRequests", width: 130, editor: "input"},
                    {title: "recentActivity", field: "recentActivity", width: 130, editor: "input"},
                    {title: "workForce", field: "workForce", width: 130, editor: "input"}
        ],
            });
            // OSSinSE_Preferences.table = tabla;
        }, 250);

    });


};
