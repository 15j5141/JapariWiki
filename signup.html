<?php

require_once(__DIR__.'/lib/module_dataBase.php');
require_once(__DIR__.'/../config.php');
if($JWConfig["isHTTPS"]&&!isset($_SERVER['HTTPS'])){
  // configでhttpsにしてるのにhttpでアクセスされたらhttps付きへリダイレクト
  header( "Location: ". $JWConfig["rootURL"]. "signup.php" ) ;
  exit;
}
$user_id= isset($_POST["user_id"])? $_POST["user_id"]: "null";
$user_pass= isset($_POST["user_pass"])? $_POST["user_pass"]: "null";

if($user_id!='null' && $user_pass !='null'){
  // ハッシュ化
  $passHash = password_hash($user_pass, PASSWORD_DEFAULT);

  if(sql_register($user_id, $passHash)===true){
    //session_regenerate_id(true);
    session_start();
    $_SESSION['id'] = $user_id;
    $loginResult= 'success';

    // リダイレクト(移動)
    if( parse_url($_SERVER['REQUEST_URI'], PHP_URL_QUERY )!=''){
      header("Location: index.php?". parse_url($_SERVER['REQUEST_URI'], PHP_URL_QUERY ));
    }else{
      header( "Location: index.php" );
    }

  }else{
    $loginResult= 'failure';
    echo '既にIDが登録されているか不明のエラーです。お手数ですが以下を管理者へお知らせください。<br />';
    echo '暗号化(ハッシュ化)済みID, PASS：' . $user_id . ':' . $passHash . '<br />';
  }
  if($loginResult==='success'){
    // 終了
    exit;
  }
}

function sql_register($user_id, $user_pass){
  $verify = false;// 成否を格納

  // インスタンス生成
  $mysqli=newMysqli();
  $sql="INSERT INTO app_account (
    user_id, user_name, user_pass
  ) VALUES (? ,? ,?)";
  $stmt = $mysqli->prepare($sql);// 準備
  // パラメータを設定
  $stmt->bind_param( 'sss', $user_id, $user_id, $user_pass);
  // 実行
  $verify = $stmt->execute();
  $stmt->close();

  return $verify;
}

?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title><?= $JWConfig["siteTitle"] ?></title>
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
  <?= $JWConfig['isWarnNotHTTPS']&&!$JWConfig["isHTTPS"]? 'Wiki警告：HTTPSの利用を推奨します。（当警告はconfig.phpより非表示にできます。）': '' ?>
  <form id="form_id" action="" method="POST">
    <fieldset>
      <legend align='center'>
        <img src='img/site_loginTitleLogo.png' id='TitleLogo'>
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
