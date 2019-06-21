<?php

header('Content-Type: text/html; charset=UTF-8');
require_once(__DIR__.'/lib/module_dataBase.php');
session_start();


if(isset($_FILES['userfile']['name'])):

try {
  $uploaddir = 'up/';
  //$uploadfile = $uploaddir . basename($_FILES['userfile']['name']);
  $uploadfile = $uploaddir . uniqid($_SESSION['id'] .'_') . '.';
  $uploadfile .= pathinfo($_FILES['userfile']['name'], PATHINFO_EXTENSION);
  $aliasfile = $_SESSION['id'] . '_' . basename($_FILES['userfile']['name']);
 print_r(mime_content_type($_FILES['userfile']['tmp_name']));
  if (!$ext = array_search(
    mime_content_type($_FILES['userfile']['tmp_name']),
    array( 'gif' => 'image/gif',
           'jpg' => 'image/jpeg',
           'bmp' => 'image/x-ms-bmp',
           'png' => 'image/png', ),
    true )
  ) { throw new RuntimeException('ファイル形式が画像でないかサイズオーバーです'); }
  echo '<pre>';
  if (move_uploaded_file($_FILES['userfile']['tmp_name'], $uploadfile)) {
      echo "File is valid, and was successfully uploaded.\n";
  } else {
      echo "Possible file upload attack!\n";
  }

  echo 'Here is some more debugging info:';

  print_r($_FILES);
  echo $uploaddir;
  print "</pre>";
  $sql="INSERT INTO app_files (fileName,aliasName) VALUES (?, ?)";
  echo sqlbind($sql, 'ss', basename($uploadfile), $aliasfile);
} catch (RuntimeException $e) { echo $e->getMessage(); }
  echo $uploadfile;
else:
?>

<!-- データのエンコード方式である enctype は、必ず以下のようにしなければなりません -->
 <form id="form_upload" enctype="multipart/form-data" action="ajax_upload.php" method="POST">
<!-- MAX_FILE_SIZE は、必ず "file" input フィールドより前になければなりません -->
 <input type="hidden" name="MAX_FILE_SIZE" value="10240000" />
<!-- input 要素の name 属性の値が、$_FILES 配列のキーになります -->
 アップロード(Max 10MB): <input name="userfile" type="file" />
 <input type="submit" value="ファイルを送信" /> </form>


<script type="text/javascript">
$(function(){

$('#form_upload').on('submit', function(event) {
  event.preventDefault(); // 本来のPOSTを打ち消すおまじない
  var formData = new FormData( $('#form_upload').get(0) );
  $.ajax({
    type: "POST",
    url: $(this).attr('action'),
    data: formData,
    processData: false,
    // contentTypeもfalseに指定
    contentType: false,
    success: function(html){
      $("#modal-content").append(html);
    },
    error: function(){
      alert( "Data Could not Save!: ");
    }
  });
});
});
</script>

<?php
echo sqlexec_($_SESSION['id']);

endif;

function sqlexec_($user_id){

  $sql = "SELECT * FROM app_files WHERE aliasName LIKE ?";
  $result=sqlbind($sql, 's', $user_id . '%');
  $verify = '<table class="uploaded_list"><tr>';
  $cnt=0;
    while($row=$result->fetch_assoc()){
    // 連想配列を取得
      //$verify.= $row["aliasName"] . ':' ;
      $verify.= '<td class="uploaded_list"><img class="uploaded_list" src="up/'.$row["fileName"] . '" width="auto" height="128" alt="image" /><br />';
      $verify.= '<input name="b" type="text" value="&image(' . $row["fileName"] . ')" readonly="readonly" /></td>';
      if($cnt % 3 ==2){
        $verify.= '</tr><tr>';
      }
      $cnt++;
    }
      $verify.= '</tr></table>';
    //$result->close();
  return $verify;
}

?>
