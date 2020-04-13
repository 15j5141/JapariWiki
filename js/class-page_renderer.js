import Renderer from './class-renderer.js';
import JWPage from './class-page.js';
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
    this.cloud = new CloudNCMB();
    this.jwStatus = new JWStatus();
    this.pageURI = pageURI;
  }
  /**
   * @override
   * @return {Promise<string>}
   */
  async update(pageURI) {
    // 指定されれば URI を再セット.
    if (pageURI) {
      this.pageURI = pageURI;
    }
    // Wiki ステータスを再取得.
    this.jwStatus.load();
    // パスを解決.
    const uri = this.jwStatus.resolveURI(this.pageURI);
    // 受信.
    const page = await this.cloud.getPage(uri);
    // 描画.
    this.setHTML(page.rawText);
    return page.rawText;
  }
}
export default PageRenderer;
