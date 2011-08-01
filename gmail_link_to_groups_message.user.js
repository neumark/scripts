// ==UserScript==
// @name           Gmail open in Groups
// @namespace      http://peterneumark.com/javascript/2011-07-29/extending-gmail-with-your-own-features/
// @description    Allows you to open messages in Google Groups.
// @include        http://mail.google.com/*
// @include        https://mail.google.com/*
// ==/UserScript==

(function() {
    var // getCurrentThread() is replaced when greasemonkey object is obtained.
        getCurrentThread,
        // from: http://erikvold.com/blog/index.cfm/2010/6/14/using-jquery-with-a-user-script
        addJQuery = function(callback) {
            var script = document.createElement("script");
            script.setAttribute("src", "http://ajax.googleapis.com/ajax/libs/jquery/1.4.2/jquery.min.js");
            script.addEventListener('load', callback, false);
            document.body.appendChild(script);
        },
        addButtons = function() {
            // find the 'Show original' link, and insert another link right after it:
            var i, button, currSpan, nodes, currThread = getCurrentThread();
            if (!currThread || !currThread.ra) return;
            nodes = evalXPath('//span[text()="show details" and not(@google_groups_link)]', currThread.ra);
            for (i = 0; i < nodes.length; i++) {
                currSpan = jQuery(nodes[i]);
                // Otherwise, insert a link.
                button = currSpan.clone();
                currSpan.attr('google_groups_link', 'true');
                button.text('show in Groups');
                button.click(function(e) {
                    var cs = currSpan;
                    e.stopPropagation();
                    // Note: class name comes from page source (may change).
                    getRawMessage(cs.parents('div.Bk:first')[0]);
                });
                currSpan.after(button);
                button.before(jQuery('<span> </span>')); // space between links
            }
        },
        viewChangeCallback = function() {
            // add buttons whenever a new email appears
            var currThread = getCurrentThread();
            if (currThread && currThread.ra) {
                jQuery('div.FL1GFc', currThread.ra).each(function() {
                    this.addEventListener("DOMSubtreeModified", function() {addButtons();});
                });
            }
            addButtons();
        },
        getRawMessage = function(parentNode) {
            var show, i,nodes = evalXPath('//img[@alt="More"]/../..', parentNode);
            for (i = 0; i < /*nodes.length*/1; i++) {
                show = nodes[i]; //only shows details of the first available message
                simulateClick(show, "click"); // open the drop-down menu.
                // click on the "show original" link
                setTimeout(showOriginal, 0);
            }
        },
        readurl = function(url) {
            jQuery.ajax({
                url: url,
                success: function(data) {
                    var messageId = data.match(/Message-Id\: <(.*)>/i)[1];
                    window.open('http://groups.google.com/groups?selm=' + messageId, "_blank", "");
                },
                dataType: 'text'
            });
        },
        showOriginal = function() {
            var oldwindowopen = window.open,
                oldwindowalert = window.alert,
                currThread = getCurrentThread(),
                show, i,nodes;
            if (!currThread || !currThread.ra) return;
            nodes = evalXPath('//div[text()="Show original"]', currThread.ra);
            window.open = function(relurl, _dc1, _dc2) {
                readurl(relurl);
                return window;
            };
            window.alert = function() {};
            for (i = 0; i < /*nodes.length*/1; i++) {
                show = nodes[i]; //only shows details of the first available message
                simulateClick(show, "mousedown"); // open the drop-down menu.
                simulateClick(show, "mouseup"); // open the drop-down menu.
            }
            window.open = oldwindowopen;
            window.alert = oldwindowalert;
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
        },
        evalXPath = function (expression, rootNode) {
            var results = [];
            try {
                var xpathIterator = rootNode.ownerDocument.evaluate(
                    expression,
                    rootNode,
                    null, // no namespace resolver
                    XPathResult.ORDERED_NODE_ITERATOR_TYPE,
                    null); // no existing results
            } catch (err) {
                console.log("Error when evaluating XPath expression '" + expression + "'" + ": " + err);
                return results;
            }

            // Convert result to JS array
            for (var xpathNode = xpathIterator.iterateNext(); xpathNode; 
                    xpathNode = xpathIterator.iterateNext()) {
                if (xpathNode !== null) {
                    results.push(xpathNode);
                }
            }
            return results;
        };
        // start execution here:
        gmonkey.load('2.0', function (gmail) {
            getCurrentThread = function () {
                return gmail.getCurrentThread();
            };
            window.setTimeout(function() {
                gmail.registerViewChangeCallback(viewChangeCallback);
            }, 500);
            addJQuery(viewChangeCallback);
        });
}());

