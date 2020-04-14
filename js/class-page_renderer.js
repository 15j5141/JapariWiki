import Renderer from './class-renderer.js';
import CloudNCMB from './class-cloud_ncmb.js';
import JWStatus from './jw-status.js';
/** */
class PageRenderer extends Renderer {
  /**
   * @override
   * @param {string} selector
   * @param {string} pageURI
   */
  constructor(selector, pageURI) {
    super();
    this.selector = selector;
    this._cloud = new CloudNCMB();
    this._jwStatus = new JWStatus();
    this._pageURI = pageURI;
  }
  /**
   * @override
   * @param {string} html
   * @return {Promise<string>}
   */
  async update(html = null) {
    let html_ = html;
    if (!html_ && this._pageURI) {
      // html 引数未指定かつインスタンス生成時 pageURI 指定でページ自動取得.
      html_ = (await this._cloud.getPage(this._pageURI)).rawText;
    }
    console.log(html_);
    // FixMe 構文解析に通す.

    // 一度ページを非表示に.
    $(this.selector).fadeOut('fast', () => {
      // 描画.
      this.setHTML(html_);
      // 非表示にしていたページを表示する.
      $(this.selector).fadeIn('1');
    });
    return html_;
  }
}
export default PageRenderer;
