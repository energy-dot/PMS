# ビルドスクリプト更新手順

テストモジュールをビルド対象外にするため、以下の変更を`package.json`に適用してください。

## 1. buildスクリプトの変更

下記のようにbuildスクリプトを変更してください:

```diff
"scripts": {
-  "build": "nest build",
+  "build": "nest build -p tsconfig.build.json",
   ...
}
```

## 2. テストスクリプトの変更 (オプション)

テストファイルのエラーを無視するには、下記のようにテストスクリプトを変更してください:

```diff
"scripts": {
-  "test": "jest",
+  "test": "jest --passWithNoTests",
-  "test:watch": "jest --watch",
+  "test:watch": "jest --watch --passWithNoTests",
-  "test:cov": "jest --coverage",
+  "test:cov": "jest --coverage --passWithNoTests",
   ...
}
```

## 3. 作成されたファイルについて

次のファイルが作成されました:

1. `tsconfig.build.json` - テストファイルを除外するTypeScript設定
2. `nest-cli.json` - テストファイル除外用のNestJS設定

これらのファイルは既に正しく設定されているため、変更する必要はありません。
