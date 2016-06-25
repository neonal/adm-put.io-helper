// Copyright (c) 2010 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

// A generic onclick callback function.
function linkOnClick(info, tab) {
  var linkToFollow = info.linkUrl;
  console.log("Link to follow: " + linkToFollow);

  httpGetAsync("http://localhost:8082/resolve_redirection?path="+linkToFollow, function(xmlHttp){
    if(xmlHttp.readyState == 4){
      var redirected = xmlHttp.responseText;
      console.log("Redirected Url: " + redirected);
      // /downloadmaster/dm_apply.cgi?action_mode=DM_ADD&download_type=5&again=no&usb_dm_url=
      httpGetAsync("http://router.asus.com:8081/downloadmaster/dm_apply.cgi?action_mode=DM_ADD&download_type=5&again=no&usb_dm_url="+encodeURIComponent(redirected), function(xmlHttp){
        if(xmlHttp.readyState == 4){
          if(xmlHttp.status == 200 && xmlHttp.responseText == 'ACK_SUCESS'){
            console.log("Added download to queue");
            window.alert("OKKKEEEEEY ");
          } else {
            console.log("Status: " + xmlHttp.status + " responseText: " + xmlHttp.responseText);
            window.alert("An error occured");
          }
        }
      });
    }
  });
}

var id = chrome.contextMenus.create({"title": "Follow this link", "contexts":["link"],
                                       "onclick": linkOnClick});
function httpGetAsync(theUrl, callback)
{
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function() { 
      callback(xmlHttp);
    }
    xmlHttp.open("GET", theUrl, true); // true for asynchronous 
    xmlHttp.send(null);
}

document.addEventListener('copy', function(e) {
  var textToPutOnClipboard = "some text which should appear in clipboard";
  e.clipboardData.setData('text/plain', textToPutOnClipboard);
  e.preventDefault();
});