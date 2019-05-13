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
      $line=preg_replace('/\[\[#([a-z][a-f0-9]{7})]]/U','<a class="page_pos" value="$1" href="#$1">$1</a>',$line);
      $line=preg_replace('/\[\[(.+)::#([a-z][a-f0-9]{7})]]/U','<a class="page_pos" value="$2" href="#$2">$1</a>',$line);

      $line=preg_replace('/\[\[(.+)::(https?:\/\/.+)]]/U','<a value="$2" href="$2" target=" _blank">$1</a>',$line,-1,$count_);
      $line= preg_replace('/\[\[(.+)::(.+)]]/U', '<a value="$2" href="$2" class="ajaxLoad">$1</a>', $line);
      $line= preg_replace('/\[\[(.+)]]/U', '<a value="$1" href="$1" class="ajaxLoad">$1</a>', $line);
      //$result .= 'javascript:void(0)';
      $line= preg_replace('/^---(.+)$\n/', '<ul><ul><ul type="square"><li>$1</li></ul></ul></ul>', $line);
      $line= preg_replace('/^--(.+)$\n/', '<ul><ul type="circle"><li>$1</li></ul></ul>', $line);
      $line= preg_replace('/^-(.+)$\n/', '<ul type="disc"><li>$1</li></ul>', $line);

      $line= preg_replace('/^#hr$\n/', '<hr>', $line);
      $line= preg_replace('/^#contents\(page=(.*)\)$\n/', '<div class="page_index">目次（予定）</div>', $line);

      $line= preg_replace('/^\*\*\*(.*) \[#([a-z][a-f0-9]{7})](.*)$\n/', '<p class="Asta3" id="$2">$1</p>', $line);
      $line= preg_replace('/^\*\*(.*) \[#([a-z][a-f0-9]{7})](.*)$\n/', '<p class="Asta2" id="$2">$1</p>', $line);
      $line= preg_replace('/^\*(.*) \[#([a-z][a-f0-9]{7})](.*)$\n/', '<p class="Asta1" id="$2">$1</p>', $line);

      $line= preg_replace('/^\*\*\*(.*)$\n/', '<p class="asta3">$1</p>', $line);
      $line= preg_replace('/^\*\*(.*)$\n/', '<p class="asta2">$1</p>', $line);
      $line= preg_replace('/^\*(.*)$\n/', '<p class="asta1">$1</p>', $line);

      $line= preg_replace('/&amp;size\((\d+)\)\{(.*)\}/U', '<span style="font-size:$1px">$2</span>', $line);
      $line= preg_replace('/&amp;color\((#[0-9A-F]{6})\)\{(.*)\}/U', '<span style="color:$1">$2</span>', $line);

      $line= preg_replace('/&amp;image\(([\._a-zA-Z0-9]+)\)/U', '<img class="tag" src="/up/$1" />', $line);
      $line= preg_replace('/&amp;image\(([\._a-zA-Z0-9]+),([0-9]*),([0-9]*)\)/U', '<img src="/up/$1" width="$2px" height="$3px" />', $line);

      //強制imgタグ
      $line= preg_replace('/&amp;img\((https?:\/\/.+)\)/U', '<img src="$1" />', $line);

      /*
          preg_match_all('/&amp;image\((.*)\)/U', $out, $line);
          $out_='';
          foreach ($out[1] as $i => $out_) {
            $out_
          $line= preg_replace('/&amp;image\((.*)\)/U',
            '<img class="tag" src="' . sqlexec_($1)" />', $line);
      */
      $line= preg_replace_callback('#&amp;countdown\((\d{4})/(\d+)/(\d+),day\)#',
        function ($matches){
          return '' . DateDiff($matches[1] . '-' . $matches[2] . '-' . $matches[3]);
        }, $line
      );
      $line= preg_replace_callback('#&amp;new\(text,(\d{4})/(\d+)/(\d+).*\)#U',
        function ($matches){
          if((int)DateDiff('NOW', $matches[1] . '-' . $matches[2] . '-' . $matches[3])>7){
            return '';
          }
          return 'new';
        }, $line
      );
      $line= preg_replace_callback('/^\|(.*)\|[^|]*$/',
        function ($matches){
          $matches[1].='|';
          $matches[1]=preg_replace('/(.*)\|/U','<td>$1</td>', $matches[1]);
          return '<table><tr>' . $matches[1] . '</tr></table>';
        }, $line
      );

      $line= preg_replace('/&amp;image_raw\((.*)\)/U', '<img class="tag" src="data:image/png;base64,$1" /><br >', $line);
      $line =str_replace('&amp;br;', '<br />', $line);

      $line= preg_replace('/%%(.+)%%/U', '<s>$1</s>', $line);
      $line= preg_replace("/'''(.+)'''/U", '<i>$1</i>', $line);
      $line= preg_replace("/''(.+)''/U", '<strong>$1</strong>', $line);
      if(strpos($line, "#")===0){
        $keyWord = "#";
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
