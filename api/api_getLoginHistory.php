<?php
ini_set( 'display_errors', 1 );
//ini_set( 'allow_url_fopen', 1 );
require_once(__DIR__.'/../../config.php');

header('Content-Type: text/plain; charset=UTF-8');
define('DOMAIN_NAME', (isset($_SERVER['HTTPS'])? 'https://': 'http://'). $_SERVER['SERVER_NAME']);
/*
echo $_SERVER['SERVER_NAME'];
$a=apache_request_headers();
echo var_dump($a);
echo $_SERVER['REQUEST_URI'];
echo $_SERVER['HTTP_HOST'];
*/
$a= download($JWConfig['rootURL']. 'api/api_getReverseStringLines.php?nSplit=1&max=0&type=uri&data=../text/log_LoginHistory.txt');
echo str_replace("\n", "<br />\n", $a);
//echo file_get_contents(__DIR__. '/../text/log_LoginHistory.txt');

function download($url){
  if(empty($url)){
    return NULL;
  }
  $cp = curl_init();
  curl_setopt($cp, CURLOPT_RETURNTRANSFER, 1);// リダイレクト先を取得
  curl_setopt($cp, CURLOPT_URL, $url);// URL指定
  curl_setopt($cp, CURLOPT_TIMEOUT, 10);// タイムアウト
  //curl_setopt($cp, CURLOPT_USERAGENT, $_SERVER['HTTP_USER_AGENT']);// ユーザーエージェント
  $file = curl_exec($cp);
  curl_close($cp);
  return $file;
}
?>
