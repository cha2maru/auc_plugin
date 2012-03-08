//background.js
var defaultSettings = DEFAULTSETTING;
var settings = new Store("settings",defaultSettings);
window.onload = init

// init
function init() {
	chrome.extension.onRequest.addListener(function(request, sender, sendResponse) {
		if (request.action == 'gpmeGetOptions') {
//			changeIcon(settings.get('myFilterPopupButton'));
			sendResponse(settings.toObject());
  		} else if(request.action == 'addFilterId'){
//  			console.log('test');
  			setFilterID(request.target);
  			sendResponse({});
  		} else {
  			sendResponse({});		
  		}
	});
	chrome.contextMenus.create({
		"title":"Add Filter ID",
		"contexts":['link'],
		"onclick": onclickAddId,
		"documentUrlPatterns": ["http://suc.au-chronicle.jp/web/*"],
	});
}

function changeIcon(toggle){
	if (toggle == 'true') {
		chrome.browserAction.setIcon({'path':'./img/faviocn-000.png'});
	} else {
		chrome.browserAction.setIcon({'path':'./img/faviocn-010.png'});
	}
}

function setSettings(target,value){
}

function reset() {
	settings.fromObject(defaultSettings);
}

function getSelectTab(){
	chrome.tabs.getSelected(window.id, function (tab) {
			chrome.tabs.sendRequest(tab.id, {action: "executeReload"}, function(response) {
		    	console.log("tab.id");
  			});
  	});
}

function onclickAddId(info,tab){
	var target = info.selectionText;
	var mystore = new Store("settings");
	var filterid = mystore.get("filterid");
	if (filterid != '') {
		addId(filterid);	
	}
	getSelectTab()
}

function setFilterID(filterid){
	var mystore = new Store("settings");
	mystore.set("filterid",filterid);
}

function addId(filterid) {
	filterid = filterid.replace(/(^\s+)|(\s+$)/g, "");
	if (filterid != "" && filterid.length == 4) {
		var mystore = new Store("settings");
		var nowidlist = mystore.get("idlist");
		var dupflag = false;
		if (nowidlist == undefined) {
			nowidlist = [];
		}
		iddup:
		for (var i =0; i < nowidlist.length; i++) 
		{
			for (var j=0; j < nowidlist[i].length; j++ )
			{
				if ( filterid === nowidlist[i][j]){
					dupflag = true;
					break iddup;
				}
			}
		}
		if (dupflag == false) {
			var addid = [[filterid]];
			nowidlist.push(addid);
			mystore.set("idlist",nowidlist);
			mystore.set("filterid","");
		} else {
			alert("duplicate id");
		}
	} else {
		alert("can't add this id");
	}
}

function removeId(filterid) {
	var mystore = new Store("settings");
	var nowidlist = mystore.get("idlist");
	var dupflag = true;
	if (nowidlist == undefined) {
	} else {
		iddup:
		for (var i = nowidlist.length - 1 ; i >= 0; i--) 
		{
			for (var j = nowidlist[i].length - 1; j >= 0; j-- )
			{
				var check = nowidlist[i][j];
				if (filterid.toString() == check.toString()){
					dupflag = false;
					nowidlist.splice(i,1);
					break;
				}
			}
		}
	}

	if (dupflag == false) {
		mystore.set("idlist",nowidlist);
	}
}
