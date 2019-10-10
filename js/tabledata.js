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
    var tabledata = [
        {id: 1, name: "popularity", A: "v>=500", B: "v>=400", C: "v>=300", D: "v>=200"},
        {id: 2, name: "workforce", A: "v>=10 ", B: "v>8", C: "v>6", D: "v>4"},
        {id: 3, name: "recentActivity", A: "v<=2", B: "v<=7", C: "v>7 and v<=14", D: "v>14 and v<= 21"},
        {id: 4, name: "continuous activity ", A: "v>40", B: "v>30", C: "v>20", D: "v>10"},
        {id: 5, name: "forkDegree", A: "v>50", B: "v>40", C: "v>30", D: "v>20"},
        {id: 6, name: "beginnerFriendly", A: "v>10", B: "v>8", C: "v>6", D: "v>4"},
        {id: 7, name: "documentationFriendly", A: "v>10", B: "v>7", C: "v>5", D: "v>=3"},
        {id: 8, name: "contributionOpportunities", A: "v>200", B: "v>100", C: "v>75", D: "v>50"},
        {id: 9, name: "closingFactor", A: "v>0.25", B: "v>0.20", C: "v>0.15", D: "v>0.10"},
        {id: 10, name: "pullRequests", A: "v>200", B: "v>100", C: "v>50", D: "v>25"},
    ];

    var table = new Tabulator("#example-table", {
        data: tabledata,           //load row data from array

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

            {title: "A", field: "A", width: 130, editor: "input"},
            {title: "B", field: "B", width: 130, editor: "input"},
            {title: "C", field: "C", width: 130, editor: "input"},
            {title: "D", field: "D", width: 130, editor: "input"},
        ],
    });

};
