// @ts-check
import JWStatus from './scripts/jw-status.js';
import Cloud from './scripts/class-cloud_ncmb.js';
import { Components, Services } from './scripts/jw_modules.js';
import ServiceManager from './scripts/class-service_manager.js';
import ComponentsManager from './scripts/class-components_manager.js';

/** History API 使用の可否. */
const isCanBeHistory =
  history && history.pushState && history.state !== undefined;
/** Wiki 状態管理変数. */
const status = new JWStatus();
/** クラウド管理変数. */
const cloud = new Cloud();

// 管理系の宣言する.
const serviceManager = new ServiceManager();
const componentsManager = new ComponentsManager();

// サービスを立ち上げる.
const index$ = new Services.IndexService({
  componentsManager,
});
const app$ = new Services.ApplicationService({
  componentsManager,
});
const status$ = new Services.StatusService({
  componentsManager,
});

// サービスを登録する.
serviceManager.register(index$);
serviceManager.register(app$);
serviceManager.register(status$);

// 描画部品初期化.
const headerComponent = new Components.HeaderComponent({
  selector: '#header',
  jQuery: window.jQuery,
  status: status,
  serviceManager: serviceManager,
});
const footerComponent = new Components.FooterComponent({
  selector: '#footer',
  jQuery: window.jQuery,
  serviceManager: serviceManager,
});
const wikiApp = new Components.WikiApp({
  selector: '#content_add',
  jQuery: window.jQuery,
  status: status,
  serviceManager: serviceManager,
});
const editorApp = new Components.EditorApp({
  selector: '#content_add',
  jQuery: window.jQuery,
  status: status,
  serviceManager: serviceManager,
});
const menuComponent = new Components.MenuComponent({
  selector: '#side-menu',
  jQuery: window.jQuery,
  status: status,
  serviceManager: serviceManager,
});
const historyComponent = new Components.HistoryComponent({
  selector: '#side-edited_history',
  jQuery: window.jQuery,
  serviceManager: serviceManager,
});
const sideMainComponent = new Components.SideMainComponent({
  selector: '#side_main',
  jQuery: window.jQuery,
  serviceManager: serviceManager,
});
const loginHistoryComponent = new Components.LoginHistoryComponent({
  selector: '#login_history',
  jQuery: window.jQuery,
  serviceManager: serviceManager,
});

// 各コンポーネントを登録する.
componentsManager.register(headerComponent);
componentsManager.register(footerComponent);
componentsManager.register(wikiApp);
componentsManager.register(editorApp);
componentsManager.register(loginHistoryComponent);

$(function() {
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
    await Promise.all([
      headerComponent.init(),
      footerComponent.init(),
      wikiApp.init(),
      menuComponent.init(),
      historyComponent.init(),
      sideMainComponent.init(),
      editorApp.init(),
      loginHistoryComponent.init(),
    ]);

    await Promise.all([
      wikiApp.draw(),
      footerComponent.draw(),
      headerComponent.draw(),
      menuComponent.draw(),
      historyComponent.draw(),
      sideMainComponent.draw(),
      loginHistoryComponent.draw(),
    ]);

    // Wiki 内部品を非同期読み込み.
    // FixMe ajaxLoad('#login_history', 'api/api_getLoginHistory.php');
  })();

  if (history.state == null) {
    // 履歴情報がなければ(Wikiを開いた時)現ページ名で上書き.
    history.replaceState('' + status.getPageURI(), null, null);
  }
});
