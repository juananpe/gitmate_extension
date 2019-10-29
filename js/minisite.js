const params = new URLSearchParams(window.location.search);
const owner = params.get("owner");
const url = params.get("url");
let storedURLs;

function draw(criteria){
	let style = "bad";
	if (criteria.value >= 0.5)
		style = "good";

    return criteria.raw + " <span class='" + style + "'>(+" + criteria.value + ")</span>" +
		  "<div class='label'>(weight:" + criteria.weight  + ")</div>";
}

function drawURL(obj){
	let element = document.querySelector("#tools > ul")
	let li = document.createElement("li");
	let ahref = document.createElement('a');
	let linkText = document.createTextNode(obj.owner);
	ahref.appendChild(linkText);
	ahref.title = obj.owner;
	ahref.href = obj.href;
	li.appendChild(ahref);
	element.appendChild(li)
}


chrome.storage.sync.get(url, function(jsonData) {
    let data = jsonData[url];

    $(document).ready( function() {
        $("#domain").text( owner );


        Object.keys(data).forEach( k => {
            if (k != "suitability"){
                let name = "#" + k;
                $(name).html( draw(data[k]) );
            }
        });

        $("#suitability").text( data.suitability );

        document.title = name;

    })


});

let readURLs = function() {
	chrome.storage.sync.get("storedurls", function (jsonURLs) {
		// storedURLs = JSON.parse(jsonURLs);
		storedURLs = jsonURLs.storedurls;
		storedURLs.urls.forEach( e => {
			drawURL(e);
		})
	})
}

			$(document).ready(function(){
				var docked = 0;

				$("#dock li ul").height($(window).height());

				$("#dock .dock").click(function(){
					$(this).parent().parent().addClass("docked").removeClass("free");

					docked += 1;
					var dockH = ($(window).height()) / docked
					var dockT = 0;               

					$("#dock li ul.docked").each(function(){
					$(this).height(dockH).css("top", dockT + "px");
					dockT += dockH;
					});
					$(this).parent().find(".undock").show();
					$(this).hide();

					if (docked > 0)
					$("#content").css("margin-left","250px");
					else
					$("#content").css("margin-left", "60px");
				});

				$("#dock .undock").click(function(){
					$(this).parent().parent().addClass("free").removeClass("docked")
					.animate({right:"-80px"}, 200).height($(window).height()).css("top", "0px");

					docked = docked - 1;
					var dockH = ($(window).height()) / docked
					var dockT = 0;               

					$("#dock li ul.docked").each(function(){
					$(this).height(dockH).css("top", dockT + "px");
					dockT += dockH;
					});
					$(this).parent().find(".dock").show();
					$(this).hide();

					if (docked > 0)
					$("#content").css("margin-left", "40px");
					else
					$("#content").css("margin-left", "80px");
				});

				$("#dock li").hover(function(){
                        
					}, function(){
						$(this).find("ul.free").animate({right:"-80px",width:'0px'}, 200);
					});
                $("#dock li").click(function(){
					    $(this).find("ul").animate({right:"20px",width:'180px'}, 200);
					});

				$("#colorgreen").click( function () {


					let newurl = {
						"owner" : owner,
						"href": window.location.search
					}

					drawURL(newurl);
					storedURLs['urls'].push(newurl);
					chrome.storage.sync.set({"storedurls": storedURLs });

				})

				readURLs();


			});


