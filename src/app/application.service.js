// @ts-check
import ServiceBase from '../scripts/class-service_base.js';
import WikiApp from './wiki.component.js';
import EditorApp from './editor.component.js';
/**
 * @class
 */
export default class ApplicationService extends ServiceBase {
  /**
   * @override
   */
  decorator() {
    /* ----- デコレータセット. ----- */

    /* ----- プロパティ宣言. ----- */
    /** @type {WikiApp} */
    this.wikiApp = null;
    /** @type {EditorApp} */
    this.editorApp = null;

    /* ----- コンポーネント取得. ----- */
    this.componentsManager
      .getComponents(WikiApp.prototype)
      .subscribe(component => {
        this.wikiApp = component;
      });
    this.componentsManager
      .getComponents(EditorApp.prototype)
      .subscribe(component => {
        this.editorApp = component;
      });
  }
  /**
   * Wiki を開く.
   * @param {string} pageURI
   */
  async openWiki(pageURI) {
    // エディタが開いている場合は閉じる.
    this.editorApp.forceClose();
    // ページ移動する.
    await this.wikiApp.move(pageURI);
  }
  /**
   * エディタを開く.
   * @param {string} pageURI
   */
  async openEditor(pageURI) {
    return await this.editorApp.open(pageURI);
  }
}
