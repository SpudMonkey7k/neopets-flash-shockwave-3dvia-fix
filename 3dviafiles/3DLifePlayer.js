/******************************************************************************/
/* 3D Life Player                                                             */
/* (for more information see http://player.virtools.com/downloads/player/update.asp */
/*                                                                            */
/* This javascript file contains a set of functions to test and install       */
/* the 3D Life Player for Microsoft Internet Explorer or Gecko based browser  */
/* (meaning Firefox 1.x, Netscape 6.1+ and Mozilla 1.x) under                 */
/* Microsoft Windows 32 bits operating system.                                */
/*                                                                            */
/* IMPORTANT REMARKS:                                                         */
/*   - To use this file you have to include before DetectBrowser.js and       */
/*   3DLifePlayer_last_version.js (found at the same place as this file).     */
/*   - The auto installation mechanism used by gecko based browser to install */
/*   - the 3D Life Player are only supported for Microsoft Windows 32bits     */
/*   at this time (see GeckoAutoInstallLast and GeckoAutoInstall).            */
/*   - The Netscape Communicator/Navigator 4.x family is no longer supported  */
/*     by Virtools.                                                           */
/******************************************************************************/


////////////////////////////////////////////////////////////////////////////////
//
// COMMON PART: part containing functions/variables independent of the browser
//
////////////////////////////////////////////////////////////////////////////////

// For more information about this variable take a look at
// "3D Life  Player Commands - Properties" page from the Virtools mini site
// in the Virtools Documentation
var allowFullScreen = true;
var allowPause = true;
var autoPlay = true;
var keepKeyboard = true;
var backColor = "";
var renderOptions = "";

var debugHtmlCodeGeneration = false;

var UserComponentServer = "";
var UserComponentList = "";
var UserComponentMediaGroup = "";

var URLPrefix = "http://3dlifeplayer.dl.3dvia.com/player/install/";

// URL which point to the 3D Life Player package to install it for
// Microsoft Internet Explorer for Microsoft Windows 32bits.
// Do not modify it if you do not know what you are doing. 

// For back-compatibility we must upload a installer named installer.exe too.
var Installer = URLPrefix + "3DVIA_player_installer.exe";
if(is_macosx)
{
	Installer = URLPrefix + "3DVIAplayer_Universal.dmg";
	if(is_macppc)
		Installer = URLPrefix + "3DVIAplayer_ppc.dmg";
	else if(is_macintel)
		Installer = URLPrefix + "3DVIAplayer_intel.dmg";
}	

// URL which point to the 3D Life Player package to install it for gecko based browser
// under Microsoft Windows 32bits.
// Do not modify it if you do not know what you are doing. 
var xpiURL = URLPrefix + "virtoolswebplayer.xpi";


// some error messages
var err_object_embed_failed = "<p>If you have any problems installing the 3DVIA player, please follow the instructions located here: <a href=\"http://dl.3dvia.com/software/3dvia-player/\">3DVIA player</a>.</p>";
var err_not_support = "<p>3D Life Player is not supported by this browser or operating system.</p>";

var Mozilla_Plugin_NotInstalled = "3D Life Player Installation Required <br><br> Click on this Image to Launch Installation Process<br><br>";				


function AutomaticReload() 
{
	navigator.plugins.refresh();
	if (!IsInstallNeeded())
  	    setTimeout('window.location.reload()', 2000);
	else		            	
		setTimeout('AutomaticReload()', 1000);
}

function RedirectMe()
{
    self.location = redirectionURL;
}

function Automaticredirectme()
{
     if(!IsInstallNeeded())
	    RedirectMe();
	else
		setTimeout('Automaticredirectme()', 1000);	
}

/*************************************************************************************************************/
/* Generate the HTML tag used to embed the 3D Life Player in a web page.                                     */
/*                                                                                                           */
/* Parameters:                                                                                               */
/*     - vmoURL: URL which point to the vmo.                                                                 */
/*     - width: width the window used by the 3D Life Player in the web page.                                 */
/*     - height: height the window used by the 3D Life Player in the web page.                               */
/*     - pluginName: name of the 3D Life Player plug-in instance.                                            */
/*                                                                                                           */
/* The HTML tag will look something like this:                                                               */
/*                                                                                                           */
/* For Microsoft Internet Explorer:                                                                          */
/* <OBJECT                                                                                                   */
/*  CLASSID="CLSID:D4323BF2-006A-4440-A2F5-27E3E7AB25F8"                                                     */
/*  ID="pluginName" WIDTH="width" HEIGHT="height"                                                            */
/*  CODEBASE="Installer#version=lastVersion_maj,lastVersion_min,lastVersion_rev,lastVersion_bld"           */
/*  <PARAM NAME="SRC" VALUE="vmoURL">                                                                        */
/*  <PARAM NAME="AllowFullScreen" VALUE="1">                                                                 */
/*  <PARAM NAME="AllowPause" VALUE="1">                                                                      */
/*  <PARAM NAME="AutoPlay" VALUE="1">                                                                        */
/*  <PARAM NAME="KeepKeyboard" VALUE="1">                                                                    */
/*  <PARAM NAME="BackColor" VALUE="backColor">                                                               */
/*  <PARAM NAME="RenderOptions" VALUE="renderOptions">                                                       */
/*  <p>3D Life Player is not supported by this browser (or operating system) or not correctly installed.</p> */
/* </OBJECT>                                                                                                 */
/*                                                                                                           */
/* For Gecko based browser:                                                                                  */
/* <EMBED TYPE="application/x-virtools" PLUGINSPAGE="geckoPluginsPage"                                       */
/*  SRC="vmoURL" WIDTH="width" HEIGHT="height" NAME="pluginName"                                             */
/*  AllowFullScreen="1"                                                                                      */
/*  AllowPause="1"                                                                                           */
/*  AutoPlay="1"                                                                                             */
/*  KeepKeyboard="1"                                                                                         */
/*  BackColor="backColor"                                                                                    */
/*  RenderOptions="renderOptions">                                                                           */
/*  <NOEMBED>                                                                                                */
/*   <p>3D Life Player is not supported by this browser (or operating system) or not correctly installed.</p>*/
/*  </NOEMBED>                                                                                               */
/* </EMBED>                                                                                                  */
/*                                                                                                           */
/* Optional parameters (AllowFullScreen, AllowPause, AutoPlay, KeepKeyboard, BackColor, RenderOptions) are   */
/* controlled by the value of the following variables:                                                       */
/*                                                                                                           */
/* var allowFullScreen = true;                                                                               */
/* var allowPause = true;                                                                                    */
/* var autoPlay = true;                                                                                      */
/* var keepKeyboard = true;                                                                                  */
/* var backColor = "";                                                                                       */
/* var renderOptions = "";                                                                                   */
/*                                                                                                           */
/* Remarks:                                                                                                  */
/*  - Installer is a global variable defined if this file. Its default value is                            */
/*    URLPrefix + "install/installer.exe".                                                                */
/*    Do not modify it if you do not know what you are doing.                                                */
/*  - lastVersion_maj, lastVersion_min, lastVersion_rev and lastVersion_bld are defined in                   */
/*    3DLifePlayer_last_version.js.                                                                          */
/*  - geckoPluginsPage is a global variable defined if this file. Its default value is                       */
/*    http://player.virtools.com/. Do not modify it if you do not know what you are doing.                   */
/*************************************************************************************************************/
function Generate3DLifePlayerHtmlTag(vmoURL,width,height,pluginName)
{
	if (is_gecko||is_macosx)
	{  
		if(IsOperatingSystemSupported())
		{
			if(IsInstallNeeded())
			{
				document.write(Mozilla_Plugin_NotInstalled);				
				document.write("<a href=\"" + Installer + "\" OnClick=\"javascript:AutomaticReload();\"><img src=\"http://3dlifeplayer.dl.3dvia.com/player/install/get3DVIAplayer.jpg\" border=\"0\"></a>\n");
		        document.write("<br><br>");                
		        return;                            
			}
			else
				Generate3DLifePlayerHtmlTag_Embed(vmoURL,width,height,pluginName);			
		}
		else
			document.write(err_not_support);
	}
	else
	{ 
		Generate3DLifePlayerHtmlTag_Object(vmoURL,width,height,pluginName,1);
	}
}


