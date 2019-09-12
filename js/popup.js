
function dispChromeSiteInfo(host) {
  document.write( '<iframe name="minisiteinfo" ' + 
          'src="https://02bd22af.ngrok.io/minisite/' + host + '" ' +
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
      if (url.match("http://\w*.?alexa.com/siteinfo/.*"))
        var host = url.split("/")[4].split("?")[0].split("#")[0];
      else if (url.match("http://\w*.?alexa.com/site/linksin/.*"))
        var host = url.split("/")[5].split("?")[0].split("#")[0];     
      else
        var host = url.split("/")[2].split("?")[0].split("#")[0];
      dispChromeSiteInfo(host);
    });
};

$(window).load(onLoad);
