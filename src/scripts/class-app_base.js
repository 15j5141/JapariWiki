// @ts-check
/** @typedef {import("./").Renderer} Renderer */

/**
 * @class
 */
class AppBase {
  // WikiRenderContext
  /**
   * @param {string} selector
   */
  constructor(selector) {
    /** アプリが描画される DOM セレクター. */
    this.selector = selector;
    /** @type {Renderer} */
    this._renderer = null;
  }
  /**
   * 描画させる.
   * @return {Promise<void>}
   */
  async onRender() {
    this._renderer.update();
  }
  /**
   * fetch.
   * @param {string} url
   */
  async fetch(url) {
    return new Promise((resolve, reject) => {
      top.$.ajax({ url: url }).done(data => {
        resolve(data);
      });
    });
  }
  /**
   *
   */
  onLoad() {}
}
export default AppBase;
