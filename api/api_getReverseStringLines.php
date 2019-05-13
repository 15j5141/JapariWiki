<?php
ini_set( 'display_errors', 1 );
//ini_set( 'allow_url_fopen', 1 );
header('Content-Type: text/plain; charset=UTF-8');
if (isset($_GET['type'], $_GET['data'])) {
  $tmp = array();
  $tmp['nSplit']= isset($_GET['nSplit'])? (int)$_GET['nSplit']: 1;
  $tmp['max']= isset($_GET['max'])? (int)$_GET['max']: 0;
  if (FALSE) {
  }elseif ($_GET['type']=='url') {
    echo executeURL( $_GET['data'], $tmp['nSplit'], $tmp['max']);
  }elseif ($_GET['type']=='uri') {
    echo executeURI( $_GET['data'], $tmp['nSplit'], $tmp['max']);
  }elseif ($_GET['type']=='text') {
    echo executeText( $_GET['data'], $tmp['nSplit'], $tmp['max']);
  }elseif(isset($_POST['file'])){
    echo executeURI( $_FILES['file']['tmp_name'], $tmp['nSplit'], $tmp['max']);
  }else {
    echo 'error.';
  }
  $tmp = NULL;
}else {
  echo 'error.';
}
exit();

// 文字列そのものが送信されたとき
function executeText($in1, $in2, $in3){
  $fp = fopen('php://temp', 'r+b');
  fwrite($fp, $in1);
  fseek($fp, 0);
  return execute($fp, $in2, $in3);
}
// URLで開くとき
function executeURL($in1, $in2, $in3){
  $url= $in1;
  //テキスト読み込み開始
  if(empty($url)) {
    return 'Nothing.';
  }
  $cp = curl_init();
  //curl_setopt($cp, CURLOPT_RETURNTRANSFER, 1);// リダイレクト先を取得
  curl_setopt($cp, CURLOPT_URL, $url);// URL指定
  curl_setopt($cp, CURLOPT_TIMEOUT, 10);// タイムアウト
  //curl_setopt($cp, CURLOPT_USERAGENT, $_SERVER['HTTP_USER_AGENT']);// ユーザーエージェント
  $file = curl_exec($cp);
  curl_close($cp);
  return executeText($file, $in2, $in3);
}
// URIで開くとき
function executeURI($in1, $in2, $in3){
  $uri= $in1;
  //テキスト読み込み開始
  if(empty($uri)) {
    return 'Nothing.';
  }
  $file= file_get_contents($uri);
  $fp = fopen($uri, "r");
  return isset($fp)? execute($fp, $in2, $in3): 'Not found.';
}

function execute($in1, $in2, $in3){
  $fp= $in1;  
  $nSplit= $in2;
  $max= $in3;
  $result= "";

  if($nSplit<1){
    $nSplit= 1;
  }

  $buf= "";
  for( $count=1; TRUE; $count++){
    $line= fgets($fp);
    if($line===FALSE || ($max>=1 && $max<($count/$nSplit))){
      $result= $buf . $result;
      break;
    }
    $buf.= $line;
    if($count % $nSplit ==0){
      $result= $buf . $result;
      $buf= "";
    }
  }
  fclose($fp);
  return $result;
}

?>
