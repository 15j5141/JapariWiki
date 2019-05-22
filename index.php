<?php
/* php-init*/

ini_set( 'display_errors', 1 );
require_once(__DIR__.'/lib/module_convertHTML.php');
require_once(__DIR__.'/lib/module_login.php');
require_once(__DIR__.'/../config.php');
if($JWConfig["isHTTPS"]&&!isset($_SERVER['HTTPS'])){
  // configでhttpsにしてるのにhttpでアクセスされたらhttps付きへリダイレクト
  header( "Location: <?= $JWConfig["rootURL"] ?>index.php" ) ;
  exit;
}
?>

<?php
/* php-run */

if(isset($_GET['page'])){
	$_SESSION['page']=htmlspecialchars($_GET['page'], ENT_QUOTES|ENT_HTML5);
	header( "Location: " . parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH));
}
//$page = isset($_GET['page']) ? urldecode($_GET['page']) : '';
$page = isset($_SESSION['page']) ? $_SESSION['page'] : 'FrontPage';
//$page = $page==='' ?  : '';
?>

<!-- html-body -->
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
	<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
	<link rel="stylesheet" type="text/css" href="css/style.css?<?= mt_rand(); ?>" />
	<title><?= $JWConfig["siteTitle"] ?></title>
  <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js"></script>
  <script type="text/javascript">

    $(function(){
      //var
      page = "<?php echo $page; ?>";
    });

  </script>
  <script src="js/index.js?<?= mt_rand(); ?>"></script>
</head>

<body>
  <div class="bg-image">
  </div>
  <div id="header">
    <!-- auto ajax insert -->
    Loading Now...<br />
  </div><!-- /header-->
  <div id="content">
    <div id="content_body">
      <div id="content_add">
        Loading Now...<br /><br /><br />
        <!-- auto ajax insert -->
      </div>
    </div>
  </div>
  <div id="side">
    <div id="side_menu">
      <p class="bar">メニュー</p><br />
      <?php echo 'アカウント名：' . $_SESSION['id'] . '<br />'; ?>
      <a href='logout.php'>ログアウト</a><br />
      お知らせ<br />
      <div id="site_history">
        <?php echo loadText("./text/site_Notice.txt"); ?>
      </div>
			<a href='' id="ajaxLoad_kanban">
			  kanban(test)
			</a><br />
      ログイン履歴<br />
      <div id="login_history">
        Loading Now...<br />
      </div>
      <?php echo loadText("text/site_menu.txt"); ?>
    </div>
    <div id="side_history">
      History<br />
      <?php echo loadText("./text/site_History.txt"); ?>
    </div>
    <div id='side_discord'>
      <iframe src="https://discordapp.com/widget?id=xxxxxxxx&amp;theme=dark" width="250" height="300" allowtransparency="true" frameborder="0"></iframe>
    </div>
    <div id='side_twitter'>
      <a class="twitter-timeline" data-theme="dark" href="https://twitter.com/">
        Tweets by ___
      </a>
      <script async src="//platform.twitter.com/widgets.js" charset="utf-8"></script>
    </div>
  </div>
  <div id="footer">
    Loading Now...<br />
  </div>

</body>
</html>
