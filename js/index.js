import JWStatus from './jw-status.js';
// import JWPage from './class-page.js';
import Cloud from './class-cloud_ncmb.js';
import Renderer from './class-renderer.js';

/** リンク連打対策用. */
let doneAjax = true;
/** History API 使用の可否. */
const isCanBeHistory =
  history && history.pushState && history.state !== undefined;
/** Wiki 状態管理変数. */
const status = new JWStatus();
/** クラウド管理変数. */
const cloud = new Cloud();

$(function() {
  // <a class="ajaxLoad">をクリックしたら. Wiki内ページリンクを踏んだら.
  $(document).on('click', 'a.ajaxLoad', function(event) {
    event.preventDefault(); // 標準ページ移動を無効化.
    /* 連打対策 */
    if (doneAjax) {
      doneAjax = false;

      // $('#content_add').attr("data-ajax", "load"); // 現在のajax画面はload.
      const pageName = $(this).data('page'); // <a data-page=xxx>を取得.
      $('#content_add').html('読み込み中・・・。'); // 読み込み中であることを明示.

      // ページを取得.
      (async () => {
        let html;
        try {
          // クラウドからページデータ取得.
          const pageData = await cloud.getPage(pageName);
          // FixMe 構文解析に通す.
          html = pageData.rawText;
        } catch (err) {
          if (err.message === 'Page:NotFound') {
            // ページが存在しなければ新規作成.
            console.log('Page:NotFound');
            // FixMe 編集画面へ.
          } else {
            // それ以外のエラー.
            console.log(err.message);
          }
          html = 'Ajax通信エラーです。';
        }
        scroll2Top(); // ページ上までスクロール.
        $('#content_add').fadeOut('fast', function() {
          // 一度ページを非表示に.
          // ページを書き換え.
          $('#content_add').html(html);
          $('#content_add').trigger('rewrite'); // 発火させる
          $('#content_add').fadeIn('1'); // ページを表示する.
          doneAjax = true;
        });
      })();
    } /* if */
    // 遷移を履歴に追加.
    history.pushState('' + pageName, null, null);
    return false; // <a>を無効化.
  });

  // 「編集」ボタンを押したら.
  $(document).on('click', '#ajaxLoad_edit', function(event) {
    event.preventDefault();
    ajaxLoad('#content_add', 'ajax_edit.php?page=' + encodeURIComponent(page));
    return false;
  });

  // 「アップロード」ボタンを押したら.
  $(document).on('click', '#ajaxLoad_upload', function(event) {
    event.preventDefault();
    // キーボード操作などにより、オーバーレイが多重起動するのを防止する
    $(this).blur(); // ボタンからフォーカスを外す
    if ($('#modal-overlay')[0]) return false;
    // 新しくモーダルウィンドウを起動しない

    // オーバーレイ用のHTMLコードを、[body]内の最後に生成する
    $('body').append('<div id="modal-overlay"></div>');
    $('#modal-overlay').append('<div id="modal-content"></div>');
    ajaxLoad('#modal-content', 'ajax_upload.php');
    // [$modal-overlay]をフェードインさせる
    $('#modal-overlay').fadeIn('slow');

    return false;
  });

  $(document).on('click', '#modal-overlay', function(event) {
    // [#modal-overlay]と[#modal-close]をフェードアウトする
    if ($(event.target).is('#modal-overlay')) {
      $('#modal-close,#modal-overlay').fadeOut('slow', function() {
        // フェードアウト後、[#modal-overlay]をHTML(DOM)上から削除
        $('#modal-overlay').remove();
      });
    }
  });

  // ページバック処理時にページ遷移を発動.
  $(window).on('popstate', function(e) {
    if (isCanBeHistory) {
      ajaxLoad(
        '#content_add',
        'ajax_load.php?page=' + encodeURIComponent(history.state),
        () => $('#content_add').trigger('rewrite')
      );
    }
  });

  // Wiki 内部品を非同期読み込み.
  updateRenderer('#content_add', status.getPageURI(), () => {
    $('#content_add').trigger('rewrite');
  });
  updateRenderer('#div-side_menu', '/site_/SideMenu');
  ajaxLoad('#header', 'index_' + 'header.html');
  ajaxLoad('#footer', 'index_' + 'footer.html');
  // ajaxLoad('#login_history', 'api/api_getLoginHistory.php');
  if (history.state == null) {
    // 履歴情報がなければ(Wikiを開いた時)現ページ名で上書き.
    history.replaceState('' + status.getPageURI(), null, null);
  }

  // サイト内の'.ajax_load'パーツを非同期に読み込み.
  const ajaxLoads = $('.ajax_load');
  for (let i = 0; i < ajaxLoads.length; i++) {
    // jQueryオブジェクトを取得.
    const jq = ajaxLoads.eq(i);
    // console.log(jq);
    ajaxLoad(null, jq.data('path'), function(data) {
      jq.html(data);
    });
  }
});

/**
 *
 * @param {string} selecter
 * @param {string} pageURI
 * @param {Function} callbackSuccess
 */
async function updateRenderer(selecter, pageURI, callbackSuccess) {
  const page = await cloud.getPage(pageURI);
  console.log(selecter, pageURI, page.rawText);

  $(selecter).html(page.rawText);
  if (typeof callbackSuccess === 'function') {
    callbackSuccess(page.rawText);
  }
}

/**
 * FixMe
 * ajaxエラー時処理を加える
 * @param {*} Content
 * @param {*} Url
 * @param {*} callbackSuccess
 */
function ajaxLoad(Content, Url, callbackSuccess) {
  $.ajax({
    url: '' + Url,
    cache: false,
    success: function(html) {
      $(Content).html(html);
      if (typeof callbackSuccess === 'function') callbackSuccess(html);
    },
  });
}

/**
 * ページ上部へスクロールする.
 */
function scroll2Top() {
  $('html,body').animate({ scrollTop: 0 }, 100, 'swing');
}
