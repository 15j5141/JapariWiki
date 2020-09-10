<?php

function isAjax(){

    if(isset($_SERVER['HTTP_X_REQUESTED_WITH']) && strtolower($_SERVER['HTTP_X_REQUESTED_WITH'])=='xmlhttprequest'){
        return true;
    }
    return false;
}

function loadText($fileName){
  $loadData = file_get_contents($fileName);
  if($loadData===false) {
    return $filename . ' is not exist.';
  }
  return loadTextFromString($loadData);
}
function loadTextFromString($input){
  $result = "";
  $lineBuf=array();
  $nest=array();// コードの深さ
  $input = explode("\n", $input);
  foreach($input as $line){
    //$line=htmlspecialchars($line, ENT_QUOTES, 'UTF-8');
    $line=h($line) . "\n";
    $count=1;
    //$line = preg_replace('/(?:\n|\r|\r\n)/', '', $line);
    while($count>0){
      $count=0;
      $count_=0;
      if(preg_match_all('/#co\(\)\{(.*)\}/U', $line, $outs, PREG_SET_ORDER)!==0){
        foreach ($outs as $out){
          $out= preg_replace('/$\\n/', '<br />', $out[1]);
          $result .= $out;
        }
      }
      $depth=count($nest);
      if(preg_match('/#code(.*)/Ui', $line, $matches)===1){
        array_push($nest, "#code");
        array_push($lineBuf, $matches[1]);
        break;
      }
      if($depth>0){
        if(preg_match('/#End/i', $line, $matches)===1){
          switch(array_pop($nest)){
            case "#code":
            $result .= '<pre><code class="prettyprint linenums">';
            $result .= array_pop($lineBuf);
            $result .= '</code></pre>';
            break;
          }
        }else{
          $lineBuf[$depth-1] .= $line;
        }
        break;
      }

      /*
          preg_match_all('/&amp;image\((.*)\)/U', $out, $line);
          $out_='';
          foreach ($out[1] as $i => $out_) {
            $out_
          $line= preg_replace('/&amp;image\((.*)\)/U',
            '<img class="tag" src="' . sqlexec_($1)" />', $line);
      */

      $line= preg_replace('/&amp;image_raw\((.*)\)/U', '<img class="tag" src="data:image/png;base64,$1" /><br >', $line);
      $line =str_replace('&amp;br;', '<br />', $line);

      if(strpos($line, "#")===0){
        $keyWord = "#";
        $result .= $line;
      }else{
        $line= preg_replace('/$\\n/', '<br />', $line);
        $result .= $line;
      }
    }
  }
  return $result;
}
function h($a){  return htmlspecialchars($a);  }
function ud($a){  return urldecode($a);  }


function syntax($line, $startKey, $endKey){
  if(mb_strpos($line, $startKey)===false){
    return '';
  }
  $startPos = $startKey!==''? mb_strpos($line, $startKey) + mb_strlen($startKey): 0;
  $endlength = $endKey!==''? mb_strpos($line, $endKey, $startPos): mb_strlen($line);
  $endlength += -$startPos;
  return mb_substr($line, $startPos, $endlength);
}
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
?>
