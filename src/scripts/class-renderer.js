// @ts-check
/** */
class Renderer {
  /**
   * @param {Element} element
   */
  constructor(element) {
    this.element = element;
  }
  /**
   * HTML で書き換える.
   * @param {string} html
   */
  setHTML(html) {
    this.element.innerHTML = html;
  }
  /**
   * Text で書き換える.
   * @param {string} text
   */
  setText(text) {
    this.element.textContent = text;
  }
  /**
   * HTML で追記する.
   * @param {string} html
   */
  print(html) {
    this.element.innerHTML += html;
  }
  /**
   * HTML で追記する. 改行あり.
   * @param {string} html
   */
  println(html) {
    this.element.innerHTML += html + '</br>';
  }
  /**
   * 描画内容をクリアする.
   */
  cls() {
    this.element.innerHTML = null;
  }
  /**
   * 対象 DOM を更新.
   * @param {string} html
   * @return {Promise<string>}
   */
  async update(html) {
    this.setHTML(html);
    return html;
  }
}
export default Renderer;
