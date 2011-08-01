// ==UserScript==
// @name           Activity Google Reader bookmarklet
// @namespace      http://www.peterneumark.com/activitybookmarklet
// @description    Adds an activity tag to the bookmarklet.
// @include        http://www.google.com/reader/link-frame
// @include        https://www.google.com/reader/link-frame
// ==/UserScript==
// Version 1.0
(function() {
    var getTags = function() {
            var d = new Date(), 
                strDate = d.getFullYear() + '-' + formatNumberLength(d.getMonth()+1, 2) + '-' +
                formatNumberLength(d.getDate(), 2);
            return "activity:"+strDate;
        },
        customizeWindow = function() {
            // uncheck 'add to shared items' checkbox:
            document.getElementById('share').checked = false;
            // simulate click on 'Add tags'
            simulateClick(document.getElementById('add-tags'), 'click');
            // add default tag:
            setTimeout(function() {
                document.getElementById('tags').value = getTags();
            },0);
        },
        formatNumberLength = function (num, length) {
            var r = "" + num;
            while (r.length < length) {
                r = "0" + r;
            }
            return r;
        },
        simulateClick = function(node, eventType) {
            var event = node.ownerDocument.createEvent("MouseEvents");
            event.initMouseEvent(
                eventType,
                true, // can bubble
                true, // cancellable
                node.ownerDocument.defaultView,
                1, // clicks
                50, 50, // screen coordinates
                50, 50, // client coordinates
                false, false, false, false, // control/alt/shift/meta
                0, // button,
                node);
            node.dispatchEvent(event);
        };
        // start execution here:
    customizeWindow();

}());
