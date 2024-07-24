// ==UserScript==
// @name         Void Within Weekly
// @version      0.5
// @description  Show all 7 days for the weekly essence collection
// @author       SpudMonkey7k, b-fuze
// @match        https://www.neopets.com/tvw/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=neopets.com
// @run-at       document-start
// ==/UserScript==

(function() {
    const stylesheet = `
        #VoidCollectionTrack .vc-item {
            margin: 0.25em;
        }
        #VoidCollectionTrack .vc-list {
            width: 90%;
            flex-wrap: wrap;
            flex: 0 1 auto;
            min-width: 0;
            justify-content: center;
        }
        #VoidCollectionTrack {
            overflow: auto;
            width: 100%;
            display: flex;
            justify-content: space-around;
        }
        #VoidCollectionModule .vc-collected {
            width: auto !important;
            display: flex;
            justify-content: center;
            margin-left: 0;
            padding-right: 0;
        }
        #VoidCollectionModule .vc-collected .vc-arrow {
            display: none !important;
        }
        div.plothub-container.home.tvw div.void-collection div.vc-collected div.vc-list div.vc-item
        {
        font-size: 14pt;
        }
    `;

    var style = Object.assign(document.createElement("style"), {
        textContent: stylesheet,
    });
    document.head.appendChild(style);
})();
