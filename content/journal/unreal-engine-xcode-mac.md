+++
title = 'How to setup Xcode 26.x with Unreal Engine 5.5'
date = '2026-03-28T15:12:45Z'
draft = true
hideReply = true
+++

#### Overview

Out of the box Unreal Engine 5.5 will not compile C++ projects on Mac with Xcode 26.

#### 🛠️ Prerequisites

- Unreal Engine 5.5
- Xcode 26.x
- Metal Toolchain
- A C++ project (Blueprint-only projects are unaffected)

#### ⚠️ Problem

When trying to compile you'll likely see something similar to.

```
Platform Mac is not a valid platform to build. Check that the SDK is installed properly and that you have the necessary platform support files (DataDrivenPlatformInfo.ini, SDK.json, etc).
```

The clue here is in the line "necessary platform support files". The `Apple_SDK.json` config file bundled with the Engine has a "MaxVersion" field which caps the Xcode version UE will accept, fortunately we can override this!

#### Solution

The file in question can be found here.
```
/Engine/Config/Apple/Apple_SDK.json
```

You can inspect the files contents in a terminal using.
``` bash
cat "/Users/Shared/Epic Games/UE_5.5/Engine/Config/Apple/Apple_SDK.json"
```

You'll see something in similar to.
```
// Xcode versions
"MainVersion": "15.2",
"MinVersion": "15.2.0",
"MaxVersion": "16.9.0",
```

Change `MaxVersion` to cover the Xcode version you're using.
```
"MaxVersion": "26.3.0",
```

There's a helpful note from the developers here just below MaxVersion.
```
 // NOTE: If you update the MaxVersion, double check the AppleVersionToLLVMVersion array below!!!
```

We can check our currently installed LLVM version with.
``` bash
clang --version
```

This gives us.
``` bash
Apple clang version 17.0.0 (clang-1700.6.4.2)
Target: arm64-apple-darwin25.3.0
Thread model: posix
InstalledDir: /Applications/Xcode.app/Contents/Developer/Toolchains/XcodeDefault.xctoolchain/usr/bin
```

Xcode 26 ships with clang 17.0.0, which maps to LLVM 17.0.6. This is already included in the `AppleVersionToLLVMVersions` array so this can be left as is.

#### Reopening an 

If you want to open the same project after you've made this change you will need to delete the Intermediate and Binaries folders. To do this `cd` to the project folder (mine is called MyProject) and then use the command below.

cd "/Users/kieran/Documents/Unreal Projects/MyProject"
rm -rf Intermediate Binaries

When reopening the .uproject you will see a warning

```
Missing MyProject Modules

The following modules are missing or built with a different engine version:

MyProject

Would you like to rebuild them now?
```

Click Yes/Okay and away you go

> **Heads up:** This is an unofficial workaround — Epic hasn't patched UE 5.5 for Xcode 26 support. For most projects it works fine, but you may hit compiler issues on more complex codebases. The same fix also applies to UE 5.6 and 5.7.

#### Verify Xcode is setup

``` bash
xcode-select -p
```
`/Applications/Xcode.app/Contents/Developer`

#### Check Xcode version

`xcodebuild -version`

#### Install the Metal toolchain

Xcode -> Settings `⌘,` -> Components -> Metal Toolchain 26.3 (17C7003j) [com.apple.MobileAsset.MetalToolchain: 17.0 (17C7003j)] (Installed)