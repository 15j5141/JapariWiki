<?php
//ini_set( 'display_errors', 1 );
require($_SERVER['DOCUMENT_ROOT']. '/lib/module_ajaxContents.php');
?>

<!-- affiliates kasu -->
<div>
  <p>アフィエリア</p>
</div>
<br />

<!-- kasou tsuuka -->
<div>
<p>仮想通貨エリア</p>
<iframe id="widget-ticker-preview" src="//www.coingecko.com/en/widget_component/ticker/bitzeny/jpy" style="border:none; height:125px; width: 275px;" scrolling="no" frameborder="0" allowtransparency="true"></iframe>
<iframe id="widget-ticker-preview" src="//www.coingecko.com/en/widget_component/ticker/monacoin/jpy" style="border:none; height:125px; width: 275px;" scrolling="no" frameborder="0" allowtransparency="true"></iframe>
<iframe id="widget-ticker-preview" src="//www.coingecko.com/en/widget_component/ticker/bitcoin/jpy" style="border:none; height:125px; width: 275px;" scrolling="no" frameborder="0" allowtransparency="true"></iframe>
</div>
