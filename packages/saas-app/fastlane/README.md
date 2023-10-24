fastlane documentation
================
# Installation

Make sure you have the latest version of the Xcode command line tools installed:

```
xcode-select --install
```

Install _fastlane_ using
```
[sudo] gem install fastlane -NV
```
or alternatively using `brew install fastlane`

# Available Actions
## Android
### android testing
```
fastlane android testing
```
Build Android debug version
### android production
```
fastlane android production
```
Build Android release version

----

## iOS
### ios testing
```
fastlane ios testing
```
Build iOS debug version
### ios prepare
```
fastlane ios prepare
```
Prepare SaaS app
### ios keys
```
fastlane ios keys
```
Produce profiles and certificates
### ios production
```
fastlane ios production
```
Build iOS release version

----

This README.md is auto-generated and will be re-generated every time [_fastlane_](https://fastlane.tools) is run.
More information about fastlane can be found on [fastlane.tools](https://fastlane.tools).
The documentation of fastlane can be found on [docs.fastlane.tools](https://docs.fastlane.tools).
