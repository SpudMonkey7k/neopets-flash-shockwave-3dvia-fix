// ==UserScript==
// @name         Void Within Hide completed achievements
// @version      0.1
// @description  Hides the achievements that you have completed
// @author       SpudMonkey7k
// @match        https://www.neopets.com/tvw/rewards/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=neopets.com
// @run-at       document-start
// ==/UserScript==

(function() {
    const stylesheet = `
    .plothub-achievement-item complete
    {
    display: none !important;
    }
`;


    var style = document.createElement("style");
    style.type="text/css";
    style.id="void_fix";
    style.innerHTML=stylesheet;
    document.head.appendChild(style);
})();
