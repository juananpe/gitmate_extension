
function dispChromeSiteInfo(url, owner_name) {
  document.write( '<iframe name="minisiteinfo" ' + 
          'src="minisite.html?url='+ url +'&owner=' + owner_name+ '" ' +
                  'style="padding:0px; overflow:hidden;" '+
          'width="400px" ' +
          'height="700px" ' +
          'marginwidth="5px" ' +
          'marginheight="5px" ' +
          'frameborder="0" ' +
          'scrolling="no" ' +
          '></iframe>' ); 
};


function onLoad() {
    chrome.tabs.getSelected(null, function(tab) {
     var url = tab.url;

     var loc = new URL(url);
     let found = loc.pathname.match(/\/(.*)\/(.*)/);
     if ( !found || found.length < 3 || loc.hostname != 'github.com') return;

    let foo, owner, name;
    [foo, owner, name] = loc.pathname.split("/");

      dispChromeSiteInfo( url,owner + "/" + name);
    });
};

$(window).load(onLoad);