function GetGenerate3DLifePlayerHtmlTag(vmoURL,width,height,pluginName)
{
	var htmlcode = " ";
	if (is_gecko||is_macosx)
	{  
	    if(IsOperatingSystemSupported())
	    {
            if(IsInstallNeeded())
            {
				htmlcode=Mozilla_Plugin_NotInstalled + "<a href=\"" + Installer + "\" OnClick=\"javascript:AutomaticReload();\"><img src=\"http://player.virtools.com/Picts/get3DVIAplayer.jpg\" border=\"0\"></a><br><br>";                
			}	
			else 
				htmlcode = GetGenerate3DLifePlayerHtmlTag_Embed(vmoURL,width,height,pluginName);
		}
		else
			htmlcode = err_not_support;
		
	}
	else
	{ 
		htmlcode = GetGenerate3DLifePlayerHtmlTag_Object(vmoURL,width,height,pluginName,1);
	}
	
	return htmlcode;
}


function Generate3DLifePlayerHtmlTag2(vmoURL,width,height,pluginName,rescale)
{
	if (is_gecko||is_macosx) {
		Generate3DLifePlayerHtmlTag_Embed(vmoURL,width,height,pluginName);
	} else {
		Generate3DLifePlayerHtmlTag_Object(vmoURL,width,height,pluginName,rescale);
	}
}


function Get3DLifePlayerVersionFromPlugin(plugin)
{
    var description = plugin.description;
    var begin = description.indexOf("(");
    if(begin == -1) 
{
        return GeckoVirtoolsPluginVersionFromString(PLID);
    }
    var end = description.indexOf(")"); 
    begin+=1;
    return description.substr(begin,end-begin);
}

function IsOnlineVersionNewer(plugin)
{
    var description = plugin.description;
    index = description.indexOf("(");
    if(index == -1) 
    {
        return true;
    }
    index2 = description.indexOf(")");    
    version = description.substr(index+1,index2-index);
    index++;
    index2 = description.indexOf(".",index);
    var maj = description.substr(index,index2-index);
    index=index2+1;
    index2 = description.indexOf(".",index);
    var min = description.substr(index,index2-index);
    index=index2+1;
    index2 = description.indexOf(".",index);
    var zero = description.substr(index,index2-index);
    index=index2+1;
    index2 = description.indexOf(")");
    var build = description.substr(index,index2-index); 
  	if (maj< lastVersion_maj
		|| ((maj == lastVersion_maj) && (min < lastVersion_min))
		|| ((maj == lastVersion_maj) && (min == lastVersion_min) && (build < lastVersion_bld)))            
	{
        return true;
    }
    return false;
}

function IsInstallNeeded()
{
	navigator.plugins.refresh();
    var VirtoolsPlugin = GeckoVirtoolsDllHere();
    if (VirtoolsPlugin==null)
        return true;
    if(is_macosx)
        return false;
    else
        return IsOnlineVersionNewer(VirtoolsPlugin);
}

// Used by browser to redirect the browser after the installation of the plug-in.
// When you are using this script on our own website you can change this value.
var redirectionURL = "http://player.virtools.com/downloads/player/test.asp";
function Generate3DLifePlayerHtmlTagForInstall(link)
{
	var htmlCode = "";
	var redirect = false;
	
	if (is_macosx)
	{/*
		if(GeckoVirtoolsDllHere())
           redirect = true;
        else*/
           htmlCode += "<a href=\"" + Installer + "\" OnClick=\"javascript:Automaticredirectme();\">" + link + "</a>\n";		    		    		                                                                    
	}
	else if (is_win32)
	{
	    //FF users
        if(is_gecko)
        { 	
            if (IsWinSupported())
            {    
                if(IsInstallNeeded())
                {
                    htmlCode += "<a href=\"" + Installer + "\" OnClick=\"javascript:Automaticredirectme();\">" + link + "</a>\n";		    		    		                                                            
                }
                else
                    redirect = true;
            }
            else
                redirect = true;            
    	}
    	// IE users
    	else redirect = true;                    	
	}
	// there is a plugin
    if(redirect)
    {
        htmlCode += "<a href=\"" + redirectionURL + "\">" + link + "</a>\n";
    }

	if (debugHtmlCodeGeneration) {
		alert("Generate3DLifePlayerHtmlTagForInstall: html code generation\n\n" + htmlCode);
	}
	document.write(htmlCode);	
}

