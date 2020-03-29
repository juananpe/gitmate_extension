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
    var onoffswitch = function(cell, formatterParams){ //plain text value
        if (cell.getRow().getIndex() % 2 == 0)
            return "<img src='/img/onswitch.png' width='30' height='20' />";

        return "<img src='/img/offswitch.png' width='30' height='20' />";
    };

    chrome.storage.local.get("tabledata", tablearray => {

        tabla = new Tabulator("#metrics-table", {
            data:   tablearray.tabledata,           //load row data from array

            responsiveLayout: "hide",  //hide columns that dont fit on the table
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
                {title: "", width: 40, editor: "input", formatter: onoffswitch, width:40, align:"center", cellClick:function(e, cell){
                        cell.getRow().delete();
                    }},
                {title: "Metric", field: "name"},
                {title: "Excellent (1p)", field: "A", width: 140, editor: "input"},
                {title: "Good (0.75)", field: "B", width: 160, editor: "input"},
                {title: "Fair (0.5)", field: "C", width: 140, editor: "input"},
                {title: "Poor (0.25)", field: "D", width: 140, editor: "input"},
                {title: "Very Poor (0)", field: "E", width: 140, editor: "input"},
                {title: "Weight", field: "W", width: 100, editor: "input"},
            ],
        });
        GitMate_Preferences.table = tabla;
    });


};
