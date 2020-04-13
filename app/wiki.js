// import * as convertHTML from "js/module_convertHTML.js";
import JWStatus from '../js/jw-status';
// import { NCMB } from "ncmb";
import $ from 'jquery';

const status = new JWStatus();

console.log(NCMB);
console.log($);
console.log(jQuery);

const page = status.getPageName();

// ニフクラインスタンス生成.
const ncmb = new NCMB(JW.cloud.appKey, JW.cloud.clientKey);

const Page = ncmb.DataStore('Page');
// 受信.
Page.equalTo('path', page)
  .fetch()
  .then(function(result) {
    console.log(result.text);
    $('#app_wiki-body').html(result.text);
  })
  .catch(function(err) {
    console.log(err);
  });

// URLからクエリを抽出.
const params = {};
location.search
  .substring(1)
  .split('&')
  .forEach(q => {
    params[q.split('=')[0]] = q.split('=')[1];
  });
console.log(params);

// convertHTML.loadText(params['page']);
/*
ex https://aaa.bbb/ccc?d=e&f=g
{
    "d": "e",
    "f": "g"
}

*/
//   session_start();

// if(isset($_GET['page'])) {
//   $page = isAjax() ? urldecode($_GET['page']) : $_GET['page'];
//   if (!file_exists('text/' . $page . '.txt')){
//     http_response_code(302);
//     header('Location: ajax_edit.php?page=' . $_GET['page']);
//     exit();
//     $page = 'FrontPage';
//   }
//   echo loadText("text/" . $page . ".txt");

//   $_SESSION['page']=$page;
// }elseif(isset($_POST['text'])){
//   echo "".loadTextFromString($_POST['text']);
// }
// ?>
