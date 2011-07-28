// ==UserScript==
// @name           Gmail Show Details (New)
// @namespace      http://web.mit.edu/mathmike
// @description    Always show details in the first open message of a gmail conversation.
// @include        http://mail.google.com/*
// @include        https://mail.google.com/*
// ==/UserScript==

// from: http://erikvold.com/blog/index.cfm/2010/6/14/using-jquery-with-a-user-script
var addJQuery = function(callback) {
        var script = document.createElement("script");
        script.setAttribute("src", "http://ajax.googleapis.com/ajax/libs/jquery/1.4.2/jquery.min.js");
        script.addEventListener('load', callback
            /*function() {
            var script = document.createElement("script");
            script.textContent = "(" + callback.toString() + ")();";
            document.body.appendChild(script);
        }*/, false);
        document.body.appendChild(script);
    },
    action = function(gmail) {
        var showDetails = function() {
                var show, i,nodes = evalXPath('//img[@alt="More"]/../..', gmail.getActiveViewElement());
                if (!nodes) return;
                for (i = 0; i < /*nodes.length*/1; i++) {
                    show = nodes[i]; //only shows details of the first available message
                    if (!show) return;
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
                    show, i,nodes = evalXPath('//div[text()="Show original"]', gmail.getActiveViewElement());
                window.open = function(relurl, _dc1, _dc2) {readurl(relurl);};
                window.alert = function() {};
                if (!nodes) return;
                for (i = 0; i < /*nodes.length*/1; i++) {
                    show = nodes[i]; //only shows details of the first available message
                    if (!show) return;
                    simulateClick(show, "mousedown"); // open the drop-down menu.
                    simulateClick(show, "mouseup"); // open the drop-down menu.
                }
                window.open = oldwindowopen;
                window.alert = oldwindowalert;
        /*
                console.log("show original");
                var doxpath = function(allLinks, f) {var i = 0;for (; i < allLinks.snapshotLength; i++) {f(allLinks.snapshotItem(i));}};
                doxpath(
                    document.evaluate(
                        '//div[text()="Show original"]',
                        gmail.getActiveViewElement(),
                        null,
                        XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE,
                        null),
                    function(i) {console.log(i);});
        */
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
            getNodesByTagNameAndClass = function (rootNode, tagName, className) {
                var expression = ".//" + tagName + "[contains(concat(' ', @class, ' '), ' " + className + " ')]";
                return evalXPath(expression, rootNode);
            },
            evalXPath = function (expression, rootNode) {
                try {
                    var xpathIterator = rootNode.ownerDocument.evaluate(
                        expression,
                        rootNode,
                        null, // no namespace resolver
                        XPathResult.ORDERED_NODE_ITERATOR_TYPE,
                        null); // no existing results
                } catch (err) {
                    console.log("Error when evaluating XPath expression '" + expression + "'" + ": " + err);
                    return null;
                }
                var results = [];

                // Convert result to JS array
                for (var xpathNode = xpathIterator.iterateNext(); xpathNode; 
                        xpathNode = xpathIterator.iterateNext()) {
                    results.push(xpathNode);
                }
                return results;
            };
            // start execution here:
            window.setTimeout(function() {gmail.registerViewChangeCallback(showDetails);}, 500);
        };

frames.js.gmonkey.load('1.0', function (gmail) {
    addJQuery(function() {action(gmail);});
});