/******************************************************************************/
/* Display information about the 3D Life Player under Microsoft Internet      */
/* Explorer.                                                                  */
/*                                                                            */
/* The output should look something like this:                                */
/*                                                                            */
/* IE 3D Life Player Status:                                                  */
/*                                                                            */
/*     - operating system: Windows XP (win32/NT)                              */
/*     - 3D Life Player ActiveX: registered (1)                               */
/******************************************************************************/
/******************************************************************************/
/* Display information about the 3D Life Player under Gecko based browser.    */
/*                                                                            */
/* The output should look something like this:                                */
/*                                                                            */
/* Gecko 3D Life Player Status:                                               */
/*                                                                            */
/*     - operating system: Windows XP (win32/NT)                              */
/*     - XPInstall: enabled                                                   */
/*     - plugin dll: found (npvirtools.dll)                                   */
/*     - plugin name: 3D Life Player                                          */
/*     - plugin description: 3D Life Player.                                  */
/*     - plugin version (from dll): 4.0.0.33                                  */
/*     - plugin version (@virtools.com/3DLifePlayer): 4.0.0.33                */
/*     - plugin version (plugins/virtools/VirtoolsPI/): 3.5.0.32              */
/******************************************************************************/
function Display3DLifePlayerStatusHtml()
{
	var htmlCode = "";
	
	htmlCode += "<b>3D Life Player Status:</b><BR>\n";
	htmlCode += "<ul>\n";
	if (IsOperatingSystemSupported()) {
		htmlCode += "<li><b>operating system: " + OperatingSystemToStr() + "</b></li>\n";
	} else {
		htmlCode += "<li><font color='red'>operating system: unsupported (at this time) (" + OperatingSystemToStr() + ")</font></li>\n";
	}
	
	if (IsWinSupported() && is_ie4up) {
		if (!IEVirtoolsActiveXHere()) {
			htmlCode += "<li><font color='red'>3D Life Player ActiveX: not registered</font></li>\n";
		} else {
			htmlCode += "<li><b>3D Life Player ActiveX: registered</b> (" + activeXVersion + ")</li>\n";
		}
	} else if (is_safari) {
	    vplug = GeckoVirtoolsDllHere();
		if (vplug!=null) {
			htmlCode += "<li><b>plug-in dll: found (" + vplug.filename + ")</b></li>\n";	
			htmlCode += "<li><b>plug-in name: " + vplug.name + "</b></li>\n";	
			htmlCode += "<li><b>plug-in description: " + vplug.description + "</b></li>\n";	
		} else {
			htmlCode += "<li><font color='red'>plug-in dll: not found</font> (" + navigator.plugins.length + ") </li>\n";	
		}
	} else if (is_gecko) {
	    if (InstallTrigger.enabled()) {
			htmlCode += "<li><b>XPInstall: enabled</b></li>\n";	
		} else {
			htmlCode += "<li><font color='red'>XPInstall: not enabled</font></li>\n";
		}
	    vplug = GeckoVirtoolsDllHere();
		if (vplug!=null) {
			htmlCode += "<li><b>plug-in dll: found (" + vplug.filename + ")</b></li>\n";	
			htmlCode += "<li><b>plug-in name: " + vplug.name + "</b></li>\n";	
			htmlCode += "<li><b>plug-in description: " + vplug.description + "</b></li>\n";	
			str = "";
			str = Get3DLifePlayerVersionFromPlugin(vplug);
			htmlCode += "<li><b>plug-in version (from puglin): " + str + "</b></li>\n";			
		} else {
			htmlCode += "<li><font color='red'>plug-in dll: not found</font> (" + navigator.plugins.length + ") </li>\n";	
		}
		/*
		if (InstallTrigger.enabled()) {
			str = "";
			if (vplug) {
				str = GeckoVirtoolsPluginVersionFromPlugin(vplug);
				if (str==null || str=="" || str.length==0) {
					htmlCode += "<li><font color='red'>plug-in version (from dll): not found or current website not allowed to install extension</font></li>\n";
				} else {
					htmlCode += "<li><b>plug-in version (from dll): " + str + "</b></li>\n";	
				}
			}
			str = GeckoVirtoolsPluginVersionFromString(PLID);
			if (str==null || str=="" || str.length==0) {
				htmlCode += "<li><font color='red'>plug-in version (" + PLID + "): not found</font></li>\n";
			} else {
				htmlCode += "<li><b>plug-in version (" + PLID + "): " + str + "</b></li>\n";	
			}
			str = GeckoVirtoolsPluginVersionFromString(oldPLID);
			if (str==null || str=="" || str.length==0) {
				htmlCode += "<li><font color='red'>plug-in version (" + oldPLID + "): not found</font></li>\n";
			} else {
				htmlCode += "<li><b>plug-in version (" + oldPLID + "): " + str + "</b></li>\n";	
			}
		} else {
			htmlCode += "<li><font color='red'>plug-in version (from dll): XPInstall not enabled</font></li>\n";
			htmlCode += "<li><font color='red'>plug-in version (" + PLID + "): XPInstall not enabled</font></li>\n";
			htmlCode += "<li><font color='red'>plug-in version (" + oldPLID + "): XPInstall not enabled</font></li>\n";
		}
		*/
	}
	htmlCode += "</ul>\n";
	
	if (debugHtmlCodeGeneration) {
		alert("IEDisplay3DLifePlayerStatusHtml: html code generation\n\n" + htmlCode);
	}
	
	document.write(htmlCode);
}


function IsWinSupported()
{
	return (is_win32 && !is_win98);
}

function IsOperatingSystemSupported()
{
	return (IsWinSupported() || (is_macosx && (is_macppc||is_macintel)));
}

////////////////////////////////////////////////////////////////////////////////
//
// MICROSOFT INTERNET EXPLORER PART: part containing functions/variables
// only used for Microsoft Internet Explorer under Microsoft Windows 32bits.
//
////////////////////////////////////////////////////////////////////////////////

// major version of the 3D Life Player ActiveX control.
// filled when IEVirtoolsActiveXHere is called.
var activeXVersion = 0;


/******************************************************************************/
/* Used by Generate3DLifePlayerHtmlTag to generate HTML tag to embed the      */
/* 3D Life Player under Microsoft Internet Explorer for Microsoft             */
/* Windows 32 bits.                                                           */
/*                                                                            */
/* See: Generate3DLifePlayerHtmlTag.                                          */
/******************************************************************************/
function Generate3DLifePlayerHtmlTag_Object(vmoURL,width,height,pluginName,rescale)
{
	var htmlCode = "";
	if (IsWinSupported() && is_ie4up) {
		if (rescale) {
            var nScaleFactor = screen.deviceXDPI / screen.logicalXDPI;
            width = width/nScaleFactor;
            height = height/nScaleFactor;
		}
		htmlCode += "<OBJ" + "ECT\n";
		htmlCode += "  CLASSID=\"CLSID:D4323BF2-006A-4440-A2F5-27E3E7AB25F8\"\n";
		htmlCode += "  ID=\"" + pluginName + "\" WIDTH=\"" + width + "\" HEIGHT=\"" + height + "\"\n";
		htmlCode += "  CODEBASE=\"" + Installer + "#version=" + lastVersion_maj + "," + lastVersion_min + "," + lastVersion_rev + "," + lastVersion_bld + "\">\n";
		htmlCode += "  <PARAM NAME=\"SRC\" VALUE=\"" + vmoURL + "\">\n";
		
		if (allowFullScreen)
			htmlCode += "  <PARAM NAME=\"AllowFullScreen\" VALUE=\"1\">\n";
		else
			htmlCode += "  <PARAM NAME=\"AllowFullScreen\" VALUE=\"0\">\n";
			
		if (allowPause)
			htmlCode += "  <PARAM NAME=\"AllowPause\" VALUE=\"1\">\n";
		else
			htmlCode += "  <PARAM NAME=\"AllowPause\" VALUE=\"0\">\n";

		if (autoPlay)
			htmlCode += "  <PARAM NAME=\"AutoPlay\" VALUE=\"1\">\n";
		else
			htmlCode += "  <PARAM NAME=\"AutoPlay\" VALUE=\"0\">\n";

		if (keepKeyboard)
			htmlCode += "  <PARAM NAME=\"KeepKeyboard\" VALUE=\"1\">\n";
		else
			htmlCode += "  <PARAM NAME=\"KeepKeyboard\" VALUE=\"0\">\n";

		if (backColor.length)
			htmlCode += "  <PARAM NAME=\"BackColor\" VALUE=\"" + backColor + "\">\n";

		if (renderOptions.length)
			htmlCode += "  <PARAM NAME=\"RenderOptions\" VALUE=\"" + renderOptions + "\">\n";

        if((UserComponentServer.length>0) && (UserComponentList.length>0) && (UserComponentMediaGroup.length>0))
        {
	    	htmlCode += "  <PARAM NAME=\"UserComponentServer\" VALUE=\"" + UserComponentServer + "\">\n";
	    	htmlCode += "  <PARAM NAME=\"UserComponentList\" VALUE=\"" + UserComponentList + "\">\n";
	    	htmlCode += "  <PARAM NAME=\"UserComponentMediaGroup\" VALUE=\"" + UserComponentMediaGroup + "\">\n";
        }

		htmlCode += err_object_embed_failed + "\n";
		htmlCode += "</OBJ" + "ECT>\n";
	} else {
		htmlCode = err_not_support + "\n";
	}
	
	if (debugHtmlCodeGeneration) {
		alert("Generate3DLifePlayerHtmlTag_Object: html code generation\n\n" + htmlCode);
	}
	document.write(htmlCode);
}



