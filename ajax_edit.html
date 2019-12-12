<?php
// php/init
header('Content-Type: text/html; charset=UTF-8');
require_once(__DIR__.'/lib/module_dataBase.php');
?>
<?php
// php/run
if(isset($_POST['fileData'])){
  //echo ($_POST['fileData']);
  $page = $_POST['page'];
  if($page===''){
    $page='newPage';
  }
  $fileName='./text/' . $page . '.txt';
  $fileData=$_POST['fileData'];
  if (file_exists($fileName)){
    echo 'rewrite';
  }else{
    echo 'write';
  }
  file_put_contents($fileName, $fileData);


  //履歴を保存
  $fp = fopen('./text/site_History.txt', "r");
  if($fp===null) {
    echo 'history' . ' is not exist.';
    exit();
  }

  $today = date("Y-m-d H:i:s");
  //ex) 2001-03-10 17:16:18 (MySQL DATETIME format)
  $lines=''. $today . '&br;[[' . $page . "]]&br;\n";
  $count=0;
  while (($line = fgets($fp)) && $count < 9) {
    //$line=htmlspecialchars($line, ENT_QUOTES, 'UTF-8');
    // 履歴内の重複ページはスキップ
    if(preg_match('/.*\[\['. $page. ']].*/', $line)!==1){
      $lines.=$line;
    }
    $count++;
  }

  fclose($fp);
  file_put_contents('./text/site_History.txt', $lines);

  $sql="INSERT INTO app_page (pageName,user_id,text,dateTime) VALUES (? ,? ,?, ?) ON DUPLICATE KEY UPDATE text = VALUES(text)";
  //sqlbind($sql, 'ssss', $page, 'asd', $fileData, $today);
  // ↑使ってないので一時コメント化

  exit();
}

if(isset($_GET['page'])):
  $page = mb_convert_encoding( urldecode($_GET['page']), 'UTF-8');
  session_start();
  $_SESSION['page']=$page;

  if($page===''){
    $page='newPage';
  }
  $fileName='./text/' . $page . '.txt';
  $fileData='';
  if (file_exists($fileName)){
    $fileData = file_get_contents($fileName);
  }
  //echo $page . '<br />';

  ?>

  <!-- html/css -->
  <style>
  #ajax_edit__body{
    height: 100vh;
  }
  #ajax_edit{
    height: 100%;
    width: 100%;
  }
  #ajax_edit__preview{
    box-sizing:border-box;
    height: 80%;
    width: 48%;
    display: inline-block;
    zoom: 0.8;
    overflow: scroll;
  }
  #ajax_edit__textarea{
    box-sizing:border-box;
    height: 80%;
    width: 48%;
    display: inline-block;
    resize: none;
  }
  </style>

  <!-- html/js -->
  <script type="text/javascript">
  var intervalObj;
  var textarea_oldValue;
  $(function(){
    $('#content_add').attr("data-ajax","edit");// 現在のajax画面.

    $('#ajax_edit').on('submit', function(event) {
      event.preventDefault(); // 本来のPOSTを打ち消すおまじない
      if(intervalObj!=null){
        clearInterval(intervalObj);
      }
      $('input[type="submit"]', this).prop("disabled","true");// 送信ボタン無効化
      $('#ajax_edit__textarea').prop("readonly","true");// 編集枠無効化
      checkBeforeSavingPage($('#ajax_edit__textarea').val()).then(
        result => {
          $('#ajax_edit__textarea').val(result);
          $.ajax({
            type: "POST",
            url: $(this).attr('action'),
            data: $(this).serializeArray(),
            success: function(msg){
              //alert( "Data Saved: " + msg );
              location.reload();
            },
            error: function(){
              alert( "Data Could not Save!: ");
            }
          });
        });
    });
    intervalObj=setInterval(function(){
      var textarea_value=$("#ajax_edit__textarea").val();
      // 変化があったらpreviewを更新
      if(textarea_oldValue!=textarea_value){
        $.ajax({
          type: "POST",
          url: "./ajax_load.php",
          data: {'text': textarea_value},
          success: function(data){
            $("#ajax_edit__preview").html(data);
          },
          error: function(){
            $("#ajax_edit__preview").html("ajax通信エラー");
          }
        });
        textarea_oldValue=textarea_value;
      }
    },1000);
  });
</script>

<!-- html/body -->
<div id="ajax_edit__body">
  <form id="ajax_edit" action="ajax_edit.php?page=<?php echo urlencode($page); ?>" method="post">
    ページ名：<input type="text" name="page" size="40" maxlength="20" value="<?php echo $page; ?>"><br />
    <textarea name="fileData"  id="ajax_edit__textarea"><?php echo $fileData;  ?></textarea>
    <div id="ajax_edit__preview">
      読み込み中...
    </div><br />
    <input type="submit" value="送信"><input type="reset" value="リセット">
  </form>
</div>


<?php
endif;
?>
