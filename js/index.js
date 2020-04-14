import JWStatus from './jw-status.js';
// import JWPage from './class-page.js';
import Cloud from './class-cloud_ncmb.js';
import Renderer from './class-renderer.js';
import PageRenderer from './class-page_renderer.js';
import AjaxRenderer from './class-ajax_renderer.js';
import WikiApp from '../app/wiki.js';

/** リンク連打対策用. */
let doneAjax = true;
/** History API 使用の可否. */
const isCanBeHistory =
  history && history.pushState && history.state !== undefined;
/** Wiki 状態管理変数. */
const status = new JWStatus();
/** クラウド管理変数. */
const cloud = new Cloud();

// 描画部品初期化.
const wikiApp = new WikiApp('#content_add');
const rendererSideMenu = new PageRenderer('#side-menu', '/site_/SideMenu');
const rendererHeader = new AjaxRenderer('#header', 'index_header.html');
const rendererFooter = new AjaxRenderer('#footer', 'index_footer.html');
const rendererHistory = new AjaxRenderer(
  '#side-edited_history',
  'text/site_menu.txt'
);

$(function() {
  // <a class="ajaxLoad">をクリックしたら. Wiki内ページリンクを踏んだら.
  $(document).on('click', 'a.ajaxLoad', function(event) {
    event.preventDefault(); // 標準ページ移動を無効化.
    /* 連打対策 */
    if (doneAjax) {
      doneAjax = false;

      // ページ上までスクロール.
      scroll2Top();

      // ページを更新.
      (async () => {
        // <a data-page="ページ名">を取得.
        const pageName = $(this).data('page');
        await wikiApp.move(pageName).catch(err => {
          console.error(err);
        });
        // クリック制限を解除.
        doneAjax = true;
        // 遷移を履歴に追加.
        history.pushState('' + pageName, null, null);
      })();
    } /* if */
    return false; // <a>を無効化.
  });

  // 「編集」ボタンを押したら.
  $(document).on('click', '#ajaxLoad_edit', function(event) {
    event.preventDefault();
    // FixMe ajaxLoad('#content_add', 'ajax_edit.php?page=' + encodeURIComponent(page));
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
    // FixMe ajaxLoad('#modal-content', 'ajax_upload.php');
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
      // FixMe ページだけでなくアプリの切り替えも行う.
      // ページ移動.
      wikiApp.move(history.state);
    }
  });

  // Wiki 内部品を非同期読み込み.
  wikiApp.move().then(() => {
    console.log('redraw');
  });
  rendererSideMenu.update();
  rendererHeader.update();
  rendererFooter.update();
  rendererHistory.update();
  // FixMe ajaxLoad('#login_history', 'api/api_getLoginHistory.php');

  if (history.state == null) {
    // 履歴情報がなければ(Wikiを開いた時)現ページ名で上書き.
    history.replaceState('' + status.getPageURI(), null, null);
  }
});

/**
 * ページ上部へスクロールする.
 */
function scroll2Top() {
  $('html,body').animate({ scrollTop: 0 }, 100, 'swing');
}
