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
