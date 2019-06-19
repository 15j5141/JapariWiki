var doneAjax = 1;
var isCanBeHistory = history && history.pushState && history.state !== undefined;

$(function() {

  $('#button1').click(function() {
    $.ajax({
      url: "text/site_menu.txt",
      cache: false,
      success: function(html) {
        $("#content_add").append(html);
      }
    });
  });


  $(document).on('click', 'a.ajaxLoad', function(event) {
    event.preventDefault();
    /* 連打対策 */
    if (doneAjax == 1) {
      doneAjax = 0;

      page = $(this).attr('value');
      $("#content_add").html('読み込み中・・・。');
      $.ajax({
        url: "ajax_load.php?page=" + encodeURIComponent(page),
        cache: false,
        success: function(data, status, xhr) {
          Scroll2Top();
          $("#content_add").fadeOut('fast', function() {
            if (xhr.status === 201) {
              $.ajax({
                url: "ajax_edit.php?page=" + encodeURIComponent(page),
                cache: false,
                success: function(html) {
                  $("#content_add").html(html);
                  $("#content_add").append(xhr.location);
                }
              });
            } else {
              $("#content_add").html(data);
              $('#content_add').change(); // 発火させる
            }
            $("#content_add").fadeIn('1');
            doneAjax = 1;
          });
        },
        error: function() {
          $("#content_add").html('Ajax通信エラーです。');
          $("#content_add").fadeIn('1');
          doneAjax = 1;
        }
      }); /* $.ajax */
    } /* if */
    history.pushState("" + page, null, null);
    return false;
  });


  $(document).on('click', '#ajaxLoad_edit', function(event) {
    event.preventDefault();
    ajaxLoad("#content_add", "ajax_edit.php?page=" + encodeURIComponent(page));
    /*
    $.ajax({
      //url: "ajax_edit.php?page=" + page,
      url: "ajax_edit.php?page=" + encodeURIComponent(page),
      cache: false,
      success: function(html){
        $("#content_add").html(html);
      }
    });
    */
    return false;
  });

  $(document).on('click', '#ajaxLoad_upload', function(event) {
    event.preventDefault();
    //キーボード操作などにより、オーバーレイが多重起動するのを防止する
    $(this).blur(); //ボタンからフォーカスを外す
    if ($("#modal-overlay")[0]) return false;
    //新しくモーダルウィンドウを起動しない

    //オーバーレイ用のHTMLコードを、[body]内の最後に生成する
    $("body").append('<div id="modal-overlay"></div>');
    $("#modal-overlay").append('<div id="modal-content"></div>');
    ajaxLoad('#modal-content', 'ajax_upload.php');
    //[$modal-overlay]をフェードインさせる
    $("#modal-overlay").fadeIn("slow");

    return false;
  });

  $(document).on('click', '#modal-overlay', function(event) {
    //[#modal-overlay]と[#modal-close]をフェードアウトする
    if ($(event.target).is("#modal-overlay")) {
      $("#modal-close,#modal-overlay").fadeOut("slow", function() {
        //フェードアウト後、[#modal-overlay]をHTML(DOM)上から削除
        $("#modal-overlay").remove();
      });
    }
  });

  $(window).on('popstate', function(e) {
    if (isCanBeHistory) {
      ajaxLoad("#content_add", "ajax_load.php?page=" + encodeURIComponent(history.state));
    }
  });

  ajaxLoad("#content_add", "ajax_load.php?page=" + encodeURIComponent(page));
  ajaxLoad("#header", "index_" + "header.php");
  ajaxLoad("#footer", "index_" + "footer.php");
  ajaxLoad("#login_history", "api/api_getLoginHistory.php");
  if (history.state == null) {
    history.replaceState('' + page, null, null);
  }

  // FixMe ajaxエラー時処理を加える
  function ajaxLoad(Content, Url) {
    $.ajax({
      url: "" + Url,
      cache: false,
      success: function(html) {
        $(Content).html(html);
        $(Content).change(); // 発火させる
      }
    });
  }

  function Scroll2Top() {
    $('html,body').animate({
      scrollTop: 0
    }, 100, 'swing');
  }

  $(document).on('click', '#ajaxLoad_kanban', function(event) {
    event.preventDefault();
    ajaxLoad("#content_add", "ajax_kanban.php");
    return false;
  });

});