// ==UserScript==
// @name           Gmail Show Details (New)
// @namespace      http://web.mit.edu/mathmike
// @description    Always show details in the first open message of a gmail conversation.
// @include        http://mail.google.com/*
// @include        https://mail.google.com/*
// ==/UserScript==

// from: http://erikvold.com/blog/index.cfm/2010/6/14/using-jquery-with-a-user-script
(function() {
    var // getActiveViewElement() is replaced when greasemonkey object is obtained.
        getActiveViewElement,
        addJQuery = function(callback) {
            var script = document.createElement("script");
            script.setAttribute("src", "http://ajax.googleapis.com/ajax/libs/jquery/1.4.2/jquery.min.js");
            script.addEventListener('load', callback, false);
            document.body.appendChild(script);
        },
        addButtons = function() {
            // find the 'Show original' link, and insert another link right after it:
            var i, button, currSpan, nodes = evalXPath('//span[text()="show details"]', getActiveViewElement());
            for (i = 0; i < nodes.length; i++) {
                currSpan = jQuery(nodes[i]);
                // if the next span already is a "google groups link" span, then do nothing:
                if (currSpan.next().attr('google_groups_link') === 'true') {
                    continue;
                }
                // Otherwise, insert a link.
                button = currSpan.clone();
                button.attr('google_groups_link', 'true');
                button.text('show in Groups');
                button.click(function(e) {
                    e.stopPropagation();
                    console.log('clicked');
                });
                currSpan.after(button);
                button.before(jQuery('<span> </span>')); // space between links
            }
        },
        viewChangeCallback = function() {
            addButtons();
        },
        getRawMessage = function() {
            var show, i,nodes = evalXPath('//img[@alt="More"]/../..', getActiveViewElement());
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
              success: function(data) {console.log(data.match(/Message-Id\: <(.*)>/i)[1]);},
              dataType: 'text'
            });
        },
        showOriginal = function() {
            var oldwindowopen = window.open,
                oldwindowalert = window.alert,
                show, i,nodes = evalXPath('//div[text()="Show original"]', getActiveViewElement());
            window.open = function(relurl, _dc1, _dc2) {readurl(relurl);};
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
        frames.js.gmonkey.load('1.0', function (gmObj) {
            getActiveViewElement = function () {return gmObj.getActiveViewElement();};
            window.setTimeout(function() {gmObj.registerViewChangeCallback(viewChangeCallback);}, 500);
            addJQuery(viewChangeCallback);
        });
}());
