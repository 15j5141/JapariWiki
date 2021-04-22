// @ts-check
import ServiceBase from '../scripts/class-service_base.js';
import JWPage from '../scripts/class-page.js';
import { StatusService } from './status.service.js';
import IndexService from './index.service.js';
/** @typedef {import('../scripts/class-cloud_base.js').JWFile} JWFile*/
import ModelsService from './models.service.js';

import WikiSyntaxPlugin from '../scripts/class-wiki_syntax_plugin.js';

/**
 * @class
 */
export default class EditorService extends ServiceBase {
  /** @override */
  get [Symbol.toStringTag]() {
    return 'EditorService';
  }
  /**
   * @override
   */
  decorator() {
    /* ----- デコレータセット. ----- */

    /* ----- プロパティ宣言. ----- */
    /**
     * 構文解析用クラスのインスタンス一覧を保持.
     * @property {Array<SyntaxPluginBase>}
     */
    this.syntaxes = [new WikiSyntaxPlugin('')];

    /* ----- サービスのインジェクション. ----- */
    /** @type {{status: StatusService, index: IndexService, models: ModelsService}} */
    this.serviceInjection = {
      status: StatusService.prototype,
      index: IndexService.prototype,
      models: ModelsService.prototype,
    };

    /* ----- コンポーネント取得. ----- */
  }
  /**
   * 編集後の保存前の処理. コメントID割り当て等.
   * @param {string} rawText
   * @return {Promise<string>}
   */
  async checkBeforeSavingPage(rawText) {
    return this.syntaxes[0].checkBeforeSavingPage(rawText);
  }
  /**
   * 置換方式の構文チェック.
   * @param {string} rawText
   * @return {string}
   */
  replaceSyntax(rawText) {
    return this.syntaxes[0].replaceSyntax(rawText);
  }
  /**
   * ページデータを読み込む.
   * @param {string} pageURI
   */
  async readPage(pageURI) {
    const models = this.serviceInjection.models;
    const pageData = await models.readPage(pageURI).catch(err => {
      if (err.message === 'Page:NotFound') {
        // ページがなければ新規作成して処理続行.
        return new JWPage(pageURI, 'Hello, World!', {});
      } else if (err.message === 'Page:PermissionError') {
        // 指定ページへのアクセス権がない場合.
        alert('権限がありません.');
      } else {
        throw err;
      }
    });
    return pageData;
  }
  /**
   * ページデータを書き込む.
   * @param {JWPage} pageData
   */
  async writePage(pageData) {
    const models = this.serviceInjection.models;
    await models.writePage(pageData);
  }
}
