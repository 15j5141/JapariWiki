<?php
//ini_set( 'display_errors', 1 );
require_once(__DIR__.'/lib/module_ajaxContents.php');
require_once(__DIR__.'/../config.php');
?>

<img border="0" alt="" src="img/site_face.png" width=50 />
<a href='' value='FrontPage' class="ajaxLoad"><?= $JWConfig["name"] ?></a><br />
<a href='' id="ajaxLoad_edit"><img border="0" alt="hensyu" src="img/site_Edit.png" width=150 height=50 /></a>,
<a href='' id="ajaxLoad_upload"><img border="0" alt="up" src="img/site_Upload.png" width=150 height=50 /></a>
