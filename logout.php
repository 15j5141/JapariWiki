<?php
require_once(__DIR__.'/../config.php');


session_start();
session_destroy();
/*header( "Location: ". $JWConfig["rootURL"]. "login.php" ) ;
exit*/;
?>

<HTML>
<HEAD>

<TITLE>logout</TITLE>

<!-- 5秒後に移動する場合 -->
<meta http-equiv="refresh" content="1;URL=<?= $JWConfig["rootURL"] ?>login.php?<?= parse_url($_SERVER['REQUEST_URI'], PHP_URL_QUERY ) ?>" >


</HEAD>
<BODY bgcolor="#ffffff">
ログアウトかタイムアウトしました。<br />
1 秒後にログインページへ移動します。

<a href='<?= $JWConfig["rootURL"] ?>login.php'>あるいはここからログインページへ移動</a>
<!-- fixme クエリ付加 -->

<script type="text/javascript">
setTimeout("refreshURL()", 3000);
function refreshURL(){
    //window.location = "<?= $JWConfig['rootURL'] ?>login.php";
}

</script>
</BODY>
</HTML>
