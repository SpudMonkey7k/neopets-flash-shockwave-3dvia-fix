This fix follows [themrrobert](https://github.com/themrrobert/neopets-flash-fix-windows-10)'s fix utilizing an additional step for 3Dvia. 
Do note that I only use the 32bit browser of palemoon for flash, shockwave, and 3dvia while themrrobert uses 64bit for flash and 32bit for shockwave and 3dvia. 

### Works best on a 32bit system, try a vm of 32bit windows 8.1 or windows 10 20H2 or older.

**Make sure to uninstall any previous version of Flash or Shockwave currently installed on your mashine**
> you may need to run the uninstallers as admin.
1. [Flash Uninstaller](https://fpdownload.macromedia.com/get/flashplayer/current/support/uninstall_flash_player.exe)
2. [Shockwave Uninstaller](http://fpdownload.macromedia.com/get/shockwave/uninstall/win/sw_uninstaller.exe)

## Directions
1. Download and install [Palemoon 28 32bit](https://archive.palemoon.org/palemoon/28.x/28.17.0/palemoon-28.17.0.win32.installer.exe)
> - Open palemoon and then close it to generate profile folder.
> - Make sure to disable auto updates for palemoon
2. Download and install  [Flash player](/raw/main/installers/flashplayer32_0r0_371_win.msi),  [Shockwave](/raw/main/installers/Shockwave_Installer_Full.exe), [3dvia](http://3dlifeplayer.dl.3dvia.com/player/install/installer.exe), and [Fiddler Classic](https://www.telerik.com/download/fiddler) (No email confirmation to download, so you can use a fake one)
3. Download [additional 3Dvia files](https://download-directory.github.io/?url=https://github.com/SpudMonkey7k/neopets-flash-shockwave-3dvia-fix/tree/main/3dviafiles)
4. Copy the additional 3Dvia files and paste it into your `%appdata%\Moonchild Productions\Pale Moon\Profiles\RANDOM_NAME.default` directory. RANDOM_NAME will be different for you, but you can put `%appdata%\Moonchild Productions\Pale Moon\Profiles` into the Run box and it should open up the directory containing your profile folder.
5. Copy `C:\Program Files (x86)\Pale Moon\plugins` folder and paste it into your `%appdata%\Moonchild Productions\Pale Moon\Profiles\RANDOM_NAME.default` directory. RANDOM_NAME will be different for you, but you can put `%appdata%\Moonchild Productions\Pale Moon\Profiles` into the Run box and it should open up the directory containing your profile folder.

### Fiddler
> Instructions by themrrobert.

**Installation Instructions:**

1. Find fiddler script folder (usually Documents\Fiddler2\Scripts) and save [CustomRules.js](https://github.com/themrrobert/neopets-flash-fix-windows-10/blob/main/fiddler/CustomRules.js) to that directory. Alternatively, you can copy/paste the file contents into Fiddler->Rules->Customize rules (erase everything in there first), and hit Ctrl+S to save. You should hear a slight ding.
2. In Fiddler go to Tools -> Options -> HTTPS.
> **Enable:**
> - Capture HTTPS CONNECTs
> - Decrypt HTTPS Traffic
> - Ignore Server Certificate Errors.
> 3. Click Actions->Export Root Certificate to Desktop (This is to make Pale Moon trust the localhost and not give you constant certificate errors)
> 4. Click Actions->Trust Root Certificate. This will make other browsers (like Chrome), and Windows apps such as Discord, also trust the proxy (Fiddler). *This isn't strictly necessary, but if it's not done, you won't be able to use Chrome/Discord/Etc while Fiddler is running and intercepting traffic.*
5. To install this certificate into Pale Moon, Open Pale Moon, and click the button/toolbar that says, "Pale Moon" at the top left of the browser (menu bar), and click Preferences. Then go to the "Advanced" tab, and then choose the "Certificates" sub-tab. Click "View Certificates" then click "Import" and locate the exported certificate on your desktop. It is named "FiddlerRoot.cer"
6. **Important:** Add exclusions to your proxy: In Fiddler, go to Tools->Options->Connections, and add the following into the "Bypass URLs that begin with..." field:
> <-loopback>;discord.com; discordapp.com; netflix.com; *.discord.com; *.discordapp.com; *.netflix.com; *.discordapp.net; discordapp.net; *.google.com; google.com; *.gmail.com; gmail.com; *.youtube.com; *.gstatic.com; *.cloudflare.com; *.googleapis.com; *.jquery.com; *.googlevideo.com; support.neopets.com
7. Download the [neopets folder in this project](https://download-directory.github.io/?url=https://github.com/themrrobert/neopets-flash-fix-windows-10/tree/main/neopets)
8. Find fiddler installation path (usually C:\Users\YOUR_USERNAME\AppData\Local\Programs\Fiddler or C:\Program Files\Fiddler), create a folder named "neopets" and extract the downloaded neopets.zip files into it. The extracted files should end up looking like C:\Users\YOUR_USERNAME\AppData\Local\Programs\Fiddler\neopets\games\...
9. Close Fiddler.
10. Start Fiddler whenever you want to play Neopets games :)

> **Notes:**  
> #5. You can remove this certificate later via Windows Certificate Manager (certmgr.msc->Trusted Root Certification Authorities->Certificates). The name of the certificate is DO_NOT_TRUST so that you're well aware it's a local certificate, and not from a trusted Certificate Authority (CA). It is safe to trust this certificate, BUT the implications are that you will not see any genuine certificate errors from websites, so you should keep Fiddler closed when you're not using it, and you should remove the certificate if you stop playing Neopets games.
>
> Fiddler seems to need "Capture Traffic" enabled in order to work consistently (feel free to experiment). This means it logs every packet that is proxied throuogh it. So while you can watch Youtube on Chrome while running Fiddler, you should clear out the history/restart Fiddler once in a while, otherwise it will start using up all your memory holding a copy of every video packet!

**Open Pale Moon and open the menu then select Add-ons then click on Plugins, make sure it shows all 3 plugins as active**
![Pale Moon Plugins](https://github.com/SpudMonkey7k/neopets-flash-shockwave-3dvia-fix/blob/main/assets/palemoon-plugins.png)

> Make sure that Pale Moon is certificated and that Fiddler is running when trying to play on Neopets.
