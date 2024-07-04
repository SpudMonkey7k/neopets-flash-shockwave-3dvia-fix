// ==UserScript==
// @name         Void Within Weekly
// @version      0.1
// @description  Show all 7 days for the weekly essence collection
// @author       SpudMonkey7k
// @match        https://www.neopets.com/tvw/rewards/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=neopets.com
// @run-at       document-start
// ==/UserScript==

(function() {
    const stylesheet = `
    .vc-arrow left,.vc-arrow right 
    {
    display: none !important;
    }
    .vc-list
    {
    width: 494.438 !important;
    }
`;


    var style = document.createElement("style");
    style.type="text/css";
    style.id="harvey_void_ui_fix";
    style.innerHTML=stylesheet;
    document.head.appendChild(style);
})();
