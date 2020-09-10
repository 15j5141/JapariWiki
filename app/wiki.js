// import * as convertHTML from "js/module_convertHTML.js";
import JWStatus from '../js/jw-status.js';
import PageRenderer from '../js/class-page_renderer.js';
import CloudNCMB from '../js/class-cloud_ncmb.js';
import AppBase from '../js/class-app_base.js';

/**
 * Wiki 描画用クラス.
 * @class
 */
class WikiRenderer extends PageRenderer {}

/**
 * @class
 */
class WikiApp extends AppBase {
  /**
   * @override
   * @param {string} selector
   */
  constructor(selector) {
    super(selector);
    this._renderer = new WikiRenderer(selector);
    this._jwStatus = new JWStatus();
    this._cloud = new CloudNCMB();
    this.htmlByFetch = this.fetch('app/wiki.html').then(data => {
      return data;
    });

    /** リンク連打対策用. */
    this.doneAjax = true;
    this.$ = top.jQuery;
    // イベント登録する.
    this.onLoad();
  }
  /**
   * @override
   */
  async onRender() {
    // 最新のステータス取得.
    this._jwStatus.load();
    // ページ名取得.
    const pageURI = this._jwStatus.getPageURI();

    // 読み込み中であることを明示.
    this._renderer.cls();
    const test = await this.htmlByFetch;
    // console.log(test);
    this._renderer.setHTML(test);
    this._renderer.println('Start Loading...');
    // 受信する.
    this._renderer.println('Downloading.');
    const html = await this.getPageData(pageURI);
    this._renderer.println('Downloaded.');
    // 構文解析して描画.
    this._renderer.update(html);
  }
  /**
   * Wikiデータ取得()
   * @param {string} uri
   * @return {Promise<string>}
   */
  async getPageData(uri) {
    let html;
    try {
      // クラウドからページデータ取得.
      const pageData = await this._cloud.getPage(uri);
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
    // パスを解決.
    const uri = this._jwStatus.resolveURI(
      pageURI || this._jwStatus.getPageURI()
    );
    this._jwStatus.setPageURI(uri);
    // FixMe パスを解決できなければエラー?
    this._jwStatus.save();
    // 受信して描画.
    this.onRender();
  }
  /**
   * @override
   */
  onLoad() {
    const self = this;
    self.$(function($) {
      // <a class="ajaxLoad">をクリックしたら. Wiki内ページリンクを踏んだら.
      $(self._renderer.selector, top.document).on(
        'click',
        'a.ajaxLoad',
        function(event) {
          event.preventDefault(); // 標準ページ移動を無効化.
          /* 連打対策 */
          if (self.doneAjax) {
            self.doneAjax = false;

            // ページ上までスクロール.
            // top.scroll2Top();

            // ページを更新.
            (async () => {
              // <a data-page="ページ名">を取得.
              const pageName = $(event.target).data('page');
              await self.move(pageName).catch(err => {
                console.error(err);
              });
              const uri = self._jwStatus.resolveURI(pageName);

              // 履歴に追加する.
              self.pushState(uri);
              // クリック制限を解除.
              self.doneAjax = true;
              // 遷移を履歴に追加.
              top.history.pushState('' + pageName, null, null);
            })();
          } /* /if */
          return false; // <a>を無効化.
        }
      );
    });
  }
  /**
   * ページ上部へスクロールする.
   */
  scroll2Top() {
    this.$('html,body', top.document).animate({ scrollTop: 0 }, 100, 'swing');
  }
}

export default WikiApp;
