<?php
require_once(__DIR__.'/../../config.php');

session_start(['cookie_lifetime' => 3600,]);

if (!isset($_SESSION['id'])) {
  header( "Location: ". $JWConfig["rootURL"]. "logout.php" .'?'. parse_url($_SERVER['REQUEST_URI'], PHP_URL_QUERY ) );
  exit;
}



?>
