// SAMPLE
var idlist = [];
(function($)
{
    var settings = new Store("settings", DEFAULTSETTING);
	idlist = settings.get("idlist");
})(jQuery);

this.manifest = {
    "name": "英雄クロニクル強化ツール for success",
    "icon": "./favicon-000.png",
    "settings": [
        {
            "tab": "filter",
            "group": "Filter Switch",
            "name": "myFilterPopupButton",
            "type": "popupButton",
            "label": "Filter is ",
            "options": {
                "values": [
                    ['true',"ON"],
                    ['false',"OFF"]
                ],
            },
        },
        {
            "tab": "filter",
            "group": "Filter Switch",
            "name": "autoReload",
            "type": "popupButton",
            "label": "Auto Reload is ",
            "options": {
                "values": [
                    ['true',"ON"],
                    ['false',"OFF"]
               ],
            },
        },
        {
            "tab": "filter",
            "group": "Filter ID List",
            "name": "myFilterListBox",
            "type": "listBox",
            "label": "Filter ID List:",
            "options": idlist,
        },
        {
            "tab": "filter",
            "group": "Filter ID List",
            "name": "myRemoveIdButton",
            "type": "button",
            "label": "Remove Select ID",
            "text": "Remove ID",
        },
        {
            "tab": "filter",
            "group": "Add Filter ID",
            "name": "filterid",
            "type": "text",
            "label": "Filter ID",
            "text": "Please Input Filter ID",
        },
        {
            "tab": "filter",
            "group": "Add Filter ID",
            "name": "myAddIdButton",
            "type": "button",
            "label": "Add Input ID",
            "text": "Add ID",
        },
        {
            "tab": "filter",
            "group": "Filter Message",
            "name": "filtertext",
            "type": "text",
            "label": "Filter Message",
            "text": "Please Input Filter Message",
        },
        {
            "tab": "advance",
            "group": "Setting",
            "name": "myResetButton",
            "type": "button",
            "label": "Reset",
            "text": "Reset Settings",
        },
    ],
};