function GetGenerate3DLifePlayerHtmlTag_Object(vmoURL,width,height,pluginName,rescale)
{
	var htmlCode = "";
	if (IsWinSupported() && is_ie4up)
	{
		if (rescale)
		{
            var nScaleFactor = screen.deviceXDPI / screen.logicalXDPI;
            width = width/nScaleFactor;
            height = height/nScaleFactor;
		}
		htmlCode += "<OBJ" + "ECT\n";
		htmlCode += "  CLASSID=\"CLSID:D4323BF2-006A-4440-A2F5-27E3E7AB25F8\"\n";
		htmlCode += "  ID=\"" + pluginName + "\" WIDTH=\"" + width + "\" HEIGHT=\"" + height + "\"\n";
		htmlCode += "  CODEBASE=\"" + Installer + "#version=" + lastVersion_maj + "," + lastVersion_min + "," + lastVersion_rev + "," + lastVersion_bld + "\">\n";
		htmlCode += "  <PARAM NAME=\"SRC\" VALUE=\"" + vmoURL + "\">\n";
		
		if (allowFullScreen)
			htmlCode += "  <PARAM NAME=\"AllowFullScreen\" VALUE=\"1\">\n";
		else
			htmlCode += "  <PARAM NAME=\"AllowFullScreen\" VALUE=\"0\">\n";
			
		if (allowPause)
			htmlCode += "  <PARAM NAME=\"AllowPause\" VALUE=\"1\">\n";
		else
			htmlCode += "  <PARAM NAME=\"AllowPause\" VALUE=\"0\">\n";

		if (autoPlay)
			htmlCode += "  <PARAM NAME=\"AutoPlay\" VALUE=\"1\">\n";
		else
			htmlCode += "  <PARAM NAME=\"AutoPlay\" VALUE=\"0\">\n";

		if (keepKeyboard)
			htmlCode += "  <PARAM NAME=\"KeepKeyboard\" VALUE=\"1\">\n";
		else
			htmlCode += "  <PARAM NAME=\"KeepKeyboard\" VALUE=\"0\">\n";

		if (backColor.length)
			htmlCode += "  <PARAM NAME=\"BackColor\" VALUE=\"" + backColor + "\">\n";

		if (renderOptions.length)
			htmlCode += "  <PARAM NAME=\"RenderOptions\" VALUE=\"" + renderOptions + "\">\n";

        if((UserComponentServer.length>0) && (UserComponentList.length>0) && (UserComponentMediaGroup.length>0))
        {
	    	htmlCode += "  <PARAM NAME=\"UserComponentServer\" VALUE=\"" + UserComponentServer + "\">\n";
	    	htmlCode += "  <PARAM NAME=\"UserComponentList\" VALUE=\"" + UserComponentList + "\">\n";
	    	htmlCode += "  <PARAM NAME=\"UserComponentMediaGroup\" VALUE=\"" + UserComponentMediaGroup + "\">\n";
        }

		htmlCode += err_object_embed_failed + "\n";
		htmlCode += "</OBJ" + "ECT>\n";
	} else {
		htmlCode = err_not_support + "\n";
	}
	
	if (debugHtmlCodeGeneration) {
		alert("Generate3DLifePlayerHtmlTag_Object: html code generation\n\n" + htmlCode);
	}
	return htmlCode;
}

/******************************************************************************/
/* Test if the 3D Life Player ActiveX control is registered and set the       */
/* value of variable "activeXVersion".                                        */
/*                                                                            */
/* Possible return value are:                                                 */
/*  true: the 3D Life Player ActiveX control is registered and               */
/*         activeXVersion has been set with the major version of the control. */
/*  false: the 3D Life Player ActiveX control is not registered and          */
/*          activeXVersion is 0.                                              */
/******************************************************************************/
function IEVirtoolsActiveXHere()
{
	if (IsWinSupported() && is_ie4up) {
		document.write(
			'<scr' + 'ipt language=VBScript>' + '\n' +
			'Function detectActiveXControl(activeXControlName, activeXControlVersion)' + '\n' +
			'    on error resume next' + '\n' +
			'    detectActiveXControl = False' + '\n' +
			'    activeXVersion = 10' + '\n' +
			'    Do While activeXVersion >= activeXControlVersion' + '\n' +
			'        On Error Resume Next' + '\n' +
            '        Dim playerObject' + '\n' +
            '        Set playerObject = CreateObject(activeXControlName & "." & activeXVersion & "")' + '\n' +
			'        detectActiveXControl =  (IsObject(playerObject))' + '\n' +
            '        playerObject = Nothing' + '\n' + 
			'        If detectActiveXControl = true Then Exit Do' + '\n' +
			'        activeXVersion = activeXVersion - 1' + '\n' +
			'    Loop' + '\n' +
			'    If detectActiveXControl = false Then activeXVersion = 0' + '\n' +
    		'End Function' + '\n' +
         '<\/sc' + 'ript>'
      );
	  
	  return detectActiveXControl("VirtoolsWebPlayerDll.VirtoolsWebPlayer",1);
	}
	
	return false;
}


////////////////////////////////////////////////////////////////////////////////
//
// GECKO PART: part containing function only used for gecko based browsers.
// It means Firefox, Mozilla, Netscape 6.1+.
// 
////////////////////////////////////////////////////////////////////////////////

// plug-in identifier specification
// (for more information: http://www.mozilla.org/projects/plugins/plugin-identifier.html)
// Do not modify it if you do not know what you are doing. 
var PLID = "@virtools.com/3DLifePlayer";
var oldPLID = "plugins/virtools/VirtoolsPI/";

// Used to fill the PLUGINSPAGE parameter of the embed html tag.
var geckoPluginsPage = "http://player.virtools.com/";

var ff_os_not_supported = "This version of the 3D Life Player is for Microsoft Windows (98/ME/2000/XP)."
//var ff_os_vista_not_supported = "This version of the 3D Life Player does not support Microsoft Windows Vista.";
var ff_browser_not_supported = "This versoin of the 3D Life Player is for Mozilla/Netscape compatible browser.";
var ff_confirm_install = "Your browser seems to be a gecko based browser not support by the 3D Life Player.\nDo You want to continue anyway ?";
var ff_xpinstall_disabled = "You must enable Software Installation to install 3D Life Player.";
var ff_ns_not_supported = "Your browser seems to be a Mozilla/Netscape compatible browser which is not supported by the 3D Life Player.";
var ff_install_failed = "3D Life Player installation failed.\nCheck your web browser security settings or browser menu bars in order to authorize the installation of 3D Life Player.";
var ff_install_reboot = "You must restart your browser to complete the 3D Life Player installtion.";
var ff_install_stoped = "Installation stoped by user. Aborting setup.";
var ff_install_failed_abord = "Installation error. Aborting.";

