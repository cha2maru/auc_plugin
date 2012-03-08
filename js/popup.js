var options;
$(document).ready(function() {
	chrome.extension.sendRequest({action: 'gpmeGetOptions'}, function(theOptions) {
    	options = theOptions;

    	// The rest of your content script initialization
    	var button = document.getElementById('AddID');
    	var fiswitch = document.getElementById('Filter');
    	var arswitch = document.getElementById('AutoReload');
    	button.addEventListener("click", addid, true);
//    	fiswitch.addEventListener("click", change, true);
//    	arswitch.addEventListener("click", change, true);
    	if (options.myFilterPopupButton == 'true'){
	    	fiswitch.innerText = 'Filter is ON';
    	} else {
	    	fiswitch.innerText = 'Filter is OFF';    		
    	}
    	if (options.autoReload == 'true'){
	    	arswitch.innerText = 'AutoReload is ON';
    	} else {
	    	arswitch.innerText = 'AutoReload is OFF';    		
    	}
    	
  	});
});

function addid() {
	var filterid = document.getElementById('FilterID');
	chrome.extension.getBackgroundPage().addId(filterid.value);
	filterid.value = "";
	if (options.autoReload == 'true') {
		chrome.extension.getBackgroundPage().getSelectTab();
	}
}

function change(event){
	var mystore = new Store("settings");

	if (event.target.id == 'FilterSwitch') {
		var target = 'myFilterPopupButton';
		var value = event.target.checked;
		mystore.set(target,value);	
	} else if (event.target.id == 'AutoReloadSwitch'){
		var target = 'autoReload';
		var value = event.target.checked;
		mystore.set(target,value);	
	} else {
		console.log(event.targe.id);	
	}
	location.reload();
}

function toggleAutoReload() {
	console.log('tab.id');
}
