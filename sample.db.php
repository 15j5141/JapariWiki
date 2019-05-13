<?php
$db['host'] = 'localhost:port';
$db['id'] = 'id';
$db['pass'] = 'pass';
$db['dbname'] = 'dbname';
$db['dsn']='mysql:dbname=' . $db['dbname'] . ';host='. $db['host']. ';charset=utf8mb4';
$db['options']=[
    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_EMULATE_PREPARES => false,
];
?>
