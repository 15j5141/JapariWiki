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
    const element = document.querySelector(this.selector);
    element.innerHTML = html;
  }
  /**
   * Text で書き換える.
   * @param {string} text
   */
  setText(text) {
    const element = document.querySelector(this.selector);
    element.textContent = text;
  }
  /**
   * HTML で追記する.
   * @param {string} html
   */
  print(html) {
    const element = document.querySelector(this.selector);
    element.innerHTML += html;
  }
  /**
   * HTML で追記する. 改行あり.
   * @param {string} html
   */
  println(html) {
    const element = document.querySelector(this.selector);
    element.innerHTML += html + '</br>';
  }
  /**
   * 描画内容をクリアする.
   */
  cls() {
    const element = document.querySelector(this.selector);
    element.innerHTML = null;
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
