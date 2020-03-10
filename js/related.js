// const params = new URLSearchParams(window.location.search);
// const project = params.get("q");

function createTable(project) {

// create Table
    let bodyTemplate = `
<style>
    body {
        background-color: aliceblue;
    }
    table {
        border-collapse: collapse;
        width: 100%;
    }

    th, td {
        text-align: left;
        padding: 8px;
    }

    tr:nth-child(even) {background-color: #f2f2f2;}
</style>
<table id="related">
    <tr>
    <th>Project</th>
    <th>Description</th>
    <th># stars</th>
    <th>GitMate Index</th>
`;

// const template = document.createElement('template');
// template.innerHTML = bodyTemplate;
// document.body.appendChild(template);


// const table = document.getElementById('related');
    return fetch(`http://s3.amazonaws.com/github_yasiv/out/${project}.json`).then(resp => resp.json()).then(resp => {
        resp.forEach(
            relatedProject => {
                // Append new row with project data to the related table
                const data = `
                    <tr><td>${relatedProject.n}</td><td>${relatedProject.d}</td><td>${relatedProject.r}</td><td>${relatedProject.w}</td></tr>`;
                bodyTemplate += data;

                // const template = document.createElement('template');
                // template.innerHTML = data;
                // table.appendChild(template.content);


            }
        );
        bodyTemplate += `
                </tr> </table>`;

    });

}

export {createTable};

/*
n: "brunch/brunch"
r: 2
d: "Fast front-end web app build tool with simple declarative config, seamless incremental compilation for rapid development, an opinionated pipeline and workflow, and core support for source maps."
w: "4950"
*/


