import JWStatus from './jw-status.js';
// import JWPage from './class-page.js';
import Cloud from './class-cloud_ncmb.js';
import PageRenderer from './class-page_renderer.js';
import AjaxRenderer from './class-ajax_renderer.js';
import WikiApp from '../app/wiki.js';
import EditorApp from '../app/edit.js';
import { HeaderComponent, FooterComponent } from './jw_modules.js';

/** History API 使用の可否. */
const isCanBeHistory =
  history && history.pushState && history.state !== undefined;
/** Wiki 状態管理変数. */
const status = new JWStatus();
/** クラウド管理変数. */
const cloud = new Cloud();

// 描画部品初期化.
const headerComponent = new HeaderComponent({
  selector: '#header',
  jQuery: window.jQuery,
  status: status,
});
const footerComponent = new FooterComponent({
  selector: '#footer',
  jQuery: window.jQuery,
});
const wikiApp = new WikiApp({
  selector: '#content_add',
  jQuery: window.jQuery,
});
const editorApp = new EditorApp('#content_add');
const rendererSideMenu = new PageRenderer('#side-menu', '/site_/SideMenu');
const rendererHistory = new AjaxRenderer(
  '#side-edited_history',
  'text/site_menu.txt'
);
const rendererSiteNotice = new AjaxRenderer(
  '#side-site_notice',
  'text/site_Notice.txt'
);

$(function() {
  // 「編集」ボタンを押したら.
  $(document).on('click', '#ajaxLoad_edit', function(event) {
    event.preventDefault();
    // 最新ステータス取得.
    status.load();
    // 編集画面起動.
    editorApp
      .open(status.getPageURI())
      .then(result => {
        console.log(result);
        // 編集したページを表示する.
        wikiApp.move();
      })
      .catch(err => {
        console.log(err);
      });
    return false;
  });

  // 「アップロード」ボタンを押したら.
  $(document).on('click', '#ajaxLoad_upload', function(event) {
    event.preventDefault();
    // キーボード操作などにより、オーバーレイが多重起動するのを防止する
    $(event.target).blur(); // ボタンからフォーカスを外す
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
    if (!e.originalEvent.state) return;
    if (isCanBeHistory) {
      // FixMe ページだけでなくアプリの切り替えも行う.
      // ページ移動.

      // パスを解決.
      const uri = wikiApp.refObj.status.resolveURI(e.originalEvent.state);
      wikiApp.refObj.status.setPageURI(uri);
      // FixMe パスを解決できなければエラー?
      wikiApp.refObj.status.save();
      wikiApp.draw(e.originalEvent.state);
    }
  });

  (async () => {
    await headerComponent.init();
    await footerComponent.init();
    await wikiApp.init();

    wikiApp.draw();
    footerComponent.draw();
    headerComponent.draw();

    // Wiki 内部品を非同期読み込み.
    wikiApp.move().then(() => {});
    // $('#content_add').get(0).contentWindow.location.href = 'app/wiki.html';
    rendererSideMenu.update();
    rendererHistory.update();
    rendererSiteNotice.update();
    // FixMe ajaxLoad('#login_history', 'api/api_getLoginHistory.php');
  })();

  if (history.state == null) {
    // 履歴情報がなければ(Wikiを開いた時)現ページ名で上書き.
    history.replaceState('' + status.getPageURI(), null, null);
  }
});
