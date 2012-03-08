var options,
	filtertext,
	deletetext,
	postpath,
	sbbspostpath,
	bbstimepath,
	bbsforcepath,
	bbsrespath,
	headerpath,
	forceidlinkpath,
	bbsforceidlinkpath;
$(document).ready(function() {

	chrome.extension.sendRequest({action: 'gpmeGetOptions'}, function(theOptions) {
	chrome.extension.onRequest.addListener(function(request, sender, sendResponse) {
			if (request.action == 'executeReload') {
				chrome.extension.sendRequest({action: 'gpmeGetOptions'}, function(reloadOption) {
		//			console.log('reload');
					if (reloadOption.autoReload =='true' && confirm('reload now?') == true){
						location.reload();			
					}
				});
				sendResponse({});
	  		} else {
	  			sendResponse({});		
	  		}
	});
    options = theOptions;
    
    // The rest of your content script initialization
    // 削除コメント判断用テキスト等
	filtertext = options.filtertext;
	deletetext = 'このコメントは削除されました';
	// メインひとこと掲示板
	postpath = '//div[@class="sbbs-post"]';
	sbbsposttextpath = '//div[@class="sbbs-post-text"]';
	// ヘッダーひとこと掲示板
	bbstimepath = '//div[@id="bbs-tab"]//span[@class="bbstime"]';
	bbsforcepath = '//div[@id="bbs-tab"]//span[@class="bbsforce"]/a';
	bbscommentpath = '//div[@id="bbs-tab"]//span[@class="bbscomment"]';
	bbsforceidpath = '//div[@id="bbs-tab"]//span[@class="bbsforceid"]';
	// 陣営掲示板関連
	bbsrespath = '//div[@class="bbs-board-re"]';
	bbsrestdpath = '//div[@class="bbs-board-re"]//table[@class="bbs-con_ta"]';
	headerpath = '//div[@id="title"]/h2';
	// 部隊IDLink
	forceidlinkpath = options.forceidlinkpath;
	bbsforceidlinkpath = options.bbsforceidlinkpath;
	
	var toggle = options.myFilterPopupButton;
	var idlist = [];
	if (options.idlist != null){
		for (i = 0; i < options.idlist.length; i++){
			for (j=0; j < options.idlist[i].length; j++){
				if(options.idlist[i][j] != null){
					idlist.push(options.idlist[i][j]);
				}
			}
		}
	}
	if (toggle == 'true'){
		filter_headerbbs(document,idlist);
		filter_bbs(document,idlist);
		filter_sbbs(document,idlist);
	}	
	forceidlinkAddEvent();
  });
});

// 部隊IDリンクイベント
function forceidlinkEvent(event){
//	console.log("linkevent");
	var target = event.target.innerText;
	chrome.extension.sendRequest(
		{action: 'setFilterId',
		target: target},
		 function(){});
}

//部隊IDリンクイベント付与
function forceidlinkAddEvent(){
	var forceidlinks = document.evaluate(forceidlinkpath, document, null, 7 , null);
	if (forceidlinks) {
		addContextEvent( forceidlinks );
	}
	var bbsforceidlinks = document.evaluate(bbsforceidlinkpath, document, null, 7 , null);
	if (bbsforceidlinks){
		addContextEvent( bbsforceidlinks );
	}
}

//ループの部分は外にしたほうがいいよね
function addContextEvent(links){
	for (i=0; i < links.snapshotLength; i++) {
		var link = links.snapshotItem(i);
		link.addEventListener("contextmenu",forceidlinkEvent,false);
		if (link.href == 'javascript:void(0);'){
			link.href = '';
		}
	}
}

//陣営掲示板フィルタ
function filter_bbs(content,deny_users) {
	var bbsresponses = document.evaluate(bbsrestdpath, content, null, 7 , null);
	for(var e = 0 ; e < bbsresponses.snapshotLength; e++)
	{
		var res = bbsresponses.snapshotItem(e);
		var user = res.innerText;
		for (var i = 0; i < deny_users.length; i++) {
			if(user != null && user.indexOf(deny_users[i])>=0){
				var childs = res.lastChild.firstChild.childNodes;
				// ここ力技。構造変わったら困るけど知らん。
				childs[1].innerText = '';
				childs[1].style.color = 'black';
				childs[3].innerText = filtertext;
				childs[3].style.color = 'black';
			}
		}
	}
}

//BBSフィルタ
function filter_sbbs(content,deny_users) {
	var bbsposts = document.evaluate(postpath, content, null, 7 , null);
	for(var e = 0 ; e < bbsposts.snapshotLength; e++)
	{
		var elem = bbsposts.snapshotItem(e);
		var user = elem.innerText;
		for (var i = 0; i < deny_users.length; i++) {
			// post内どこかにに用語がはいってたら削除
			if(user != null && user.indexOf(deny_users[i])>=0){
				var childs =  elem.childNodes;
				// post内の各要素毎に削除するかどうかかえる
				for (var c = 0; c < childs.length; c++)
				{
					if (childs[c].className)
					{
						if (childs[c].className == 'sbbs-post-text')
						{
							childs[c].innerText = filtertext;
							} else {
							childs[c].style['display'] = 'none';
						}
					}
				}
			}
		}
	}
}

//ヘッダBBSフィルタ
function filter_headerbbs(content,deny_users) {
	var bbstimes = document.evaluate(bbstimepath, content, null, 7 , null);
	var bbsforces = document.evaluate(bbsforcepath, content, null, 7 , null);
	var bbsforceids = document.evaluate(bbsforceidpath, content, null, 7 , null);
	var bbscomments = document.evaluate(bbscommentpath, content, null, 7 , null);
	var deletecomment_count = 0;
	
	for(var e = 0 ; e < bbscomments.snapshotLength; e++)
	{
		var bbscomment = bbscomments.snapshotItem(e);
		// 発言が削除されている場合はカウントがずれるので対処
		if (bbscomment.innerText != deletetext)
		{
			var bbsforceid = bbsforceids.snapshotItem(e-deletecomment_count);
			var bbstime = bbstimes.snapshotItem(e-deletecomment_count);
			var bbsforce = bbsforces.snapshotItem(e-deletecomment_count);
			if (bbsforceid != null) {
				var user = bbsforceid.innerText;
				for (var i = 0; i < deny_users.length; i++) {
					// こっちはIDのみをチェックする
					if(user != null && user.indexOf(deny_users[i])>=0)
					{
						bbstime.style['display'] = 'none';
						bbsforce.style['display'] = 'none';
						bbsforceid.style['display'] = 'none';
						//bbscomment.style['display'] = 'none';
						bbscomment.innerText = filtertext;
					}
				}
			}
		} else {
			deletecomment_count++;
		}
	}
}
