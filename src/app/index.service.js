// @ts-check
import ServiceBase from '../scripts/class-service_base.js';
import { BehaviorSubject } from 'rxjs';
import { filter } from 'rxjs/operators';
import { StatusService } from './status.service.js';
import ApplicationService from './application.service.js';
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
    /** @type {{status: StatusService, application: ApplicationService, models: ModelsService, wiki: WikiService, editor: EditorService}} */
    this.serviceInjection = {
      status: StatusService.prototype,
      application: ApplicationService.prototype,
      models: ModelsService.prototype,
      wiki: WikiService.prototype,
      editor: EditorService.prototype,
    };

    /* ----- プロパティ宣言. ----- */
    /** URL のクエリ確認用 */
    const url = new URL(window.location.href);
    /**
     * @type {SiteState}
     * サービス起動時の状態遷移情報.
     * 次の順にページ名の取得を試みる.
     * "URLのクエリ > window.HistoryAPI > sessionStorage > デフォルト(/FrontPage)".
     */
    const siteHistory = {
      appName:
        url.searchParams.get('appName') ||
        (window.history.state && window.history.state.appName) ||
        window.sessionStorage.getItem('appName') ||
        'WikiApp',
      pageURI:
        url.searchParams.get('pageURI') ||
        (window.history.state && window.history.state.pageURI) ||
        window.sessionStorage.getItem('pageURI') ||
        '/FrontPage',
    };
    // URL にクエリがある場合取り除く.
    url.searchParams.delete('appName');
    url.searchParams.delete('pageURI');
    window.history.replaceState(siteHistory, siteHistory.pageURI, url.href);

    /** @type {BehaviorSubject<SiteState>} サイトの状態遷移用. */
    this.siteHistory$ = new BehaviorSubject(siteHistory);

    /* ----- コンポーネント取得. ----- */
  }
  /** @override */
  onStart() {
    const self = this;
    /**
     * アプリケーション呼び出し.
     * @param {SiteState} state
     */
    const execute = state => {
      // タイトル書き換え.
      $(top.document.querySelector('title')).text(
        state.appName + ':' + state.pageURI
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
    this.siteHistory$.pipe(filter(v => v != null)).subscribe(state => {
      // 履歴に追加する.
      window.history.pushState(
        state,
        state.appName + ':' + state.pageURI,
        null
      );
      execute(state);
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
