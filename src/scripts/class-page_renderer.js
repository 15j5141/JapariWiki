// @ts-check
import { Renderer } from './';
import { CloudNCMB } from './';
import { JWStatus } from './';
import { WikiSyntaxPlugin } from './';
/** */
export class PageRenderer extends Renderer {
  /**
   * @override
   * @param {Element} element
   * @param {string} pageURI
   */
  constructor(element, pageURI) {
    super(element);
    this._cloud = new CloudNCMB(); // FixMe to delete.
    this._jwStatus = new JWStatus();
    this._pageURI = pageURI;
    /**
     * 構文解析用クラスのインスタンス一覧を保持.
     * @property {Array<SyntaxPluginBase>}
     */
    this.syntaxes = [new WikiSyntaxPlugin('')];
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

    // jQuery を無理やり読込.
    const $ = top.$;
    // 一度ページを非表示に.
    $(this.element).fadeOut('fast', () => {
      // 描画.
      this.setHTML(html_);
      // 非表示にしていたページを表示する.
      $(this.element).fadeIn('1');
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
