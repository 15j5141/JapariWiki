<?php
/* php-init */
header('Content-Type: text/html; charset=UTF-8');
require_once(__DIR__.'/../db.php');
//require_once(__DIR__.'/lib/module_dataBase.php');
?>


<?php
/* php-run */

// アカウント用テーブルの作成.
//$sql="DROP TABLE IF EXISTS app_account;";
$sql="CREATE TABLE app_account (
  id int(11) NOT NULL AUTO_INCREMENT,
  user_id varchar(16) NOT NULL,
  user_name varchar(16) NOT NULL,
  user_pass varchar(255) NOT NULL,
  lastdate timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id),
  PRIMARY KEY(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;";

$result='';
$mysqli = new mysqli($db['host'], $db['id'], $db['pass'], $db['dbname']);
if ($mysqli->connect_error) {
  $result = $mysqli->connect_error;
}else{
  $mysqli->set_charset("utf8");
  $result = $mysqli->query($sql);
  $mysqli->close();
}

?>

<!-- html-css -->


<!-- html-js -->


<!-- html-body -->
<html>
<body>
  <?= $result; ?>
</body>
</html>