/******************************************************************************/
/* Used by Generate3DLifePlayerHtmlTag to generate HTML tag to embed the      */
/* 3D Life Player under Gecko based browser.                                  */
/*                                                                            */
/* See: Generate3DLifePlayerHtmlTag.                                          */
/******************************************************************************/
function Generate3DLifePlayerHtmlTag_Embed(vmoURL,width,height,pluginName)
{
	var htmlCode = "";
	
	if ((is_gecko && IsWinSupported())||is_macosx) {
		htmlCode += "<EMB" + "ED\n";
		htmlCode += "  SRC=\"" + vmoURL + "\"\n";
		htmlCode += "  TYPE=\"application/x-virtools\"\n";
		htmlCode += "  PLUGINSPAGE=\"" + geckoPluginsPage + "\"\n";
		htmlCode += "  WIDTH=\"" + width + "\" HEIGHT=\"" + height + "\"\n";
  		htmlCode += "  ID=\"" + pluginName + "\" NAME=\"" + pluginName + "\"\n";  		
  		
		if (allowFullScreen)
			htmlCode += "AllowFullScreen=\"1\"\n";
		else
			htmlCode += "AllowFullScreen=\"0\"\n";
			
		if (allowPause)
			htmlCode += "AllowPause=\"1\"\n";
		else
			htmlCode += "AllowPause=\"0\"\n";

		if (autoPlay)
			htmlCode += "AutoPlay=\"1\"\n";
		else
			htmlCode += "AutoPlay=\"0\"\n";

		if (keepKeyboard)
			htmlCode += "KeepKeyboard=\"1\"\n";
		else
			htmlCode += "KeepKeyboard=\"0\"\n";

		if (backColor.length)
			htmlCode += "BackColor=\"" + backColor + "\"\n";

		if (renderOptions.length)
			htmlCode += "RenderOptions=\"" + renderOptions + "\"\n";

        if((UserComponentServer.length>0) && (UserComponentList.length>0) && (UserComponentMediaGroup.length>0))
        {
	    	htmlCode += "UserComponentServer=\"" + UserComponentServer + "\"\n";
	    	htmlCode += "UserComponentList=\"" + UserComponentList + "\"\n";
	    	htmlCode += "UserComponentMediaGroup=\"" + UserComponentMediaGroup + "\"\n";
        }
        
   		htmlCode += ">\n";  		
        htmlCode += "  <NOEMBED>\n";  		
		htmlCode += "    " + err_object_embed_failed + "\n";  		
        htmlCode += "  </NOEMBED>\n";  		
		htmlCode += "</EMB" + "ED>\n";
	} else {
		htmlCode += err_not_support + "\n";
	}

	if (debugHtmlCodeGeneration) {
		alert("Generate3DLifePlayerHtmlTag_Embed: html code generation\n\n" + htmlCode);
	}

	document.write(htmlCode);
}


function GetGenerate3DLifePlayerHtmlTag_Embed(vmoURL,width,height,pluginName)
{
	var htmlCode = "";
	
	if ((is_gecko && IsWinSupported())||is_macosx) {
		htmlCode += "<EMB" + "ED\n";
		htmlCode += "  SRC=\"" + vmoURL + "\"\n";
		htmlCode += "  TYPE=\"application/x-virtools\"\n";
		htmlCode += "  PLUGINSPAGE=\"" + geckoPluginsPage + "\"\n";
		htmlCode += "  WIDTH=\"" + width + "\" HEIGHT=\"" + height + "\"\n";
  		htmlCode += "  ID=\"" + pluginName + "\" NAME=\"" + pluginName + "\"\n";  		
  		
		if (allowFullScreen)
			htmlCode += "AllowFullScreen=\"1\"\n";
		else
			htmlCode += "AllowFullScreen=\"0\"\n";
			
		if (allowPause)
			htmlCode += "AllowPause=\"1\"\n";
		else
			htmlCode += "AllowPause=\"0\"\n";

		if (autoPlay)
			htmlCode += "AutoPlay=\"1\"\n";
		else
			htmlCode += "AutoPlay=\"0\"\n";

		if (keepKeyboard)
			htmlCode += "KeepKeyboard=\"1\"\n";
		else
			htmlCode += "KeepKeyboard=\"0\"\n";

		if (backColor.length)
			htmlCode += "BackColor=\"" + backColor + "\"\n";

		if (renderOptions.length)
			htmlCode += "RenderOptions=\"" + renderOptions + "\"\n";

        if((UserComponentServer.length>0) && (UserComponentList.length>0) && (UserComponentMediaGroup.length>0))
        {
	    	htmlCode += "UserComponentServer=\"" + UserComponentServer + "\"\n";
	    	htmlCode += "UserComponentList=\"" + UserComponentList + "\"\n";
	    	htmlCode += "UserComponentMediaGroup=\"" + UserComponentMediaGroup + "\"\n";
        }
        
   		htmlCode += ">\n";  		
        htmlCode += "  <NOEMBED>\n";  		
		htmlCode += "    " + err_object_embed_failed + "\n";  		
        htmlCode += "  </NOEMBED>\n";  		
		htmlCode += "</EMB" + "ED>\n";
	} else {
		htmlCode += err_not_support + "\n";
	}

	if (debugHtmlCodeGeneration) {
		alert("Generate3DLifePlayerHtmlTag_Embed: html code generation\n\n" + htmlCode);
	}

	return htmlCode;
}


/******************************************************************************/
/* Auto install the plug-in last version with XPInstall (gecko).              */
/*                                                                            */
/* The function return a boolean:                                             */
/*   true: if something was installed.                                        */
/*   false: if nothing was installed.                                         */
/*                                                                            */
/* This function use lastVersion_maj, lastVersion_min, lastVersion_rev        */
/* and lastVersion_bld are defined in 3DLifePlayer_last_version.js so you     */
/* include it before using this file.                                         */
/******************************************************************************/
function GeckoAutoInstallLast()
{
  return GeckoAutoInstall(lastVersion_maj,lastVersion_min,lastVersion_rev,lastVersion_bld);
}

/******************************************************************************/
/* Test if the system and the browser are compatible to install the plug-in   */
/* using XPInstall.                                                           */
/* Possible return value are:                                                 */
/*  0: the system or the browser is not compatible.                           */
/*  1: gecko browser detected (netscape 6+, mozilla, firefox)                 */
/*                                                                            */
/* If 0 is returned an alert box is displayed.                                */
/******************************************************************************/
function GeckoTestSystem()
{
  // this script only supports windows plateform
  if (!IsWinSupported()) {
    alert(ff_os_not_supported);
    return 0;
  }

  // we only support gecko based browser (netscape navigator 4.x (x >= 5) is no longer supported)
  // it means:
  //  - netscape 6.1+ & 7.x
  //  - mozilla 1.x
  //  - firefox 1.X
  if (!is_gecko) {
    alert(ff_browser_not_supported);
    return 0;
  }
  
  // here we check the navigator is able to install software
  // the method used depend on the browser type: navigator or gecko
  
  // gecko version
  if (is_gecko) {
    // check it is a known gecko browser
    if (!(is_nav6up || is_moz || is_fx)) {
      if (!confirm(ff_confirm_install)) {
        return 0;
      }
    }
    
    // is XPInstall enable ?
    if (!InstallTrigger.enabled()) {
      alert(ff_xpinstall_disabled);
      return 0;
    }
    return 1;
  }
  	
  // navigator version no longer supported
  	
  // here the browser should be a navigator not gecko compatible
  alert(ff_ns_not_supported);
  return 0;
}

/******************************************************************************/
/* Return non null value if the npvirtools.dll has been loaded by firefox.    */
/*                                                                            */
/* It means the 3D Life Player plug-in dll (npvirtools.dll) is present in the */
/* plugin directory (or any alternative directory) of the browser.            */
/*                                                                            */
/* The object return is a plug-in from the navigator.plugins array.           */
/******************************************************************************/
function GeckoVirtoolsDllHere()
{
  // here we go through the plug-in loaded by the bowser
  // to look for the virtools one.
  
  for(i=0;i<navigator.plugins.length;i++) {
    // the current plug-in
    myplug = navigator.plugins[i];
    
    // first we check the name of the plug-in
    index = myplug.filename.lastIndexOf('\\');
    if (index!=-1) {
      sub = myplug.filename.substring(index+1,myplug.filename.length);
      if (sub.toLowerCase().indexOf("npvirtools")!=0) {
        continue;
      }
    } else if (myplug.filename.toLowerCase().indexOf("npvirtools")!=0) {
      continue;
    }
    
    // now we check the mime type supported by the plug-in  
    for(j=0;j<myplug.length;j++) {
      if(myplug[j].type=='application/x-virtools' || myplug[j].type=='application/x-nemo') {
        return myplug;
      }
    }
    
  }
  	
  // the plug-in has not been found
  return null;
}

