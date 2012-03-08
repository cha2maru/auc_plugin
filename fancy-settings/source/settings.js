var defaultSettings = DEFAULTSETTING;

function addId() {
	var mystore = new Store("settings",defaultSettings);
	chrome.extension.getBackgroundPage().addId(mystore.get('filterid'));
	location.reload();
}

function removeId() {
	var mystore = new Store("settings",defaultSettings);
	chrome.extension.getBackgroundPage().removeId(mystore.get('myFilterListBox'));
	location.reload();
}

function changeIcon() {
	var mystore = new Store("settings",defaultSettings);
	chrome.extension.getBackgroundPage().changeIcon(mystore.get('myFilterPopupButton'));
}

function reset(settings) {
    var store = new Store("settings");
    chrome.extension.getBackgroundPage().reset();
    for (var name in settings.manifest) {
        var setting = settings.manifest[name];
        if (typeof setting.set === "function") {
            setting.set(store.get(setting.params.name));
        }
    }
}

window.addEvent("domready", function () {
    // Option 1: Use the manifest:
    new FancySettings.initWithManifest(function (settings) {
        settings.manifest.myAddIdButton.addEvent("action",function () {
        	addId();
        });

        settings.manifest.myRemoveIdButton.addEvent("action",function () {
        	removeId();
        });

        settings.manifest.myResetButton.addEvent("action",function () {
			if (confirm("This will reset this extension's settings.  Are you sure?")){
	        	reset();			 	
			}
        });
//        settings.manifest.myFilterPopupButton.addEvent("action",function () {
//        	changeIcon();
//        });
    });
    
    // Option 2: Do everything manually:
    /*
    var settings = new FancySettings("My Extension", "icon.png");
    
    var username = settings.create({
        "tab": i18n.get("information"),
        "group": i18n.get("login"),
        "name": "username",
        "type": "text",
        "label": i18n.get("username"),
        "text": i18n.get("x-characters")
    });
    
    var password = settings.create({
        "tab": i18n.get("information"),
        "group": i18n.get("login"),
        "name": "password",
        "type": "text",
        "label": i18n.get("password"),
        "text": i18n.get("x-characters-pw"),
        "masked": true
    });
    
    var myDescription = settings.create({
        "tab": i18n.get("information"),
        "group": i18n.get("login"),
        "name": "myDescription",
        "type": "description",
        "text": i18n.get("description")
    });
    
    var myButton = settings.create({
        "tab": "Information",
        "group": "Logout",
        "name": "myButton",
        "type": "button",
        "label": "Disconnect:",
        "text": "Logout"
    });
    
    // ...
    
    myButton.addEvent("action", function () {
        alert("You clicked me!");
    });
    
    settings.align([
        username,
        password
    ]);
    */
});
