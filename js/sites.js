
function parseHTML(html) {
    const t = document.createElement('template');
    t.innerHTML = html;
    return t.content.cloneNode(true);
}

function addSite(url, sitesNum, borderColors) {
    const sites = document.getElementById('sites');
    const site = `<div class"site" style="display: inline-block; margin: 4px" url="${url}" id="${sitesNum}">
        ${url.replace('https://github.com/','')}<br>
        
        <svg class="addremove" action="add" fill="none" height="24" id="add${sitesNum}" url="${url}" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 9V12M12 12V15M12 12H15M12 12H9M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z"
    stroke="#4A5568" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"  fill="${borderColors[sitesNum]}" />
        </svg>
        
        <svg class="related" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg" id="related${sitesNum}" url="${url}">
         <path d="M3.9 12c0-1.71 1.39-3.1 3.1-3.1h4V7H7c-2.76 0-5 2.24-5 5s2.24 5 5 5h4v-1.9H7c-1.71 0-3.1-1.39-3.1-3.1zM8 13h8v-2H8v2zm9-6h-4v1.9h4c1.71 0 3.1 1.39 3.1 3.1s-1.39 3.1-3.1 3.1h-4V17h4c2.76 0 5-2.24 5-5s-2.24-5-5-5z"/>
        </svg>
        
        <!-- LOCK -->
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" id="lock${sitesNum}"  url="${url}">
            <path d="M12 15V17M6 21H18C19.1046 21 20 20.1046 20 19V13C20 11.8954 19.1046 11 18 11H6C4.89543 11 4 11.8954 4 13V19C4 20.1046 4.89543 21 6 21ZM16 11V7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7V11H16Z" stroke="#4A5568" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        
        
        </div>`;
    sites.appendChild(parseHTML(site));
}

export {addSite};