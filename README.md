# WPM Checker

## アプリケーションの説明

このアプリケーションは「WPM Checker」と呼ばれ、ユーザーがテキストを入力し、その読み取り速度を測定するためのツールです。

このリポジトリは、Github Pagesとして公開可能なウェブアプリケーションであるとともに、Cordovaを利用してAndroidアプリケーションとしてもビルドすることができます。

以下は、このアプリケーションの主要な機能とその動作についての説明です。

### 主な機能

1. **テキスト入力**:
   - ユーザーはテキストエリアにテキストを入力または貼り付けることができます。

2. **テキスト表示**:
   - 「Save」ボタンを押すと、入力されたテキストが表示用のディビジョンに移され、テキストエリアは非表示になります。
   - テキストの保存後、「Start」ボタンが有効になります。

3. **読み取り速度測定**:
   - 「Start」ボタンを押すと読み取りテストが開始され、もう一度押すとテストが終了します。
   - 終了後、経過時間と単語数に基づいて、読み取り速度（WPM：Words Per Minute）が計算されます。

4. **結果表示**:
   - テスト終了後、結果が画面上に表示されます。
   - Cordovaが利用可能な場合、ダイアログボックスで結果が表示されます。

5. **テストのキャンセルとクリア**:
   - 「Clear」ボタンを押すことで、テストをキャンセルしたり、テキストをクリアすることができます。
   - テスト中にキャンセルボタンを押すと、テストが中断され、「Start」ボタンが再度有効になります。

### 詳細な動作

#### HTML部分 (`index.html`)

- **テキストエリア**: テキストの入力欄。
- **テキスト表示エリア**: ユーザー入力のテキストを表示するための領域。
- **コントロールエリア**: 保存、クリア、開始（停止）ボタンが配置されている。
- **結果表示**: テスト結果を表示するための領域。
- **外部リソース**: `uikit`ライブラリのCSSとJavaScriptが読み込まれている。

#### JavaScript部分 (`index.js`)

- **イベントリスナーの設定**:
  - Cordovaの`deviceready`イベント
  - テキストエリアの`keydown`イベント
  - ボタンのクリックイベント

- **テキスト保存と表示**:
  - ユーザーがテキストを保存すると表示エリアにテキストが移され、テキストエリアが非表示になります。

- **読み取り速度測定**:
  - テスト開始時に現在の時間を記録し、単語数をカウントします。
  - テスト終了時に経過時間を計算し、WPM（分あたりの単語数）を計算して結果を表示します。

- **ユーティリティ関数**:
  - `countWords`: テキストの単語数をカウントする。
  - `calculateWPM`: 経過時間と単語数からWPMを計算する。
  - `toggleDisplay`: 要素の表示・非表示を切り替える。

### まとめ

このアプリケーションは、ユーザーが自分の読み取り速度を簡単に測定できるツールです。テキストを入力し、開始ボタンを押すことで、自分の読み取り速度（WPM）を計算し、結果を表示します。Cordovaのサポートにより、モバイルデバイスでも使用可能です。

## アプリケーションのファイル構成

```
/Users/mshattori/Dev/reading-wpm/
├───.gitignore
├───android.env
├───config.xml
├───package-lock.json
├───package.json
├───README.md
├───task.md
├───www/
│   ├───app.css
│   ├───cordova.css
│   ├───favicon.ico
│   ├───index.html
│   ├───index.js
│   └───uikit-3.21.12/
├───res/
│   ├───icon/
│   └───screen/
├───platforms/
├───plugins/
├───store/
└───keys/
```

- `www/`: ウェブアプリケーションのソースコードが含まれています。Cordovaはこのディレクトリの内容をネイティブアプリのWebViewで使用します。
- `config.xml`: Cordovaプロジェクトの設定ファイルです。アプリ名、ID、プラグイン、アイコンなどの情報が含まれています。
- `res/`: アイコンやスプラッシュスクリーンなどのリソースファイルが含まれています。
- `platforms/`: Cordovaが各プラットフォーム（Androidなど）のネイティブプロジェクトを生成するディレクトリです。
- `plugins/`: インストールされているCordovaプラグインが含まれています。
- `package.json`: Node.jsの依存関係やプロジェクト情報を定義します。
- `android.env`: Android開発用の環境変数を設定するファイルです。
- `store/`: Google Play Storeに掲載するためのスクリーンショットやフィーチャーグラフィックなどの素材が含まれています。

## 技術スタック

- **Frontend:**
    - HTML5
    - CSS3
    - JavaScript (ES6)
    - [UIkit](https://getuikit.com/): フロントエンドフレームワーク
- **Mobile App Framework:**
    - [Apache Cordova](https://cordova.apache.org/): WebViewを使用してモバイルアプリを開発するためのフレームワーク
- **Build & Dependencies:**
    - Node.js
    - Gradle
    - JDK 17 (OpenJDK)

## Cordova アプリケーションの作成方法

### 1. 開発環境の構築

- Node.js
- Android Studio
- Gradle
- OpenJDK 17

以下の環境変数を設定します。(`android.env`)

```sh
export ANDROID_SDK_ROOT=/Users/mshattori/Library/Android/sdk
export ANDROID_HOME=/Users/mshattori/Library/Android/sdk
export JAVA_HOME=/usr/local/opt/openjdk@17
export PATH=$JAVA_HOME/bin:$ANDROID_SDK_ROOT/platform-tools:$PATH
```

### 2. Cordova プロジェクトのセットアップ

1.  Cordovaをグローバルにインストールします。
    ```sh
    sudo npm install -g cordova
    ```

2.  Androidプラットフォームを追加します。
    ```sh
    cordova platform add android
    ```

### 3. 開発ビルドと実行

- **エミュレータで実行:**
    ```sh
    cordova emulate android
    ```

- **実機で実行:**
    ```sh
    cordova run android
    ```

## Android アプリのビルド方法

### 1. アップロードキーの作成

リリースビルドには署名が必要です。以下のコマンドでアップロードキーを作成します。

```sh
keytool -genkey -v -keystore upload-keystore.jks -alias upload -keyalg RSA -keysize 2048 -validity 10000
```

### 2. リリースビルド (AAB)

Google Play Storeに公開するためのAndroid App Bundle (AAB) を作成します。
以下の例ではkeystoreのパスワードを`passwd.txt`というファイルに保存しています。

```sh
cordova build android --release -- --keystore=./keys/upload-keystore.jks --storePassword=`cat keys/passwd.txt` --password=`cat keys/passwd.txt` --alias=upload --packageType=bundle
```

## Google Play Store 関連

* `store/`: Google Play Storeに掲載するためのスクリーンショットやフィーチャーグラフィックなどの素材が含まれています。

* [https://github.com/mshattori/privacy-policy](https://github.com/mshattori/privacy-policy): reading-wpm プロジェクトのプライバシーポリシーを格納したプロジェクト。
  - GigHub Pages により <https://mshattori.github.io/privacy-policy/wpm-checker-privacy-policy.html> で WPM Checker アプリのプライバシーポリシーページを公開
  - Google Play Store のアプリ公開時に必要な法的文書
  - WPM Checker が個人情報を収集しないことを明記
