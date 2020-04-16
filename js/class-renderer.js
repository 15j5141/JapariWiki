import JWPage from './class-page.js';
/** */
class Renderer {
  /**
   * @param {string} selector
   */
  constructor(selector) {
    this.selector = selector;
  }
  /**
   * ページを描画する.
   * @param {JWPage} pageClass
   */
  render(pageClass) {
    const rawText = pageClass.rawText;
    // JW独自の構文チェック. AppやPluginを判定.
    JWSyntax.check(rawText);
    // FX2構文の場合.
  }
  /**
   * HTML で書き換える.
   * @param {string} html
   */
  setHTML(html) {
    $(this.selector).html(html);
    $(this.selector).trigger('rewrite');
  }
  /**
   * Text で書き換える.
   * @param {string} text
   */
  setText(text) {
    $(this.selector).text(text);
    $(this.selector).trigger('rewrite');
  }
  /**
   * HTML で追記する.
   * @param {string} html
   */
  print(html) {
    $(this.selector).append(html);
    $(this.selector).trigger('rewrite');
  }
  /**
   * HTML で追記する. 改行あり.
   * @param {string} html
   */
  println(html) {
    $(this.selector).append(html + '</br>');
    $(this.selector).trigger('rewrite');
  }
  /**
   * 描画内容をクリアする.
   * @param {string} html
   */
  cls() {
    $(this.selector).empty();
    $(this.selector).trigger('rewrite');
  }
  /**
   * 対象 DOM を更新.
   * @param {string} html
   * @return {Promise<string>}
   */
  async update(html) {
    this.setHTML(html);
  }
}
export default Renderer;
