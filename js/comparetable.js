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

    chrome.storage.sync.get("storedurls", storedurls => {
        storedurls = storedurls.storedurls;


        chrome.storage.sync.get("https://github.com/bardsoftware/ganttproject", project => {
            console.log(project["https://github.com/bardsoftware/ganttproject"]);

            chrome.storage.sync.get("tabledata", tablearray => {

                tabla = new Tabulator("#example-table", {
                    data: tablearray.tabledata,           //load row data from array

                    responsiveLayout: "hide",  //hide columns that dont fit on the table
                    tooltips: true,            //show tool tips on cells
                    addRowPos: "top",          //when adding a new row, add it to the top of the table
                    history: true,             //allow undo and redo actions on the table
                    movableColumns: true,      //allow column order to be changed
                    resizableRows: true,       //allow row order to be changed
                    initialSort: [             //set the initial sort order of the data
                        {column: "name", dir: "asc"},
                    ],
                    columns: [                 //define the table columns
                        {title: "Name", field: "name"},

                        {title: storedurls.urls[0].owner, field: "A", width: 130, editor: "input"},
                        {title: "ProjectB", field: "B", width: 130, editor: "input"},
                        {title: "ProjectC", field: "C", width: 130, editor: "input"},
                        {title: "ProjectD", field: "D", width: 130, editor: "input"},
                    ],
                });
                OSSinSE_Preferences.table = tabla;
            });
        });
    });


};
