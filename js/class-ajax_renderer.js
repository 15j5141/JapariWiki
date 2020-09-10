import Renderer from './class-renderer.js';
import JWPage from './class-page.js';
/** */
class AjaxRenderer extends Renderer {
  /**
   * @override
   * @param {string} selector
   * @param {string} url
   */
  constructor(selector, url) {
    super();
    this.selector = selector;
    this.url = url;
  }
  /**
   * @override
   * @return {Promise<string>}
   */
  async update(url) {
    // 指定されれば URI を再セット.
    if (url) {
      this.url = url;
    }
    // 受信.
    const html = await AjaxRenderer.ajax(this.url);
    // 描画.
    this.setHTML(html);
    return html;
  }
  /**
   * Promise 化した $.ajax().
   * @param {string} url
   * @return {Promise<string>}
   */
  static async ajax(url) {
    return new Promise((resolve, reject) => {
      top.$.ajax({ url: url }).done(data => {
        resolve(data);
      });
    });
  }
}
export default AjaxRenderer;
