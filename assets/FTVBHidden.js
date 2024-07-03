// ==UserScript==
// @name         Void Within Hide From The Very Beginning
// @version      0.1
// @description  Hides the first achievment from the plot
// @author       SpudMonkey7k
// @match        https://www.neopets.com/tvw/rewards/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=neopets.com
// @run-at       document-start
// ==/UserScript==

(function() {
    const stylesheet = `
    #PlotAchievment1
    {
    display: none !important;
    }
`;


    var style = document.createElement("style");
    style.type="text/css";
    style.id="harvey_void_ui_fix";
    style.innerHTML=stylesheet;
    document.head.appendChild(style);
})();