/******************************************************************************/
/* Return the version of the plug-in using a plugin object                    */
/* (the one returned by GeckoVirtoolsDllHere).                                */
/*                                                                            */
/* Return null if the plug-in is not registered. Else an InstallVersion       */
/* object which string representation is something like "4.0.0.26"            */
/* (see XPInstall API Reference)                                              */
/******************************************************************************/
function GeckoVirtoolsPluginVersionFromPlugin(plugin)
{
  if (plugin.description.indexOf("Virtools Web Player")==0) {
	return InstallTrigger.getVersion(oldPLID);
  }
  return InstallTrigger.getVersion(PLID);
}

/******************************************************************************/
/* Return the version of the plug-in using a PLID (as a string)               */
/* (the one returned by GeckoVirtoolsDllHere).                                */
/*                                                                            */
/* Return null if the plug-in is not registered. Else an InstallVersion       */
/* object which string representation is something like "4.0.0.26"            */
/* (see XPInstall API Reference)                                              */
/*                                                                            */
/* Before the Virtools plug-in became the 3D Life Player, its PLID was        */
/* "plugins/virtools/VirtoolsPI/" (see oldPLID). Now its PLID is              */
/* "@virtools.com/3DLifePlayer" (see PLID).                                   */
/******************************************************************************/
function GeckoVirtoolsPluginVersionFromString(plid)
{
  return InstallTrigger.getVersion(plid);
}

/******************************************************************************/
/* Test if the plug-in is present on the system.                              */
/*                                                                            */
/* Parameters:                                                                */
/*    - maj: major part of the version to be used to test if the plug-in is   */
/*      installed.                                                            */
/*    - min: minor part of the version to be used to test if the plug-in is   */
/*      installed.                                                            */
/*    - rev: revision part of the version to be used to test if the plug-in is*/
/*      installed.                                                            */
/*    - bld: build part of the version to be used to test if the plug-in is   */
/*      installed.                                                            */
/*                                                                            */
/* The function return an integer:                                            */
/*   0: if the system is not ready to use the plug-in                         */
/*       (in this case an alert box is displayed).                            */
/*       (see GeckoTestSystem).                                               */
/*   1: if the plug-in dll is not installed on the system.                    */
/*   2: if the plug-in dll is installed on the system but not                 */
/*       register with XPInstall.                                             */
/*   3: if the plug-in dll is registered with XPInstall but the               */
/*       version is lesser than the current.                                  */
/*   4: all is ok.                                                            */
/******************************************************************************/
function GeckoTestNPVirtools(maj,min,rev,bld)
{
  // the system or browser is not ok
  if (!GeckoTestSystem()) {
    return 0;
  }

  // cannot find npvirtools.dll in the plugins loaded by the browser
  if (GeckoVirtoolsDllHere()==null) {
    return 1;
  }

  if (is_gecko) {
    // gecko browser
    
    // compare the the version needed with the current version
    ver = InstallTrigger.compareVersion(PLID,maj,min,rev,bld);

    switch(ver) {
      // component not present or not registered
      case -5:
        return 2;
        break;
 	
      // current version as a smaller (earlier) build number than the needed version
      case -1:
      // current version as a smaller (earlier) release number  than the needed version
      case -2:
      // current version as a smaller (earlier) minor number than the needed version
      case -3:
      // current version as a smaller (earlier) major number than the needed version
      case -4:
        return 3;
        break;
 		
      // the versions are the same	
      case 0:
      case 1:
      // current version as a larger (newer) build number than the needed version
      case 2:
      // current version as a larger (newer) release number than the needed version
      case 3:
      // current version as a larger (newer) minor number than the needed version
      case 4:
      // current version as a larger (newer) major number than the needed version
        return 4;
        break;
    }

    // unknow return value
    // component not present or not registered
    return 2;
  }
  
  // navigator browser no longer supported.
  
  return 0;
}

/******************************************************************************/
/* Install the plug-in with XPInstall (gecko).                                */
/* If the current version of the plug-in is 4.0.0.26 call                     */
/* SmartPluginInstall(4,0,0,26).                                              */
/*                                                                            */
/* Parameters:                                                                */
/*   - maj (integer)      : The major version number.                         */
/*   - min (integer)      : Minor version number.                             */
/*   - rev (integer)      : Revision number.                                  */
/*   - bld (integer)      : Build number.                                     */
/*                                                                            */
/* The function return an integer :                                           */
/*   0 : if the system is not ready to use the plug-in (in this case an alert */
/*       box is displayed).                                                   */
/*   1 : the installation failed (an alert box is displayed)                  */
/*   2 : the plug-in will be installed.                                       */
/******************************************************************************/
function GeckoSmartPluginInstall(maj,min,rev,bld)
{
  // test the system
  if(!GeckoTestSystem()) {
    return 0;
  }

  if (is_gecko) {
    // gecko browser

    // build the xpi url
    var xpi = {'3D Life Player installation':xpiURL};
    
    // start the installation
    if (!InstallTrigger.install(xpi,GeckoVWPICallback)) {
      alert(ff_install_failed);
      return 1;
    }
    return 2;
  }
  
  // navigator browser no longer supported.
  
  return 0;
}

/******************************************************************************/
/* Auto install the plug-in with XPInstall (gecko).                           */
/* If the current version of the plug-in is 4.0.0.26 call                     */
/* AutoInstall(4,0,0,26).                                                     */
/* Auto installing means SmartPluginInstall is called only if needed.         */
/*                                                                            */
/* Parameters:                                                                */
/*   - maj (integer)      : The major version number.                         */
/*   - min (integer)      : Minor version number.                             */
/*   - rev (integer)      : Revision number.                                  */
/*   - bld (integer)      : Build number.                                     */
/*                                                                            */
/* The function return an integer :                                           */
/*   true  : if something was installed.                                      */
/*   false : if nothing was installed.                                        */
/******************************************************************************/
function GeckoAutoInstall(maj,min,rev,bld)
{
  // install the plug-in depending on the value returned by TestNPVirtools.
  switch(GeckoTestNPVirtools(maj,min,rev,bld))
  {
    // the system is not ok
    case 0 :
      return false;
      break;

    // the plug-in is already installed with the good version
    case 4 :
      if (redirectionURL.length>0) {
        self.location = redirectionURL;
      }
      return false;
      break;

    // the plug-in is installed but not registered	
    case 2 :
      if (confirm("3D Life Player is installed but not registered in your browser.\nDo you want to install through Automatic Install (recommended)?")) {
        if (GeckoSmartPluginInstall(maj,min,rev,bld)!=2) {
          return false;
        }
        return true;
      }

      if (redirectionURL.length>0) {
        self.location = redirectionURL;
      }
      return false;
      break;

    // the plug-in is installed and registered with an older version
    case 3 :
      if (confirm("3D Life Player is installed but newer version available.\nDo you want to install it (recommended)?")) {
        if (GeckoSmartPluginInstall(maj,min,rev,bld)!=2) {
          return false;
        }
        return true;
      }

      if (redirectionURL.length>0) {
        self.location = redirectionURL;
      }
      return false;
      break;

    // the plug-in is not installed nor registered
    case 1 :
    default:
      if (GeckoSmartPluginInstall(maj,min,rev,bld)!=2) {
        return false;
      }
      return true;
      break;
  }

  return false;
}

