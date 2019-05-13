﻿# やること
## sample.db.php、sample.config.phpファイル作成
### ドキュメントルートより上へ移動
```bash
$ mv sample.db.php ../mv db.php
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
$config["domainName"]='abc.xxx';
$config["siteName"]='SiteTitle';
?>
```

# その他
## FTP等でのファイル名文字化け時のFFFTP設定コマンド
OPTS UTF8 OFF
