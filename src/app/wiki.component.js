// @ts-check
import PageRenderer from '../scripts/class-page_renderer.js';
import CloudNCMB from '../scripts/class-cloud_ncmb.js';
import ComponentBase from '../scripts/class-component_base.js';

/**
 * @class
 */
export default class WikiApp extends ComponentBase {
  /**
   * @override
   */
  decorator() {
    this.decoration.templateUrl = './wiki.component.html';
    this.renderer = new PageRenderer(this.refObj.selector, null);
  }
  /**
   * @override
   */
  async onInit() {
    this._cloud = new CloudNCMB();
    /** リンク連打対策用. */
    this.doneAjax = true;
  }
  /**
   * @override
   */
  async onRender() {
    // 最新のステータス取得.
    this.refObj.status.load();
    // ページ名取得.
    const pageURI = this.refObj.status.getPageURI();

    // 読み込み中であることを明示.
    this.renderer.cls();
    // await this.loadTemplate();
    this.renderer.println('Start Loading...');
    // 受信する.
    this.renderer.println('Downloading.');
    const html = await this.getPageData(pageURI);
    this.renderer.println('Downloaded.');
    // 構文解析して描画.
    this.renderer.update(html);

    // タイトル書き換え.
    this.$(top.document.querySelector('title')).text(pageURI);
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
    const uri = this.refObj.status.resolveURI(
      pageURI || this.refObj.status.getPageURI()
    );
    this.refObj.status.setPageURI(uri);
    // FixMe パスを解決できなければエラー?
    this.refObj.status.save();

    // ページ上までスクロール.
    this.scroll2Top();

    // 受信して描画.
    await this.draw();
    // 履歴に追加する.
    this.pushState(uri);
  }
  /**
   * @override
   */
  onLoad() {
    const self = this;
    const $ = this.$;
    $(function() {
      // <a class="ajaxLoad">をクリックしたら. Wiki内ページリンクを踏んだら.
      $(self.refObj.selector).on('click', 'a.ajaxLoad', function(event) {
        event.preventDefault(); // 標準ページ移動を無効化.
        /* 連打対策 */
        if (self.doneAjax) {
          self.doneAjax = false;

          // ページを更新.
          (async () => {
            // <a data-page="ページ名">を取得.
            const pageName = $(event.target).data('page');
            await self.move(pageName).catch(err => {
              console.error(err);
            });
            // クリック制限を解除.
            self.doneAjax = true;
          })();
        } /* /if */
        return false; // <a>を無効化.
      });

      // ページバック処理時にページ遷移を発動.
      $(top).on('popstate', function(e) {
        if (!e.originalEvent.state) return;
        const isCanBeHistory =
          history && history.pushState && history.state !== undefined;
        if (isCanBeHistory) {
          // FixMe ページだけでなくアプリの切り替えも行う.

          // パスを解決して現在のURIを書き換える.
          const uri = self.refObj.status.resolveURI(e.originalEvent.state);
          self.refObj.status.setPageURI(uri);
          self.refObj.status.save();
          // ページ再描画.
          self.draw();
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
