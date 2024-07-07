// ==UserScript==
// @name         Void Within Weekly
// @version      0.2
// @description  Show all 7 days for the weekly essence collection
// @author       SpudMonkey7k
// @match        https://www.neopets.com/tvw/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=neopets.com
// @run-at       document-start
// ==/UserScript==

(function() {
    const stylesheet = `
    .vc-arrow
    {
    display: none !important;
    }
    .vc-collected
    {
    width: 675px !important;
    margin-left: -15;
    padding-right: 25;
    }
    .vc-list
    {
    width: 535.250 !important;
    }
    div.plothub-container.home.tvw div.void-collection div.vc-collected div.vc-list div.vc-item
    {
    font-size: 14pt;
    }
`;


    var style = document.createElement("style");
    style.type="text/css";
    style.id="void_weekly_fix";
    style.innerHTML=stylesheet;
    document.head.appendChild(style);
})();
