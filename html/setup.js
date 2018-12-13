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
			tableHTML += "<div class=\"border\" onclick=\"ssidClicked(this)\">" + ssids[i] + "</div>\r\n";
		}	
		document.getElementById("ssidTable").innerHTML=tableHTML;
	}	
}

function ssidClicked(sender){
	document.getElementById("ssid").value=sender.innerHTML;
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



showCurrentConnection();
showSSIDTable();
