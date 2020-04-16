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
    this.renderer = null;
  }
  /**
   * 描画させる.
   * @return {Promise<void>}
   */
  async onRender() {
    this.renderer.update();
  }
}
export default AppBase;
