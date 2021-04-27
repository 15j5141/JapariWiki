// @ts-check
import { ServiceBase } from '../scripts';
import { BehaviorSubject } from 'rxjs';
import { StatusService } from './status.service.js';
import { ModelsService } from './models.service.js';
import { WikiService } from './wiki.service.js';
import { EditorService } from './editor.service.js';
import { filter } from 'rxjs/operators';

/**
 * @typedef {Object} SiteState
 * @property {string} appName
 * @property {string} pageURI
 * @property {Array<Object>=} windowComponents
 * @property {boolean=} [noHistory=false] 履歴へ追加しないフラグ
 */

/**
 * @class
 */
export class IndexService extends ServiceBase {
  /** @override */
  get [Symbol.toStringTag]() {
    return 'IndexService';
  }
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
        // WikiApp に通知する.
        self.serviceInjection.wiki.pageURI$.next(state.pageURI);
      } else if (state.appName === 'Editor') {
        // Editor を起動する.
        // コンポーネント側で siteHistory$ を監視している.
      } else {
        console.log('対応アプリがありません.', state);
      }
    };

    // 履歴に追加してアプリを起動する.
    this.siteHistory$.pipe(filter(s => s != null)).subscribe(app => {
      console.log('siteHistory$:', app);
      // フラグがfalseか未定義なら履歴に追加する.
      if (!app.noHistory) {
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
        self.executeAppWithoutHistoryAPI({
          appName: history.state.appName,
          pageURI: uri,
        });
      }
    });

    // サイト読み込み時にアプリを開く.
    status.load();
    this.executeAppWithoutHistoryAPI(status._status.app);
  }
  /**
   * アプリを開く.
   * @param {SiteState} state
   */
  executeApp(state) {
    this.siteHistory$.next(state);
  }
  /**
   * アプリをブラウザの履歴に追加しないで開く.
   * @param {SiteState} state
   */
  executeAppWithoutHistoryAPI(state) {
    this.executeApp({ ...state, noHistory: true });
  }
}
