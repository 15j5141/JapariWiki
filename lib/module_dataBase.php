<?php
ini_set( 'display_errors', 1 );


require_once(__DIR__.'/../db.php');

function sqlbind($sql, $types, ...$params){
  global $db;
  array_unshift($params, $types);
//var_dump($params);
  $mysqli = new mysqli($db['host'], $db['id'], $db['pass'], $db['dbname']);
  if ($mysqli->connect_error) {
    return $mysqli->connect_error;
  }else{
    $mysqli->set_charset("utf8");
  }

  $results=false;
  if ($stmt = $mysqli->prepare($sql)) {
$a=array($params[0], &$params[1]);
//var_dump($a);
    if( call_user_func_array(array($stmt, 'bind_param'), $params) ){
      $stmt->execute();
      $result=$stmt->get_result();
      if($result!==false){
        $results = $result;
      }else{
        if($mysqli->errno===0){
          $results=true;
        }else{
          $results=false;
        }
      }
      $stmt->close();
    }else{
      $results=false;
    }
  }else{
    $results=false;
  }
  // DB接続を閉じる
  $mysqli->close();
  return $results;
}




function sqlbind2($sql, $types, $params){
  global $db;

  $mysqli = new mysqli($db['host'], $db['id'], $db['pass'], $db['dbname']);
  if ($mysqli->connect_error) {
    return $mysqli->connect_error;
  }else{
    $mysqli->set_charset("utf8");
  }

  $results=false;
  if ($stmt = $mysqli->prepare($sql)) {
$a=array($types, &$params);
//var_dump($a);
    if( call_user_func_array(array($stmt, 'bind_param'), $a) ){
      $stmt->execute();
      $result=$stmt->get_result();
      if($result!==false){
        $results = $result;
      }else{
        if($mysqli->errno===0){
          $results=true;
        }else{
          $results=false;
        }
      }
      $stmt->close();
    }else{
      $results=false;
    }
  }else{
    $results=false;
  }
  // DB接続を閉じる
  $mysqli->close();
  return $results;
}




function sqlexec($sql){
  global $db;

  $mysqli = new mysqli($db['host'], $db['id'], $db['pass'], $db['dbname']);
  if ($mysqli->connect_error) {
    return $mysqli->connect_error;
  }else{
    $mysqli->set_charset("utf8");
  }

  if ($result = $mysqli->query($sql)) {
    if($result!==true){
      //$results = $result->fetch_all(MYSQLI_ASSOC);
      $results = $result;
      // 結果セットを閉じる
      //$result->close();
    }else{
      $results=true;
    }
  }else{
    $results=false;
  }
  // DB接続を閉じる
  $mysqli->close();
  return $results;
}

/*


    if($result->num_rows == 1){ // 1件なら
      // 連想配列を取得
      while ($row = $result->fetch_assoc()) {
        if($row["user_id"] == $user_id){//ID一致なら
          $verify = password_verify($user_pass, $row["user_pass"]);
        }else{
          $verify = false;
        }
        //echo $row["user_id"] . $row["user_pass"] . "<br>";
      }
      $result->close();
      $mysqli->close();
      return $verify;
    }

*/
?>
