// @ts-check
/** @typedef {import("./class-renderer").default} Renderer */

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
   * 履歴に追加.
   * @param {string} uri
   */
  pushState(uri) {
    top.history.pushState(uri, null, null);
  }
  /**
   *
   */
  onLoad() {}
}
export default AppBase;
