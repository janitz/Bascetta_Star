//var currCon="This device is currently not connectet to any access point.";
//var ssids=["wlanName1","wlanName2"];

function showCurrentConnection(){
	if(currCon.length > 0){
		document.getElementById("currCon").innerHTML=currCon; 
	}	
}
   
function showSSIDTable(){
	if(ssids.length > 0){
		var i, tableHTML="\r\n";
		for (i = 0; i < ssids.length; i++){
			tableHTML += "<div class=\"border item\" onclick=\"ssidClicked(this)\">" + ssids[i] + "</div>\r\n";
		}	
		document.getElementById("ssidTable").innerHTML=tableHTML+"<br>";
	}	
}

function ssidClicked(sender){
	document.getElementById("ssid").value=sender.innerHTML;
	compareTable();
}

function compareTable(){
	let txt = document.getElementById("ssid").value
	let items = document.getElementsByClassName("item")
	for(let i = 0; i < items.length; i++){
		if(items[i].innerHTML == txt){
			items[i].style.borderColor = "#888";
		}else{
			items[i].style.borderColor = "#000";
		}
	}
}

function restart(){
	var request = new XMLHttpRequest();
	var url = window.location.href;
	var pos = url.indexOf("?");
	if(pos > 1){
		url = url.substring(0, pos);
	}
	url += "?restart=now";
	request.open('GET', url , true);
	request.send(null);
}

function connect(){
	var request = new XMLHttpRequest();
	var url = window.location.href;
	var pos = url.indexOf("?");
	if(pos > 1){
		url = url.substring(0, pos);
	}
	url += "?ssid=" + document.getElementById("ssid").value;
	url += "&pwd=" + document.getElementById("pwd").value;
	
	request.open('GET', url , true);
	request.send(null);
}

function resize(e) {
	let menu = document.getElementById("menu");
	let height = window.innerHeight;
	menu.style.height = (height - 110) + 'px';
}

window.addEventListener('load', resize);
window.addEventListener('resize', resize);
	
showCurrentConnection();
showSSIDTable();
