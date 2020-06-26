// @ts-check
import JWStatus from './jw-status.js';
// import JWPage from './class-page.js';
import Cloud from './class-cloud_ncmb.js';
import { Components } from './jw_modules.js';

/** History API 使用の可否. */
const isCanBeHistory =
  history && history.pushState && history.state !== undefined;
/** Wiki 状態管理変数. */
const status = new JWStatus();
/** クラウド管理変数. */
const cloud = new Cloud();

// 描画部品初期化.
const headerComponent = new Components.HeaderComponent({
  selector: '#header',
  jQuery: window.jQuery,
  status: status,
});
const footerComponent = new Components.FooterComponent({
  selector: '#footer',
  jQuery: window.jQuery,
});
const wikiApp = new Components.WikiApp({
  selector: '#content_add',
  jQuery: window.jQuery,
  status: status,
});
const editorApp = new Components.EditorApp({
  selector: '#content_add',
  jQuery: window.jQuery,
  status: status,
});
const menuComponent = new Components.MenuComponent({
  selector: '#side-menu',
  jQuery: window.jQuery,
  status: status,
});
const historyComponent = new Components.HistoryComponent({
  selector: '#side-edited_history',
  jQuery: window.jQuery,
});
const siteNoticeComponent = new Components.SiteNoticeComponent({
  selector: '#side-site_notice',
  jQuery: window.jQuery,
});

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

  (async () => {
    await headerComponent.init();
    await footerComponent.init();
    await wikiApp.init();
    await menuComponent.init();
    await historyComponent.init();
    await siteNoticeComponent.init();

    await wikiApp.draw();
    await footerComponent.draw();
    await headerComponent.draw();
    await menuComponent.draw();
    await historyComponent.draw();
    await siteNoticeComponent.draw();

    // Wiki 内部品を非同期読み込み.
    // FixMe ajaxLoad('#login_history', 'api/api_getLoginHistory.php');
  })();

  if (history.state == null) {
    // 履歴情報がなければ(Wikiを開いた時)現ページ名で上書き.
    history.replaceState('' + status.getPageURI(), null, null);
  }
});