/******************************************************************************/
/* Control the behavior of the installation process under gecko based browser.*/
/* The main goal is to display error message in dialog box or to redirect the */
/* browser to a new web page when the installation is done. The redirection is*/
/* done using the value of redirectionURL.                                    */
/*                                                                            */
/* If you want to modifiy the value of "redirectionURL" you can do it like    */
/* this:                                                                      */
/*                                                                            */
/* <script language="JavaScript">                                             */
/*	if (is_gecko) {                                                           */
/*		redirectionURL = "http://www.website.com/mygame.html";                */
/*		document.write("<a name=\"install\"></a>");                           */
/*		document.write("<a href=\"#install\" OnClick=\"javascript:GeckoAutoInstallLast();\"><img src=\"..\\install_now.gif\" width=\"110\" height=\"26\" border=\"0\" alt=\"Click the button to begin installation.\"></a>"); */
/*    } else {                                                                */
/*		document.write("<a href=\"http://www.website.com/mygame.html\"><img src=\"..\\install_now.gif\" width=\"110\" height=\"26\" border=\"0\" alt=\"Click the button to begin installation.\"></a>"); */
/*	}                                                                         */
/* </script>                                                                  */
/******************************************************************************/
function GeckoVWPICallback(url,status)
{
  if (status==0) {
   if (redirectionURL.length>0) {
        setTimeout("window.location='" + redirectionURL + "'",1);
    }
  } else if(status==999) {
    setTimeout("alert('" + ff_install_reboot + "')",1);
  } else if(status==-210) {
    setTimeout("alert('" + ff_install_stoped + "')",1);
  } else {
    setTimeout("alert('" + ff_install_failed_abord + "')",1);
  }
}

////////////////////////////////////////////////////////////////////////////////
//
// ALL BROWSER DEBUG PART
//
////////////////////////////////////////////////////////////////////////////////

function DisplayBrowserInfo()
{
	var htmlCode = "";

	htmlCode += "<b>Browser Version</b><BR>\n";
	if (is_nav) {
		htmlCode += "nav:" + is_nav + "<BR>\n";
		if (is_nav2) {
			htmlCode += "nav2:" + is_nav2 + "<BR>\n";
		}
		if (is_nav3) {
			htmlCode += "nav3:" + is_nav3 + "<BR>\n";
		}
		if (is_nav4) {
			htmlCode += "nav4:" + is_nav4 + "<BR>\n";
		}
		if (is_nav4up) {
			htmlCode += "nav4up:" + is_nav4up + "<BR>\n";
		}
		if (is_nav5) {
			htmlCode += "nav5:" + is_nav5 + "<BR>\n";
		}
		if (is_nav5up) {
			htmlCode += "nav5up:" + is_nav5up + "<BR>\n";
		}
		if (is_nav6) {
			htmlCode += "nav6:" + is_nav6 + "<BR>\n";
		}
		if (is_nav6up) {
			htmlCode += "nav6up:" + is_nav6up + "<BR>\n";
		}
		if (is_nav7) {
			htmlCode += "nav7:" + is_nav7 + "<BR>\n"; 
		}
		if (is_nav7up) {
			htmlCode += "nav7up:" + is_nav7up + "<BR>\n";
		}
		if (is_nav8) {
			htmlCode += "nav8:" + is_nav8 + "<BR>\n"; 
		}
		if (is_nav8up) {
			htmlCode += "nav8up:" + is_nav8up + "<BR>\n";
		}
	}

	if (is_ie) {
		htmlCode += "ie:" + is_ie + "<BR>\n";
		if (is_ie3) {
			htmlCode += "ie3:" + is_ie3 + "<BR>\n";
		}
		if (is_ie4) {
			htmlCode += "ie4:" + is_ie4 + "<BR>\n";
		}
		if (is_ie4up) {
			htmlCode += "ie4up:" + is_ie4up + "<BR>\n";
		}
		if (is_ie5) {
			htmlCode += "ie5:" + is_ie5 + "<BR>\n";
		}
		if (is_ie5up) {
			htmlCode += "ie5up:" + is_ie5up + "<BR>\n";
		}
		if (is_ie5_5) {
			htmlCode += "ie5_5:" + is_ie5_5 + "<BR>\n";
		}
		if (is_ie5_5up) {
			htmlCode += "ie5_5up:" + is_ie5_5up + "<BR>\n";
		}
		if (is_ie6) {
			htmlCode += "ie6:" + is_ie6 + "<BR>\n";
		}
		if (is_ie6up) {
			htmlCode += "ie6up:" + is_ie6up + "<BR>\n";
		}
		if (is_ie7) {
			htmlCode += "ie7:" + is_ie7 + "<BR>\n";
		}
		if (is_ie7up) {
			htmlCode += "ie7up:" + is_ie7up + "<BR>\n";
		}
	}

	if (is_aol) {
		htmlCode += "aol:" + is_aol + "<BR>\n";
		if (is_aol3) {
			htmlCode += "aol3:" + is_aol3 + "<BR>\n";
		}
		if (is_aol4) {
			htmlCode += "aol4:" + is_aol4 + "<BR>\n";
		}
		if (is_aol5) {
			htmlCode += "aol5:" + is_aol5 + "<BR>\n";
		}
		if (is_aol6) {
			htmlCode += "aol6:" + is_aol6 + "<BR>\n";
		}
		if (is_aol7) {
			htmlCode += "aol7:" + is_aol7 + "<BR>\n";
		}
		if (is_aol8) {
			htmlCode += "aol8:" + is_aol8 + "<BR>\n";
		}
	}
	
	if (is_opera) {
		htmlCode += "opera:" + is_opera + "<BR>\n";
		if (is_opera2) {
			htmlCode += "opera2:" + is_opera2 + "<BR>\n";
		}
		if (is_opera3) {
			htmlCode += "opera3:" + is_opera3 + "<BR>\n";
		}
		if (is_opera4) {
			htmlCode += "opera4:" + is_opera4 + "<BR>\n";
		}
		if (is_opera5) {
			htmlCode += "opera5:" + is_opera5 + "<BR>\n";
		}
		if (is_opera5up) {
			htmlCode += "opera5up:" + is_opera5up + "<BR>\n";
		}
		if (is_opera6) {
			htmlCode += "opera6:" + is_opera6 + "<BR>\n";
		}
		if (is_opera6up) {
			htmlCode += "opera6up:" + is_opera6up + "<BR>\n";
		}
		if (is_opera7) {
			htmlCode += "opera7:" + is_opera7 + "<BR>\n";
		}
		if (is_opera7up) {
		htmlCode += "opera7up:" + is_opera7up + "<BR>\n";
		}
	}

	if (is_safari) {
        htmlCode += "safari:" + is_safari + "<BR>\n";
	}

	if (is_konq) {
        htmlCode += "konqueror:" + is_konq + "<BR>\n";
	}

    if (is_gecko) {
        htmlCode += "Gecko based: " + is_gecko + "<BR>\n";
        htmlCode += "Gecko build: " + is_gver + "<BR>\n";
    }

	if (is_moz) {
		htmlCode += "mozilla (guessing): " + is_moz + "<BR>\n";
		htmlCode += "mozilla version (guessing): " + is_moz_ver + "<BR>\n";
	}

    if (is_fb) {
        htmlCode += "<P>firebird: " + is_fb + "<BR>\n";
		htmlCode += "firebird version: " + is_fb_ver + "<BR>\n";
    }

	if (is_fx) {
		htmlCode += "firefox: " + is_fx + "<BR>\n";
		htmlCode += "firefox version: " + is_fx_ver + "<BR>\n";
	}

	if (is_webtv) {
		htmlCode += "webtv:" + is_webtv + "<BR>\n";
	}
	
	if (is_hotjava) {
		htmlCode += "hotjava:" + is_hotjava + "<BR>\n";
		htmlCode += "hotjava3:" + is_hotjava3 + "<BR>\n";
		htmlCode += "hotjava3up:" + is_hotjava3up + "<BR>\n";
	}
	
	if (is_TVNavigator) {
		htmlCode += "AOL TV(TVNavigator):" + is_TVNavigator + "<BR>\n";
	}

	htmlCode += "<BR><b>Navigator Object Data</b><BR>\n";
	htmlCode += "navigator.appCodeName: " + navigator.appCodeName + "<BR>\n";
	htmlCode += "navigator.appName: " + navigator.appName + "<BR>\n";
	htmlCode += "navigator.appVersion: " + navigator.appVersion + "<BR>\n";
	htmlCode += "navigator.userAgent: " + navigator.userAgent + "<BR>\n";
	htmlCode += "navigator.platform: " + navigator.platform + "<BR>\n";
	htmlCode += "navigator.javaEnabled(): " + is_java + "<BR>\n";

	htmlCode += "<BR><b>Version Number</b><BR>\n";
	if (is_opera) {
		htmlCode += "***Version numbers here are only valid</TT><BR>\n";
		htmlCode += "***if Opera is set to identify itself as Opera</TT><BR>\n";
		htmlCode += "***use is_opera vars instead</TT><BR>\n";
	}
	htmlCode += "major version number: " + is_major + "</TT><BR>\n";
	htmlCode += "major/minor version number: " + is_minor + "</TT><BR>\n";
	
	htmlCode += "<BR><b>OS</b><BR>\n";
	if (is_win) {
		htmlCode += "win:" + is_win + "<BR>\n";
		if (is_win16) {
			htmlCode += "win16:" + is_win16 + "<BR>\n";
		}
		if (is_win31) {
			htmlCode += "win31:" + is_win31 + "<BR>\n";
		}
		if (is_win32) {
			htmlCode += "win32:" + is_win32 + "<BR>\n";
		}
		if (is_win64) {
			htmlCode += "win64:" + is_win64 + "<BR>\n";
		}
		if (is_win95) {
			htmlCode += "win95:" + is_win95 + "<BR>\n";
		}
		if (is_win98) {
			htmlCode += "win98:" + is_win98 + "<BR>\n";
		}
		if (is_winme) {
			htmlCode += "winme:" + is_winme + "<BR>\n";
		}
		if (is_winnt) {
			htmlCode += "winnt:" + is_winnt + "<BR>\n";
		}
		if (is_win2k) {
			htmlCode += "win2k:" + is_win2k + "<BR>\n";
		}
		if (is_winxp) {
			htmlCode += "winxp:" + is_winxp + "<BR>\n";
		}
		if (is_winvista) {
			htmlCode += "winvista:" + is_winvista + "<BR>\n";
		}
	}

	if (is_mac) {
		htmlCode += "mac:" + is_mac + "<BR>\n";
		if (is_macosx) {
			htmlCode += "macosx:" + is_macosx + "<BR>\n";
		}
		if (is_mac68k) {
			htmlCode += "mac68k:" + is_mac68k + "<BR>\n";
		}
		if (is_macppc) {
			htmlCode += "macppc:" + is_macppc + "<BR>\n";
		}
		if (is_macintel) {
			htmlCode += "macintel:" + is_macintel + "<BR>\n";
		}
	}

	if (debugHtmlCodeGeneration) {
		alert("DisplayBrowserInfo: html code generation\n\n" + htmlCode);
	}
	
	document.write(htmlCode);
}

