// ==UserScript==
// @name           No ads on theOnion
// @namespace      http://peterneumark.com/javascript/2011-07-29/extending-gmail-with-your-own-features/
// @description    remove popup ads from theonion
// @include        http://www.theonion.com/*
// @version        1.0
// ==/UserScript==
window.addEventListener("load", function() { 
    document.getElementsByTagName('body')[0].addEventListener('DOMSubtreeModified', function() {
        document.getElementById('gregbox-wrap').parentNode.removeChild(document.getElementById('gregbox-wrap'))
        document.getElementById('gregbox-overlay').parentNode.removeChild(document.getElementById('gregbox-overlay'))
    });
});
