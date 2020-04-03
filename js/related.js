
function createTable(project) {

// create Table
    let bodyTemplate = `
<style>
    
    table {
        border-collapse: collapse;
        background-color: aliceblue;
        width: 88%;
    }

    th, td {
        text-align: left;
        padding: 8px;
    }

    tr:nth-child(even) {background-color: #f2f2f2;}
</style>
<table id="related">
    <tr>
    <th>Related Project</th>
    <th>Description</th>
    <th>Similarity Index</th>
    <th># stars</th>
`;

    return fetch(`http://s3.amazonaws.com/github_yasiv/out/${project}.json`).then(resp => resp.json()).then(resp => {
        resp.forEach(
            relatedProject => {
                // Append new row with project data to the related table
                const data = `
                    <tr><td><a href="https://github.com/${relatedProject.n}" target="_blank">${relatedProject.n}</a></td><td>${relatedProject.d}</td><td>${relatedProject.r}</td><td>${relatedProject.w}</td></tr>`;
                bodyTemplate += data;
            }
        );
        bodyTemplate += `
                </tr> </table>`;

        return bodyTemplate;
    }).catch(reason => { console.log(reason)});

}

export {createTable};

/*
n: "brunch/brunch"
r: 2
d: "Fast front-end web app build tool with simple declarative config, seamless incremental compilation for rapid development, an opinionated pipeline and workflow, and core support for source maps."
w: "4950"
*/


