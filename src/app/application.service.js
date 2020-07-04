// @ts-check
import ServiceBase from '../scripts/class-service_base.js';
import WikiApp from './wiki.component.js';
import EditorApp from './editor.component.js';
import { UploaderComponent } from './uploader.component.js';
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
    /** @type {boolean} 連打対策等の制御用真理値. */
    this.canOpenWiki = true;
    /** @type {UploaderComponent} */
    this.uploaderApp = null;
    /** オンオフ制御用 */
    this.isOpenUploader = false;

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
    // 連打対策.
    if (!this.canOpenWiki) return;
    // 一度開けないようにする.
    this.canOpenWiki = false;

    // エディタが開いている場合は閉じる.
    this.editorApp.forceClose();
    // ページ移動する.
    await this.wikiApp.move(pageURI);

    // 遷移完了したので解放する.
    this.canOpenWiki = true;
  }
  /**
   * エディタを開く.
   * @param {string} pageURI
   */
  async openEditor(pageURI) {
    // エディタが開いている場合は閉じる.
    this.editorApp.forceClose();
    await this.editorApp.open(pageURI);
    return;
  }
  /**
   * アップロード画面を出す.
   */
  async openUploader() {
    await this.uploaderApp.open();
  }
  /**
   * アップロード画面を閉じる.
   */
  async closeUploader() {
    await this.uploaderApp.close();
  }
  /**
   * アップロード画面をオンオフする.
   */
  async toggleUploader() {
    if (this.isOpenUploader) {
      await this.closeUploader();
    } else {
      await this.openUploader();
    }
    this.isOpenUploader = !this.isOpenUploader;
  }
}
