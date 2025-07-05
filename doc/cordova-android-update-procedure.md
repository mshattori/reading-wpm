# Cordova Androidアプリケーションのアップデート手順

## 概要

Cordova Androidアプリケーションを更新する際の手順と、発生しうる問題の解決策をまとめる。

## 事前準備

- node.js
- cordova
- Android Studio
- gradle
- JDK

## アップデート手順

1.  **ソースコードの更新:**
  - `www`ディレクトリ内のHTML、CSS、JavaScriptなどのファイルを修正します。

2.  **バージョン番号の更新:**
  - `config.xml`の`<widget>`要素の`version`属性を更新します。
  - 例: `<widget id="com.mshattori.wpmchecker" version="1.0.2" ...>`

3.  **リリースビルドの実行:**
  - 環境変数を読み込み、Android App Bundle (AAB) 形式でリリースビルドを実行します。
  - `keys` ディレクトリに必要なファイルがあることを確認します。(キーファイルやパスワードは1Passwordに保管)

    ```sh
    source android.env && cordova build android --release -- --keystore=./keys/upload-keystore.jks --storePassword=`cat keys/passwd.txt` --password=`cat keys/passwd.txt` --alias=upload --packageType=bundle
    ```

4.  **Google Play Consoleへのアップロード:**
  - ビルドが成功すると、以下のパスにAABファイルが生成されます。
      `./platforms/android/app/build/outputs/bundle/release/app-release.aab`
  - このファイルをGoogle Play Consoleにアップロードし、新しいリリースを作成します。

  製品版 > 

## デバッグビルド (APK) の作成

エミュレータや実機で動作確認を行うには、インストール可能なAPKファイルが必要です。以下のコマンドでデバッグ用のAPKファイルを生成します。

```sh
source android.env && cordova build android
```

ビルドが成功すると、以下のパスにAPKファイルが生成されます。

`./platforms/android/app/build/outputs/apk/debug/app-debug.apk`

このファイルをエミュレータにドラッグ＆ドロップするか、`adb install`コマンドでインストールします。

エミュレータはAndroid StudioのDevice Managerから作成します。


## SDKバージョンの更新が必要な場合

Google Play StoreのAPIレベル要件の変更などに伴い、SDKバージョンを更新する必要がある場合は、以下の手順を追加します。

### 1. SDKバージョンの設定

`config.xml`にターゲットAPIレベルとコンパイルSDKバージョンを指定する設定を追加または修正します。

`cordova-android`のバージョンにより、要求されるAPIレベルが変動するため、ビルド時のエラーメッセージを参考に調整が必要です。

**`config.xml`の変更箇所 (例):**
```xml
<platform name="android">
    <preference name="android-targetSdkVersion" value="35" />
    <preference name="android-compileSdkVersion" value="35" />
    <!-- icon and splash screen settings -->
</platform>
```

### 2. プラットフォームの再適用

`config.xml`の変更をネイティブプロジェクトに反映させるため、一度`android`プラットフォームを削除し、再度追加します。

```sh
cordova platform rm android && cordova platform add android
```

この後、上記の「一般的なアップデート手順」の2番から実施します。

## トラブルシューティング

アップデート作業で発生しうるエラーと解決策は以下の通りです。

1.  **`JAVA_HOME`が見つからないエラー**
  - **原因:** ビルドを実行するシェルセッションで`JAVA_HOME`環境変数が設定されていない。
  - **解決策:** `source android.env`コマンドで環境変数を読み込んでからビルドを実行する。

2.  **`checkReleaseAarMetadata`の失敗**
  - **原因:** 依存ライブラリが要求する`compileSdkVersion`と、プロジェクトの`compileSdkVersion`が一致していない。
  - **解決策:** `config.xml`の`<preference name="android-compileSdkVersion" value="..." />`を、エラーメッセージに従って適切なバージョンに設定する。

3.  **`android:attr/...` not found エラー**
  - **原因:** Androidのテーマ属性が見つからない。`compileSdkVersion`が不足している。
  - **解決策:** `cordova-android`が自動設定した`targetSdkVersion`に合わせて、`compileSdkVersion`も同じ値に引き上げる。