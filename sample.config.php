<?php
/* JapariWikiConfig */

$JWConfig["name"]='SiteName';
$JWConfig["title"]='SiteTitle';

$JWConfig["domain"]=strtok($_SERVER['HTTP_HOST'],':'); /* if error then must manual coding */
$JWConfig["root"]='/';
$JWConfig["baseURL"]=(
  'http'. (isset($_SERVER['HTTPS'])? 's': ''). '://'. /* if https then auto append 's' */
  $JWConfig["domain"].
  //':'. $_SERVER['REMOTE_PORT']. /* if setting other port then uncomment */
  $JWConfig["root"]
);

// ex: https://www.abc.xxx:8888/app/wiki/index.php
/* ----------------
$JWConfig["domain"]='www.abc.xxx';
$JWConfig["root"]='/app/wiki/';
$JWConfig["baseURL"]=(
  'http'. (isset($_SERVER['HTTPS'])? 's': ''). '://'.
  $JWConfig["domain"].
  ':'. $_SERVER['REMOTE_PORT'].
  $JWConfig["root"]
);
---------------- */

?>
