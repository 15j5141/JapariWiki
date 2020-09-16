// @ts-check
import PageRenderer from '../scripts/class-page_renderer.js';
import ComponentBase from '../scripts/class-component_base.js';
import { StatusService } from './status.service.js';
import ApplicationService from './application.service.js';
import ModelsService from './models.service.js';
import WikiService from './wiki.service.js';

/**
 * @class
 */
export default class WikiApp extends ComponentBase {
  /**
   * @override
   */
  decorator() {
    this.renderer = new PageRenderer(this.element, null);

    /* ----- サービスのインジェクション. ----- */
    /** @type {{status: StatusService, application: ApplicationService, models: ModelsService, wiki: WikiService}} */
    this.serviceInjection = {
      status: StatusService.prototype,
      application: ApplicationService.prototype,
      models: ModelsService.prototype,
      wiki: WikiService.prototype,
    };
  }
  /**
   * @override
   */
  static get decoration() {
    return {
      selector: '#app-wiki',
      templateUrl: './wiki.component.html',
      styleUrls: [],
    };
  }

  /**
   * @override
   */
  async onInit() {
    this.serviceInjection.application.wikiApp = this;
    /** リンク連打対策用. */
    this.doneAjax = true;

    // ページデータ読込完了時に表示を書き換える.
    const subscribe = () => {
      this.serviceInjection.wiki.page$.subscribe(
        jwPage => {
          console.log('page$-onNext', jwPage);
          // クリック制限を解除.
          this.doneAjax = true;

          // 受信してものを構文解析して描画する.
          this.renderer.html$.next({ value: jwPage.rawText });

          // タイトル書き換え.
          this.$(top.document.querySelector('title')).text(jwPage.pageURI);
        },
        e => {
          console.log('page$-onErr', e);
          subscribe();
        },
        () => console.log('page$-onComp')
      );
    };
    subscribe();

    // ページ移動の瞬間に読み込み画面を表示する.
    this.serviceInjection.wiki.pageURI$.subscribe(uri => {
      console.log('pageURI$-onNext', uri);
      // 読み込み中であることを明示.
      this.renderer.cls();
      // await this.loadTemplate();
      this.renderer.println('Start Loading...');
      // 受信する.
      this.renderer.println('Downloading ' + uri + ' .');
    });

    // トップページ読み込みを発火する.
    const uri = (history.state && history.state.pageURI) || '/FrontPage';
    this.serviceInjection.wiki.pageURI$.next(uri);
  }
  /**
   * @override
   */
  async onRender() {
    const statusObj = this.serviceInjection.status._status;
    // 最新のステータス取得.
    statusObj.load();
    // ページ名取得.
    const pageURI = statusObj.getPageURI();

    this.renderer.cls();
  }
  /**
   * Wikiデータ取得()
   * @param {string} uri
   * @return {Promise<string>}
   */
  async getPageHTML(uri) {
    let html;
    const models = this.serviceInjection.models;
    try {
      // クラウドからページデータ取得.
      const pageData = await models.readPage(uri);
      html = pageData.rawText;
    } catch (err) {
      if (err.message === 'Page:NotFound') {
        // ページが存在しなければエラーページを返す.
        html = 'ページがありません。<br>新規作成<br>' + uri;
      } else {
        // それ以外のエラー.
        html = '通信エラーです。' + err.message;
      }
    }
    return html;
  }
  /**
   * ページを移動.
   * @param {string} pageURI
   */
  async move(pageURI = null) {
    const statusObj = this.serviceInjection.status._status;
    // パスを解決.
    const uri = statusObj.resolveURI(pageURI || statusObj.getPageURI());
    statusObj.setPageURI(uri);
    // FixMe パスを解決できなければエラー?
    statusObj.save();

    // ページ上までスクロール.
    this.scroll2Top();

    // ページの読み込みを開始する.
    this.serviceInjection.wiki.pageURI$.next(uri);

    // 履歴に追加する.
    this.pushState(uri);
  }
  /**
   * @override
   */
  onLoad() {
    const self = this;
    const $ = this.$;
    const statusObj = this.serviceInjection.status._status;
    $(function() {
      // <a class="ajaxLoad">をクリックしたら. Wiki内ページリンクを踏んだら.
      $(self.element).on('click', 'a.ajaxLoad', function(event) {
        event.preventDefault(); // 標準ページ移動を無効化.
        /* 連打対策 */
        if (self.doneAjax) {
          self.doneAjax = false;
          // ページを更新.
          (async () => {
            // ページ名を取得する.
            const pageName = $(event.target).data('page');
            // ページを移動する.
            await self.move(pageName);
            // クリック制限を解除.
            self.doneAjax = true;
          })();
        } /* /if */
        return false; // <a>を無効化.
      });

      // ページバック処理時にページ遷移を発動.
      $(top).on('popstate', function(e) {
        const isCanBeHistory =
          history && history.pushState && history.state !== undefined;
        if (isCanBeHistory) {
          // FixMe ページだけでなくアプリの切り替えも行う.

          // パスを解決して現在のURIを書き換える.
          const uri = statusObj.resolveURI(history.state.pageURI);
          statusObj.setPageURI(uri);
          statusObj.save();
          // ページ名をセット.
          self.serviceInjection.wiki.pageURI$.next(uri);
        }
      });
    });
  }
  /**
   * ページ上部へスクロールする.
   */
  scroll2Top() {
    this.$('html,body').animate({ scrollTop: 0 }, 100, 'swing');
  }
}
