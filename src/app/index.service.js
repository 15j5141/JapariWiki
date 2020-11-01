// @ts-check
import ServiceBase from '../scripts/class-service_base.js';
import { BehaviorSubject } from 'rxjs';
import { StatusService } from './status.service.js';
import ModelsService from './models.service.js';
import WikiService from './wiki.service.js';
import EditorService from './editor.service.js';

/**
 * @typedef {Object} SiteState
 * @property {string} appName
 * @property {string} pageURI
 * @property {Array<Object>=} windowComponents
 */

/**
 * @class
 */
export default class IndexService extends ServiceBase {
  /** @override */
  decorator() {
    /* ----- デコレータセット. ----- */

    /* ----- サービスのインジェクション. ----- */
    /** @type {{status: StatusService, models: ModelsService, wiki: WikiService, editor: EditorService}} */
    this.serviceInjection = {
      status: StatusService.prototype,
      models: ModelsService.prototype,
      wiki: WikiService.prototype,
      editor: EditorService.prototype,
    };

    /* ----- プロパティ宣言. ----- */
    /** @type {BehaviorSubject<SiteState>} サイトの状態遷移用. */
    this.siteHistory$ = new BehaviorSubject(null);

    /* ----- コンポーネント取得. ----- */
  }
  /** @override */
  onStart() {
    const self = this;
    const status = this.serviceInjection.status.status$.getValue();
    /**
     * アプリケーション呼び出し.
     * @param {SiteState} state
     */
    const execute = state => {
      // タイトル書き換え.
      $(top.document.querySelector('title')).text(
        state.appName + ': ' + state.pageURI
      );
      self.serviceInjection.status.displayState$.next(
        `open ${state.appName} ${state.pageURI}`
      );

      // ページの描画は各コンポーネント側のオブザーバで受け取って処理する.
      if (state.appName === 'WikiApp') {
        // Editor を非表示にする.
        self.serviceInjection.editor.pageURI$.next(null);
        // WikiApp に通知する.
        self.serviceInjection.wiki.pageURI$.next(state.pageURI);
      } else if (state.appName === 'Editor') {
        // Editor を起動する.
        self.serviceInjection.editor.pageURI$.next(state.pageURI);
      } else {
        console.log('対応アプリがありません.', state);
      }
    };

    // 履歴に追加してアプリを起動する.
    this.siteHistory$.pipe().subscribe(app => {
      if (app == null) {
        // null なら読み込む.
        status.load();
        app = status._status.app;
      } else {
        // 履歴に追加する.
        window.history.pushState(app, app.appName + ': ' + app.pageURI, null);
      }
      // アプリを起動する.
      execute(app);
    });

    // ページバック処理時にページ遷移を発動.
    $(top).on('popstate', function(e) {
      console.log('popstate:', history.state);
      const isCanBeHistory =
        history && history.pushState && history.state !== undefined;
      if (isCanBeHistory) {
        // FixMe ページだけでなくアプリの切り替えも行う.

        // パスを解決して現在のURIを書き換える.
        const uri = self.serviceInjection.wiki.resolveURI(
          history.state.pageURI
        );
        // アプリケーションを復帰する.
        execute({
          appName: history.state.appName,
          pageURI: uri,
        });
      }
    });
  }
}
