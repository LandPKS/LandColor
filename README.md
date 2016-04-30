# LandPKS Senior Project Group 2015/2016

**Team Members:**  
Christina Matteis - Lead <br />
Nick Nocella - Testing <br />
Stephen Clark- Documentation <br />
Eddie Crawford - Source Code Control/Deployment <br />
Anna Yudina- Design Lead <br /> 

## Requirements

You must have the following dependencies installed in order to run this application. **Note:** The version numbers you see are not necessarily the ones you will see but as long as you have a relatively recent version you should have no issues running the app.

- Node.js
	- Check: `node --version` -> v4.4.2
	- Check: `npm --version` -> 2.15.0
- git
	- Check: `git --verison` -> git version 2.6.4
- Cordova
	- Check: `cordova --version` -> 6.1.1
- Ionic
	- Check: `ionic --version` -> 1.7.14
- Xcode (OS X only)
- Command Line Tools (OS X only)
- Android SDK
	- It is recommended to use Android Studio to install the Android SDK and set up an Android emulator.  If you prefer not to use Android Studio refer to Androids [Command Line Guide](http://developer.android.com/tools/building/building-cmdline.html)

## Installing Dependencies (OS X)

Below is a list of the dependencies required to build and run our application and how to install them.  **Note:** Windows has no support for iOS so Windows users can ignore steps 1 and 4.

1. Xcode (OS X only)
	- You can download this from the App Store by either opening up the App Store and searching for it or by clicking [here](https://itunes.apple.com/us/app/xcode/id497799835?mt=12)
	- I recommend following the [Start Developing iOS Apps](https://developer.apple.com/library/ios/referencelibrary/GettingStarted/DevelopiOSAppsSwift/index.html?utm_source=statuscode&utm_medium=email) guide provided by Apple to ensure that Xcode has been properly installed.
	- **Note:** This download is rather large (4.87 GB) so it could take awhile depending on your connection
2. Android Studio
	- Install Apple's Java Support
		- Install: [link](https://support.apple.com/kb/DL1572?viewlocale=en_US&locale=en_US))
	- Install JDK (version 1.7 or greater)
		- Install: [link](http://www.oracle.com/technetwork/java/javase/downloads/jdk8-downloads-2133151.html)
	- Install Android Studio
		- Install: [link](http://developer.android.com/index.html)
		- I recommend following the [Build Your First App](http://developer.android.com/training/basics/firstapp/index.html) guide provided by Android to ensure Android Studio has proprely been installed.
3. Git
	- Install: [link](http://git-scm.com/downloads)
	- Check: `git --version` -> git version 2.6.4 (Apple Git-63)
4. Command Line Tools (OS X only)
	- Check: `gcc --version` -> ...Apple LLVM version 7.0.0...
	- Check: `xcode-select -p` -> /Applications/Xcode.app/Contents/Developer
5. Node.js
	- Install: [link](https://nodejs.org/en/download/)
	- Check: `node --version` -> v4.2.2
	- Check: `npm --nersion` -> 2.15.0
6. Cordova
	- Run: `sudo npm install -g cordova`
	- Check: `cordova --version` -> 6.1.1
7. Ionic
	- Run: `sudo npm install -g ionic`
	- Check: `ionic --version` -> 1.7.14

## Setting Up VM's

1. iOS
	- Run: `sudo npm install -g ios-sim`
		- This command only needs to be run once.  It allows Cordova to access the iOS simulators provided by Xcode.
2. Android
	- Open Android Studio
	- No Emulator(s) Already Installed:
		- Tools -> Android -> AVD Manager -> Nexus 5 -> Lollipop (API 21) -> Finish
	- Previous Emulators Already Installed:
		- Tools -> Android -> AVD Manager -> Create Virtual Device... -> Nexus 5 -> Lollipop (API 21) -> Finish
	- **Note:** If you do not see API 21 listed when it asks you to chose the System Image make sure you check the *Show downloadable system images* checkbox in the bottom left.

## Preparing Source Code for Running

1. Download Source Code
	- `cd` to a desired directory
	- Run: `git clone https://github.com/LandPKS/LandColor.git`
2. Install Application Components
	- Navigate to LandColor/LandColor directory
	- Reset state of application
		- `ionic state reset`
		- An error might occur trying to install `org.apache.cordova.camera`.  This happens because the backwards identifier is an old naming convention Apache used.
			- Fix: `cordova plugin add cordova-plugin-camera`

## Running LandColor Application on Emulator

1. iOS
	- Run: `ionic build ios`
	- Run: `ionic emulate ios`
		- This defaults to the iPhone 6 Plus emulator.  If you would like to specify an emulator use the `--target` flag.
			- Example: `ionic emulate ios --target=iPhone-6`
2. Android
	- Run: `ionic build android`
	- Run: `ionic emulate android`
		- If you only have one emulator installed it will default to that.  If you would like to specify the emulator use the `--target` flag.

## Running LandColor Application on Devices

1. iOS
	- Plug in iOS device to USB port
	- Launch Xcode
	- File -> Open... -> /path/to/LandColor/LandColor/platforms/ios/LandColor.xcodeproj
	- Select your device from the drop down menu
	- Press the Run button
2. Android
	- Test if `adb` is properly installed by running `adb`
		- If `adb` command is not found you need to create a PATH variable to Android’s platform-tools directory. 
			- **NOTE**: The location of the platform-tools directory can vary between machines.  On my Mac I found it in “/Users/Stephen/Library/Android/sdk/platform-tools/"
			- Navigate to your root directory
			- Run: `nano ./bash_profile`
			- Add: `export PATH=$PATH/path/to/platform-tools`
			- Type: `control-o` followed by `enter` to save the document
			- Type: `control-x` to exit back to the terminal
	- Connect your Android device to your computer using a USB port
	- Run `adb devices` to ensure your device is connected and authorized
		- If the list returned by `adb devices` is empty there is a good chance your phone is not in developer mode
			- On your phone go to *Settings -> More -> About Device*
			- Tap *Build Number* several times until it tells you that the device is in developer mode
			- Go to *Settings -> More -> Developer Options* and check *USB Debugging*
		- If the previous option has been performed correctly and has failed (still returns an empty list)
			- Disconnect device
			- run `adb kill-server`
			- run `adb start-server`
			- Reconnect device
			- Wait a few seconds and run `adb devices` again
		- If the device is recognized but says *Unauthorized*
			- Ensure your device is powered on
			- Disconnect the device and reconnect it.  A pop-up should appear on the phone asking you to authorize the computer.
	- run `ionic build android`
	- run `ionic run android`

## Licenses

**MIT:**  
Copyright (c) 2016 Christina Matteis, Nick Nocella, Stephen Clark, Eddie Crawford, Anna Yudina

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

**Background Image:**  
Image was retrieved from WikiMedia Commons