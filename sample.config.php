<?php
/* - JapariWikiConfig */
/* -- site name and title(<title>this</title>) */
$JWConfig["siteName"]='SiteName';
$JWConfig["siteTitle"]='SiteTitle';

/* -- path of index.php */
$JWConfig["rootURL"]='https://www.abc.xxx/app/wiki/';
/* example----------------
If https://www.abc.xxx/index.php
Then $JWConfig["rootURL"]='http://www.abc.xxx/';
If http://www.abc.xxx:8888/app/wiki/index.php
Then $JWConfig["rootURL"]='https://www.abc.xxx:8888/app/wiki/';
---------------- */

/* -- Warnning settings  */
/* --- Warn when not https access.  */
$JWConfig["isWarnNotHTTPS"]=true;





/* - The following settings are automatic.
But if it doesn't work please enter it manually. */
$JWConfig["rootURL"]=$JWConfig["rootURL"] . (substr($JWConfig["rootURL"], -1)!='/'? '/': '');// slash check.
preg_match("|^https?://([-\w\.]+)(:\d+)?/(.*)$|", $JWConfig["rootURL"], $out, PREG_PATTERN_ORDER);
$JWConfig["siteDomain"]=$out[1];//strtok($_SERVER['HTTP_HOST'],':');
$JWConfig["sitePort"]=$out[2];//':'. $_SERVER['REMOTE_PORT']
$JWConfig["siteDir"]=$out[3];
$JWConfig["isHTTPS"]= 'https' === substr($JWConfig["rootURL"], 0, 5);
?>
