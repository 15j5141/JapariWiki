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
    const html = await AjaxRenderer.ajax({
      url: this.url,
      cache: false,
    });
    // 描画.
    this.setHTML(html);
    return html;
  }
  /**
   * Promise 化した $.ajax().
   * @param {Object} obj
   * @return {Promise<string>}
   */
  static async ajax(obj) {
    return new Promise((resolve, reject) => {
      $.ajax(obj)
        .done(data => {
          resolve(data);
        })
        .fail(err => {
          reject(err);
        });
    });
  }
}
export default AjaxRenderer;
