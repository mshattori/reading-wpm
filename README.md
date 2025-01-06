# Reading Speed Tester

Building cordova android debug build:

```
cordova build android
```

Building cordova android release build:

```
cordova run android --release -- --keystore=./upload-keystore.jks --storePassword=`cat passwd.txt` --password=`cat passwd.txt` --alias=upload --packageType=bundle
```