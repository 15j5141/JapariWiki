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

    let html = '';
    // 受信.
    try {
      // クラウドからページデータ取得.
      const pageData = await this.cloud.getPage(uri);
      // FixMe 構文解析に通す.
      html = pageData.rawText;
    } catch (err) {
      if (err.message === 'Page:NotFound') {
        // ページが存在しなければ新規作成.
        console.log('Page:NotFound');
        // FixMe 編集画面へ.
        html = 'ページがありません。<br>新規作成<br>';
      } else {
        // それ以外のエラー.
        console.log(err.message);
        html = '通信エラーです。' + err.message;
      }
    }
    // 一度ページを非表示に.
    $(this.selector).fadeOut('fast', () => {
      // 描画.
      this.setHTML(html);
      $(this.selector).fadeIn('1'); // ページを表示する.
    });
    return html;
  }
}
export default PageRenderer;
