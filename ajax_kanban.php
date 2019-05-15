<?php
// php/init
ini_set( 'display_errors', 1 );
header('Content-Type: text/html; charset=UTF-8');
require_once(__DIR__.'/lib/module_dataBase.php');
?>

<?php
// php/run

?>

<!-- html/css -->
<style>
.kanban-note-area{
  background:#999;
  margin: 10px 2px;
  border:solid 1px #EEE;
  border-radius: 5px;
}
.kanban-card-area{
  background:#777;
  overflow: auto;
  border:solid 1px #DDD;
  width: 30%;
  flex-shrink: 0;
  margin: 5px 10px;
  /* border-radius: 10px; */
  border-radius: 10px 150px 43px 83px / 15px 106px 46px 76px;
}
.kanban-project-area{
  width:100%;
  height:90vh;
  background:#666;
  overflow: auto;
  display: inline-flex;
}
#kanban-note-add {
  align-self: flex-start;
}
#kanban-card-add {
  height: 100%;
}
</style>

<!-- html/js -->
<script>
function addMovableNote(){
  $(document).on({
    'dragstart.kanban touchstart.kanban': function(e) {
      console.log("----drag start--------");
      var rect = this.parentElement.getBoundingClientRect();
      var rectNote = this.getBoundingClientRect();
      rectOffsetX=mousex(e)-Math.floor(rectNote.left);
      rectOffsetY=mousey(e)-Math.floor(e.pageY-rectNote.top);
      srcElement=document.elementFromPoint(mousex(e), mousey(e));
    },
    // ドラッグされたら移動させる
    'drag.kanban touchmove.kanban': function(e) {
      //var rect = $('.kanban-card-area').get(0).getBoundingClientRect();
      //var rectNote=$('.kanban-note-area').get(0).getBoundingClientRect();
      //e.preventDefault();
      /*
      var rect = this.parentElement.getBoundingClientRect();
      var rectNote = this.getBoundingClientRect();
      // スクロールした際の相対値をwindow.pageXOffsetで調整
      if (mousex(e)-rectOffsetX>rect.right-rectNote.width
        ||mousey(e)-rectOffsetY>rect.bottom-rectNote.height
        ||mousex(e)-rectOffsetX<rect.left + window.pageXOffset
        ||mousey(e)-rectOffsetY<rect.top + window.pageYOffset) {
        return;
      }
      this.style.left=mousex(e)-rectOffsetX+"px";
      this.style.top=mousey(e)-rectOffsetY+"px";
      */
      dstElement = document.elementFromPoint(mousex(e), mousey(e));
      console.log('class:'+dstElement.className);
      if(!dstElement.getAttribute('draggable') ||
      srcElement.className != dstElement.className||
      srcElement==dstElement){return;}
      if(srcElement.getBoundingClientRect().top>dstElement.getBoundingClientRect().top){
        dstElement.parentNode.insertBefore(srcElement, dstElement);
      }else{
        dstElement.parentNode.insertBefore(srcElement, dstElement.nextElementSibling);
      }

    },
    'dragend.kanban touchend.kanban': function(e){
    },
    // タッチスクロールを抑制(旧)
    'touchmove.kanban': function(e) {
      e.preventDefault();
    }
  }, '.kanban-note-area');
}
$(function() {// ready cut
  var rectOffsetX=0;
  var rectOffsetY=0;
  var srcElement;
  var dstElement;
  // 重複イベント登録対策
  $(document).off('.kanban');
  // note追加ボタン
  $(document).on('click.kanban', '#kanban-note-add', function(e) {
    $(this).parent().find('ul').append(
      '<li class="kanban-note-area" draggable="true">'+
        '<input type="text" value="同列内だけ動く"><br />Added by '+Math.floor(Math.random(100000)*1000)+
      '</li>'
    );
    if($(this).parent().find('ul').find('li').length==1){
      addMovableNote();
    }
    // タッチスクロールを抑制(新)
    $('.kanban-note-area').each(function(i, o){
      o.addEventListener("touchmove", function(e){
        e.preventDefault();
      }, {passive: false});
    });
  });
  // card追加ボタン
  $(document).on('click.kanban', '#kanban-card-add', function(e) {
    $(this).parent().append(
      '<div class="kanban-card-area" draggable="true">'+
        'TODO '+
        Math.floor(Math.random(100000)*1000)+
        '<input type="button" value="＋" id="kanban-note-add" /><br />'+
        '<ul style="list-style:none;padding:2px;">'+
        '</ul>'+
      '</div>'
    );
    // if($(this).parent().find('ul').find('li').length==1){
    //   addMovableNote();
    // }
    // タッチスクロールを抑制(新)
    $('.kanban-card-area').each(function(i, o){
      o.addEventListener("touchmove", function(e){
        e.preventDefault();
      }, {passive: false});
    });
  });
});
function mousex(e){
  return e.pageX-window.pageXOffset;
}
function mousey(e){
  return e.pageY-window.pageYOffset;
}
</script>

<!-- html/body -->
<div class="kanban-project-area_">
  プロジェクト名（仮）<br />
  <div class="kanban-project-area">
    <input type="button" value="＋" id="kanban-card-add" /><br />
    <!--
    <div class="kanban-card-area" draggable="true">
      TODO <input type="button" value="＋" id="kanban-note-add" /> ...<br />
      <ul style="list-style:none;padding:2px;">
      </ul>
    </div>
    -->
  </div>
</div>
