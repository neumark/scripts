// ==UserScript==
// @name           Gmail Show Details (New)
// @namespace      http://web.mit.edu/mathmike
// @description    Always show details in the first open message of a gmail conversation.
// @include        http://mail.google.com/*
// @include        https://mail.google.com/*
// ==/UserScript==

// Most of the functions below were borrowed from Gmail Macros (New)

var SHOW_DETAILS_CLASS = "iD";

frames.js.gmonkey.load('1.0', function(gmail) {
var showDetails = function() {
        var show, i,nodes = getNodesByTagNameAndClass(gmail.getActiveViewElement(), "span", SHOW_DETAILS_CLASS);
        if (!nodes) return;
        for (i = 0; i < nodes.length; i++) {
            show = nodes[i]; //only shows details of the first available message
            if (!show) return;
            if (show.innerHTML == "show details"){
                simulateClick(show, "click");
            }
        }
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
    window.setTimeout(function() {gmail.registerViewChangeCallback(showDetails);}, 500);
});


