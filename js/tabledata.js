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

    //Generate print icon
    var onoffswitch = function (cell, formatterParams) {
        if (cell.getValue())
            return "<img src='/img/onswitch.png' width='30' height='20' />";

        return "<img src='/img/offswitch.png' width='30' height='20' />";
    };

    chrome.storage.local.get("tabledata", tablearray => {

        tabla = new Tabulator("#metrics-table", {
            data: tablearray.tabledata,           //load row data from array

            responsiveLayout: "hide",  //hide columns that dont fit on the table
            layout: "fitData",
            tooltips: true,            //show tool tips on cells
            addRowPos: "top",          //when adding a new row, add it to the top of the table
            history: true,             //allow undo and redo actions on the table
            movableColumns: true,      //allow column order to be changed
            resizableRows: true,       //allow row order to be changed
            initialSort: [             //set the initial sort order of the data
                {column: "name", dir: "asc"},
            ],
            // groupBy: "group",
            columns: [                 //define the table columns
                {
                    title: "",
                    field: "enabled",
                    width: 40,
                    formatter: onoffswitch,
                    align: "center",
                    cellClick: function (e, cell) {
                        cell.setValue(!cell.getValue());
                    }
                },
                {title: "Range", field: "range", editor: "input"},
                {title: "Metric", field: "name"},
                {title: "Excellent (1p)", field: "A", editor: "input"},
                {title: "Good (0.75)", field: "B", editor: "input"},
                {title: "Fair (0.5)", field: "C", editor: "input"},
                {title: "Poor (0.25)", field: "D", editor: "input"},
                {title: "Very Poor (0)", field: "E", editor: "input"},
                {title: "Weight", field: "W", editor: "input"},
            ],
        });
        GitMate_Preferences.table = tabla;
    });


};
