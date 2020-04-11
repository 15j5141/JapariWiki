import JWStatus from "./jw-status.js";
import Page from "./class-page.js";
import Cloud from "./class-cloud.js";
import Renderer from "./class-renderer.js";

let doneAjax = true;
const isCanBeHistory = history && history.pushState && history.state !== undefined;

$(function() {
  const status = new JWStatus();
  let page = status.getPageName();
  let cloud = new Cloud();

  // <a class="ajaxLoad">をクリックしたら. Wiki内ページリンクを踏んだら.
  $(document).on('click', 'a.ajaxLoad', function(event) {
    event.preventDefault(); // 標準ページ移動を無効化.
    /* 連打対策 */
    if (doneAjax) {
      doneAjax = false;

      // $('#content_add').attr("data-ajax", "load"); // 現在のajax画面はload.
      const pageName = $(this).data('page'); // <a data-page=xxx>を取得.
      $("#content_add").html('読み込み中・・・。'); // 読み込み中であることを明示.

      // ページを取得.
      cloud.getPage(pageName)
        .then(data => {
          Scroll2Top(); // ページ上までスクロール.
          $("#content_add").fadeOut('fast', function() { // 一度ページを非表示に.
            // ページを書き換え.
            $("#content_add").html(data);
            $('#content_add').trigger('rewrite'); // 発火させる
            $("#content_add").fadeIn('1'); // ページを表示する.
            doneAjax = true;
          });

        }).catch(err => {
          // ページが存在しなければ新規作成.
          if (err) { 
            console.log();
          }
          // それ以外のエラー.
          console.log(err);
          $("#content_add").html('Ajax通信エラーです。');
          $("#content_add").fadeIn('1'); // ページを表示する.
          doneAjax = true;
        });

    } /* if */
    history.pushState("" + page, null, null); // 遷移を履歴に追加.
    return false; // <a>を無効化.
  });

  // 「編集」ボタンを押したら.
  $(document).on('click', '#ajaxLoad_edit', function(event) {
    event.preventDefault();
    ajaxLoad("#content_add", "ajax_edit.php?page=" + encodeURIComponent(page));
    return false;
  });

  // 「アップロード」ボタンを押したら.
  $(document).on('click', '#ajaxLoad_upload', function(event) {
    event.preventDefault();
    // キーボード操作などにより、オーバーレイが多重起動するのを防止する
    $(this).blur(); //ボタンからフォーカスを外す
    if ($("#modal-overlay")[0]) return false;
    // 新しくモーダルウィンドウを起動しない

    // オーバーレイ用のHTMLコードを、[body]内の最後に生成する
    $("body").append('<div id="modal-overlay"></div>');
    $("#modal-overlay").append('<div id="modal-content"></div>');
    ajaxLoad('#modal-content', 'ajax_upload.php');
    // [$modal-overlay]をフェードインさせる
    $("#modal-overlay").fadeIn("slow");

    return false;
  });

  $(document).on('click', '#modal-overlay', function(event) {
    // [#modal-overlay]と[#modal-close]をフェードアウトする
    if ($(event.target).is("#modal-overlay")) {
      $("#modal-close,#modal-overlay").fadeOut("slow", function() {
        // フェードアウト後、[#modal-overlay]をHTML(DOM)上から削除
        $("#modal-overlay").remove();
      });
    }
  });

  // ページバック処理時にページ遷移を発動.
  $(window).on('popstate', function(e) {
    if (isCanBeHistory) {
      ajaxLoad("#content_add", "ajax_load.php?page=" + encodeURIComponent(history.state), () => $("#content_add").trigger('rewrite'));
    }
  });

  ajaxLoad("#content_add", "ajax_load.php?page=" + encodeURIComponent(page), () => $("#content_add").trigger('rewrite'));
  ajaxLoad("#header", "index_" + "header.html");
  ajaxLoad("#footer", "index_" + "footer.html");
  ajaxLoad("#login_history", "api/api_getLoginHistory.php");
  if (history.state == null) { // 履歴情報がなければ(Wikiを開いた時)現ページ名で上書き.
    history.replaceState('' + page, null, null);
  }

  $(document).on('click', '#ajaxLoad_kanban', function(event) {
    event.preventDefault();
    ajaxLoad("#content_add", "ajax_kanban.php");
    return false;
  });

});

// FixMe ajaxエラー時処理を加える
function ajaxLoad(Content, Url, callbackSuccess) {
  $.ajax({
    url: "" + Url,
    cache: false,
    success: function(html) {
      $(Content).html(html);
      if (typeof callbackSuccess === 'function') callbackSuccess(html);
    }
  });
}

/**
 * ページ上部へスクロールする.
 */
function Scroll2Top() {
  $('html,body').animate({
    scrollTop: 0
  }, 100, 'swing');
}