function OperatingSystemToStr()
{
	os_str = "";
	if (is_win) {
		if (is_win16) {
			return "Windows 16 bits";
		}
		if (is_win31) {
			return "Windows 3.1";
		}
		if (is_win32) {
			os_str = "Windows (win32)";
		} else if (is_win64) {
			os_str = "Windows (win64)";
        }
        
		if (is_win95) {
			if (is_win32) {
				os_str = "Windows 95 (win32)";
			} else {
				os_str = "Windows 95";
			}
		}
		if (is_win98) {
			if (is_win32) {
				os_str = "Windows 98 (win32)";
			} else {
				os_str = "Windows 98";
			}
		}
		if (is_winme) {
			if (is_win32) {
				os_str = "Windows ME (win32)";
			} else {
				os_str = "Windows ME";
			}
		}
		if (is_winnt) {
			if (is_win32) {
				os_str = "Windows NT (win32)";
			} else {
				os_str = "Windows NT";
			}
		}
		if (is_win2k) {
			if (is_win32) {
				if (is_winnt) {
					os_str = "Windows 2K (win32/NT)";
				} else {
				os_str = "Windows 2K (win32)";
				}
			} else {
				if (is_winnt) {
					os_str = "Windows 2K (NT)";
				} else {
				os_str = "Windows 2K";
				}
			}
		}
		if (is_winxp) {
			if (is_win32) {
				if (is_winnt) {
					if (is_win64) {
						os_str = "Windows XP (win64/NT)";
					} else {
						os_str = "Windows XP (win32/NT)";
					}
				} else if (is_win64) {
					os_str = "Windows XP (win64)";
				} else {
					os_str = "Windows XP (win32)";
				}
			} else {
				if (is_winnt) {
					os_str = "Windows XP (NT)";
				} else {
				os_str = "Windows XP";
				}
			}
		}
		if (is_winvista) {
			if (is_win32) {
				if (is_winnt) {
					if (is_win64) {
						os_str = "Windows Vista (win64/NT)";
					} else {
						os_str = "Windows Vista (win32/NT)";
					}
				} else if (is_win64) {
					os_str = "Windows Vista (win64)";
				} else {
					os_str = "Windows Vista (win32)";
				}
			} else {
				if (is_winnt) {
					os_str = "Windows Vista (NT)";
				} else {
				os_str = "WindowsVista";
				}
			}
		}
		
		if (is_win32) {
			if (is_win64) {
				if (os_str=="Windows (win64)") {
					os_str = "Windows (win64) : unknown version"
				}
			} else if (os_str=="Windows (win32)") {
				os_str = "Windows (win32) : unknown version"
			}
		} else if (os_str=="") {
			os_str = "Windows  : unknown version"
		}	
		return os_str;
	}

	if (is_mac) {
		if (is_mac68k) {
			if (is_macosx) {
				return "Mac OS X (68k)";
			} else {
				return "Mac OS (68k)";
			}
		} else if (is_macppc) {
			if (is_macosx) {
				return "Mac OS X (PPC)";
			} else {
				return "Mac OS (PPC)";
			}
		} else if (is_macintel) {
			if (is_macosx) {
				return "Mac OS X (Intel)";
			} else {
				return "Mac OS (Intel)";
			}
		} else if (is_macosx) {
			return "Mac OS X";
		} else {
			return "Mac OS";
		}
	}

	return "Unknown (unixes ???)";
}


