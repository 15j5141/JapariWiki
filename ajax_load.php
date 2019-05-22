<?php


ini_set( 'display_errors', 1 );

require_once(__DIR__.'/lib/module_convertHTML.php');

header('Content-Type: text/html; charset=UTF-8');

  session_start();

if(isset($_GET['page'])) {
  $page = isAjax() ? urldecode($_GET['page']) : $_GET['page'];
  if (!file_exists('text/' . $page . '.txt')){
    http_response_code(302);
    header('Location: ajax_edit.php?page=' . $_GET['page']);
    exit();
    $page = 'FrontPage';
  }
  echo loadText("text/" . $page . ".txt");


  $_SESSION['page']=$page;
}elseif(isset($_POST['text'])){
  echo "".loadTextFromString($_POST['text']);
}
?>
