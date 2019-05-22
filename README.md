# やること
- db.php、config.phpファイル配置・編集
- init.phpをブラウザ等から実行

## db.php、config.phpファイル配置・編集
### sampleをドキュメントルートより上へ移動
```bash
$ mv sample.db.php ../db.php
$ mv sample.config.php ../config.php
```

### 移動したdb.php、config.phpを編集する。
```bash
$ vi db.php
$ vi config.php
```
- db.phpの例
```php
<?php
$db['host'] = 'localhost:port';
$db['id'] = 'id';
$db['pass'] = 'pass';
$db['dbname'] = 'dbname';
$db['dsn']='mysql:dbname=' . $db['dbname'] . ';host='. $db['host']. ';charset=utf8mb4';
$db['options']=[
    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_EMULATE_PREPARES => false,
];
?>
```

- config.phpの例
```php
<?php
$JWConfig["siteName"]='SiteName';
$JWConfig["siteTitle"]='SiteTitle';
$JWConfig["rootURL"]='https://www.abc.xxx/app/wiki/';
?>
```

# その他
## ログイン画面での警告について
config.php-JWConfig['rootURL']でhttpにしてる時はログイン画面にhttps化推奨警告が出ます。httpで利用されるかつ警告が不要な場合は、
```php
config.php-JWConfig['isWarnNotHTTPS']=false;
```
にすると警告が非表示になります。
## FTP等でのファイル名文字化け時のFFFTP設定コマンド
OPTS UTF8 OFF
