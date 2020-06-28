// @ts-check
import CloudNCMB from './class-cloud_ncmb.js';
/**
 * Wiki 構文解析用プラグインクラス.
 * @class
 */
class SyntaxPluginBase {
  /**
   * @param {string} text
   */
  constructor(text) {
    /** 変換前のテキスト. */
    this.rawText = text;
    /** 変換中のテキスト. */
    this.text = text;
    this._cloud = new CloudNCMB();
  }
  /**
   * 編集後の保存前の処理. コメントID割り当て等.
   * @abstract
   * @param {string} rawText
   * @return {Promise<string>}
   */
  async checkBeforeSavingPage(rawText) {
    throw new Error('Not Implemented');
  }
  /**
   * ページ読込後の処理. 構文確認等.
   * @abstract
   * @param {string} rawText
   * @return {Promise<string>}
   */
  async checkAfterLoadingPage(rawText) {
    throw new Error('Not Implemented');
  }
  /**
   * 置換方式の構文チェック.
   * @abstract
   * @param {string} str
   * @return {string}
   */
  static replaceSyntax(str) {
    throw new Error('Not Implemented');
  }
  /**
   * 構文解析実行.
   * @return {Promise<string>}
   */
  async run() {
    throw new Error('Not Implemented');
  }
}

export default SyntaxPluginBase;
