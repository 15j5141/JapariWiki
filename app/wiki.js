// import * as convertHTML from "js/module_convertHTML.js";
import JWStatus from '../js/jw-status.js';
import PageRenderer from '../js/class-page_renderer.js';
import CloudNCMB from '../js/class-cloud_ncmb.js';
import AppBase from '../js/class-app_base.js';

/**
 * Wiki 描画用クラス.
 * @class
 */
class WikiRenderer extends PageRenderer {}

/**
 * @class
 */
class WikiApp extends AppBase {
  /**
   * @override
   * @param {string} selector
   */
  constructor(selector) {
    super(selector);
    this._renderer = new WikiRenderer(selector);
    this._jwStatus = new JWStatus();
    this._cloud = new CloudNCMB();
  }
  /**
   * @override
   */
  async onRender() {
    // 最新のステータス取得.
    this._jwStatus.load();
    // ページ名取得.
    const pageURI = this._jwStatus.getPageURI();

    // 読み込み中であることを明示.
    this._renderer.setText('読み込み中・・・。');
    // 受信する.
    const html = await this.getPageData(pageURI);
    // 構文解析して描画.
    this._renderer.update(html);
  }
  /**
   * Wikiデータ取得()
   * @param {string} uri
   * @return {Promise<string>}
   */
  async getPageData(uri) {
    let html;
    try {
      // クラウドからページデータ取得.
      const pageData = await this._cloud.getPage(uri);
      html = pageData.rawText;
    } catch (err) {
      if (err.message === 'Page:NotFound') {
        // ページが存在しなければエラーページを返す.
        html = 'ページがありません。<br>新規作成<br>';
      } else {
        // それ以外のエラー.
        html = '通信エラーです。' + err.message;
      }
    }
    return html;
  }
  /**
   * ページを移動.
   * @param {string} pageURI
   */
  async move(pageURI = null) {
    // パスを解決.
    const uri = this._jwStatus.resolveURI(
      pageURI || this._jwStatus.getPageURI()
    );
    this._jwStatus.setPageURI(uri);
    // FixMe パスを解決できなければエラー?
    this._jwStatus.save();
    // 受信して描画.
    this.onRender();
  }
}
export default WikiApp;
