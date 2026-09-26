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
  - 例: `<widget id="com.mshattori.wpmchecker" version="1.0.3" ...>`

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

> 対象APIレベルを上げる前に、使用中の `cordova-android` がそのAPIレベルをサポートしているか確認します。
> 未対応の場合は、先に `cordova-android` を対応バージョンへ更新します。API設定だけを変更してもビルドできない場合があります。

最初に依存関係を更新します。

```sh
npm install
```

このコマンドにより、`package.json` で指定した依存関係と `package-lock.json` が同期されます。

### 1. SDKバージョンの設定

`config.xml`にターゲットAPIレベルとコンパイルSDKバージョンを指定する設定を追加または修正します。

`cordova-android`のバージョンにより、対応するAPIレベルと必要なBuild-Toolsのバージョンが変わります。
Cordovaの公式対応表とビルド時のエラーメッセージを参照して、対象バージョンを決めます。

**`config.xml`の変更箇所 (例):**
```xml
<platform name="android">
    <preference name="android-targetSdkVersion" value="NN" />
    <preference name="android-compileSdkVersion" value="NN" />
    <!-- icon and splash screen settings -->
</platform>
```

`NN` は採用する対象APIレベルに置き換えます。通常は `targetSdkVersion` と
`compileSdkVersion` を同じ値にします。`compileSdkVersion` は `targetSdkVersion` 以上である必要があります。

Android Studio の **デスクトップ上部のアプリメニューバー** から
**Android Studio > Settings > Languages & Frameworks > Android SDK** を開き、次をインストールします。
（プロジェクト画面内のメニューには **Tools** が表示されない場合があります。）

- **SDK Platforms**: 採用する対象APIレベルの Android SDK Platform
- **SDK Tools**: 使用する `cordova-android` が要求する Android SDK Build-Tools
- **SDK Tools**: Android SDK Command-line Tools (latest)

Build-Toolsは新しいメジャーバージョンが入っているだけでは不十分な場合があります。
SDK Manager の **Show Package Details** を有効にし、Cordovaが要求するバージョンを明示的に選択します。

### 2. プラットフォームの再適用

`config.xml`の変更をネイティブプロジェクトに反映させるため、一度`android`プラットフォームを削除し、再度追加します。

```sh
cordova platform rm android && cordova platform add android
```

> `platforms/` は生成物でGit管理対象外です。既存のプラットフォームを再生成するこの操作では、
> `config.xml`、`package.json`、`package-lock.json` は削除されません。

この後、上記の「一般的なアップデート手順」の2番から実施します。

## リリース作業

Google Play Consoleの画面構成やボタン名は変更されることがあるため、以下は特定の画面遷移ではなく、公開までの全体フローとして扱います。

### 公開までの全体フロー

1. **リリース対象を準備する**
   - バージョン番号とversionCodeが、公開済みのものより大きいことを確認します。
   - リリース用AABを作成し、実機またはエミュレータで主要機能を確認します。
   - リリースノートを用意します。Play Consoleで言語タグが必要な場合は、画面の案内に従って対象ロケールを指定します。

2. **リリーストラックを選ぶ**
   - 既存の製品版アプリを迅速に更新する場合は、製品版トラックへ直接出すことができます。
   - テスターがいる場合や変更の影響を事前確認したい場合は、内部・クローズド・オープンテストを使用します。
   - 新規の個人用デベロッパーアカウントには、製品版アクセス前にテストが必須となる場合があります。Play Consoleに表示されるアカウント要件を確認します。

3. **AABをアップロードして検証する**
   - 選択したトラックに新しいリリースを作成し、AABをアップロードします。
   - Play Consoleが認識したversionCode、バージョン名、対象SDK、サポート対象デバイスを確認します。
   - 検証結果にブロッキングエラーがないことを確認します。難読化解除ファイル未添付などの警告は、R8 / ProGuardを利用していない場合は通常対応不要です。

4. **リリース内容を確認して保存する**
   - リリースノート、配信国・地域、段階的公開の割合を確認します。
   - 変更を保存し、公開の概要に反映します。保存時点では、通常まだ審査提出・公開は完了していません。

5. **審査へ送信する**
   - 公開の概要で、未送信の変更内容が想定どおりであることを確認します。
   - Google Playの審査へ送信します。送信後は、審査状況と追加の対応依頼がないか確認します。

6. **公開と公開後の確認を行う**
   - 管理対象の公開が有効な場合は、審査承認後に明示的な公開操作が必要です。無効な場合は、承認後に自動公開される設定になっていることがあります。
   - 公開後、対象SDK要件に関する通知が解消されたこと、製品版が期待するバージョンになっていることを確認します。反映には時間がかかる場合があります。

### テストトラックを更新する場合

アクティブなテストトラックに古いAABが残っており、ポリシー要件の対象となる場合は、同じ対応済みAABをそのトラックにも割り当てます。多くの場合、先にアップロード済みのAABをライブラリから選択して再利用できるため、再ビルドや同一versionCodeの再アップロードは不要です。

テストトラックを今後利用しない場合は、Play Consoleの案内に従って一時停止または整理することも検討します。

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
