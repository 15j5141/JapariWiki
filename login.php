<?php

ini_set( 'display_errors', 1 );
ini_set('log_errors', 1);
ini_set('error_log', 'php_err.txt');

require_once(__DIR__.'/lib/module_dataBase.php');
require_once(__DIR__.'/../config.php');

if(isset($_POST["user_id"])){
  $user_id=$_POST["user_id"];
}else{
  $user_id="null";
}
if(isset($_POST["user_pass"])){
  $user_pass=$_POST["user_pass"];
}else{
  $user_pass="null";
}
if($user_id!='null' && $user_pass !='null'){

  $passHash = password_hash($user_pass, PASSWORD_DEFAULT);

  if(sqlexec_()===true){
    session_regenerate_id(true);
    session_start();
    $_SESSION['id'] = $user_id;
    $loginResult= 'success';

    // リダイレクト(移動)
    if( parse_url($_SERVER['REQUEST_URI'], PHP_URL_QUERY )!=''){ header(
    "Location: /?". parse_url($_SERVER['REQUEST_URI'], PHP_URL_QUERY )); }else{
    header( "Location: /" );
    }

  }else{
    $loginResult= 'failure';
    echo 'アカウント作成希望者は以下を管理者へお知らせください。<br />';
    echo '暗号化済みID, PASS：' . $user_id . ':' . $passHash . '<br />';
    //echo '' . $user_id . '<br />';
    //echo '' . $user_pass . '<br />';
  }

  // ログイン履歴を適当に残す by 2018/02/06
  $fileData= "";
  $fileName= "./text/log_LoginHistory.txt";
  if(is_readable($fileName)){
    $fileData= file_get_contents($fileName);
  }
  $today = date("Y-m-d H:i:s");
  $fileData .= $today . ";". $loginResult. ';'.  $user_id . "\n";
  file_put_contents($fileName, $fileData);

  if($loginResult==='success'){
    // 終了
    exit;
  }
}

function sqlexec_(){
  global $user_id;
  global $user_pass;

  $sql = "SELECT * FROM app_account WHERE user_id = '" . $user_id . "'";
  $result=sqlexec($sql);
  $verify = false;

  if(($result->num_rows)=== 1){ // 1件なら

    while($row=$result->fetch_assoc()){
    // 連想配列を取得
      if($row["user_id"] == $user_id){//ID一致なら
        $verify = password_verify($user_pass, $row["user_pass"]);
      }else{
        $verify = false;
      }
    }
    //$result->close();
  }
  return $verify;
}

?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title><?= $JWConfig["title"] ?></title>
  <script type="text/javascript" src="lib/md5.js"></script>
  <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js"></script>
  <?php echo '<link rel="stylesheet" type="text/css" href="css/login.css?' . mt_rand() .  '" />'; ?>
</head>

<body>
<script>
  $(function() {
    $('#test').on('click', function() {
    });
    $('#test').append('<br />');

    $('#form_id').submit(function(){
      if($('input[name=user_id]').val()=="" || $("input[name='user_pass']").val()==""){
        $('#test').append('<br />IDorPASS is not!');
        return false;
      }
      var a =CryptoJS.MD5( $("input[name='user_pass']").val() );
      $("input[name='user_pass']").val('' + a);
    });
  });
</script>
<div class='body'>
  <form id="form_id" action="" method="POST">
    <fieldset>
      <legend align='center'>
        <img src='/img/site_loginTitleLogo.png' id='TitleLogo'>
      </legend>
      <div>
        <p>
          ID：<br />
          <input type="text" id="id" name="user_id" size="40">
        </p>
        <p>
          PASS:<br />
          <input type="password" id="pass" name="user_pass" size="40">
        </p>
        <p>
          <input type="submit" value="ログイン">
        </p>
      </div>
      <div>
        新規登録は登録したいID,PASSを入力して送信をクリック後、
        表示されるコードを当wiki管理者へお知らせください。
      </div>
    </fieldset>
  </form>
</div>

</body>
</html>
