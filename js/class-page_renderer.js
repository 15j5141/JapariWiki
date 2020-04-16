import Renderer from './class-renderer.js';
import CloudNCMB from './class-cloud_ncmb.js';
import JWStatus from './jw-status.js';
import WikiSyntaxPlugin from './class-wiki_syntax_plugin.js';
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
    /**
     * 構文解析用クラスのインスタンス一覧を保持.
     * @property {Array<SyntaxPluginBase>}
     */
    this.syntaxes = [new WikiSyntaxPlugin()];
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
      this.println('Downloading.');
      html_ = (await this._cloud.getPage(this._pageURI)).rawText;
    }
    // FixMe 構文解析に通す.
    this.println('Checking Syntax.');
    html_ = await this.convert(html_);
    this.println('Checked Syntax .');

    // 一度ページを非表示に.
    $(this.selector).fadeOut('fast', () => {
      // 描画.
      this.setHTML(html_);
      // 非表示にしていたページを表示する.
      $(this.selector).fadeIn('1');
    });
    return html_;
  }
  /**
   * 描画前にテキストを整形する.
   * @param {string} rawText
   */
  async convert(rawText) {
    let result = rawText;
    // console.log('before:', result);
    for (let i = 0; i < this.syntaxes.length; i++) {
      result = await this.syntaxes[i].checkAfterLoadingPage(result);
    }
    // console.log('after:', result);
    return result;
  }
}
export default PageRenderer;
