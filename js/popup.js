
function dispChromeSiteInfo(owner_name) {
  document.write( '<iframe name="minisiteinfo" ' + 
          'src="https://9fcb2903.ngrok.io/minisite/' + owner_name+ '" ' +
                  'style="padding:0px; overflow:hidden;" '+
          'width="400px" ' +
          'height="650px" ' +
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

      dispChromeSiteInfo( owner + "/" + name);
    });
};

$(window).load(onLoad);
