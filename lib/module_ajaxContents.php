<?php

function isAjax(){
  return (isset($_SERVER['HTTP_X_REQUESTED_WITH']) && strtolower($_SERVER['HTTP_X_REQUESTED_WITH'])=='xmlhttprequest');
}

function h($a){  return htmlspecialchars($a);  }
function ud($a){  return urldecode($a);  }
function DateDiff($date2='2036-01-01', $date1='NOW'){
  $datetime1 = new DateTime($date1);
  $datetime2 = new DateTime($date2);
  $interval = $datetime1->diff($datetime2);
  $diffDay=(int)($interval->format('%r%a')) ;
  if($diffDay===0){
    return '今';
  }else if($diffDay<0){
    return '過去';
  }else{
    return '' . $diffDay;
  }
}

// run
if(!isAjax()){
  echo "error.";
  exit();
}


?>
