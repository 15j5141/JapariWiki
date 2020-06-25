import Renderer from './class-renderer.js';

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
