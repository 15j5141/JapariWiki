// @ts-check
import { ServiceBase, JWPage } from '../../scripts';
import { StatusService } from './';
/** @typedef {import('../../scripts').JWFile} JWFile*/
/**
 * @class
 */
export class ModelsService extends ServiceBase {
  /** @override */
  get [Symbol.toStringTag]() {
    return 'ModelsService';
  }
  /**
   * @override
   */
  decorator() {
    /* ----- デコレータセット. ----- */

    /* ----- プロパティ宣言. ----- */
    /** @type {Array<JWPage>}*/
    this.jwPages = [];

    /* ----- サービスのインジェクション. ----- */
    /** @type {{status: StatusService}} */
    this.serviceInjection = {
      status: StatusService.prototype,
    };

    /* ----- コンポーネント取得. ----- */
  }
  /**
   * ページデータを読み込む.
   * @param {string} pageURI
   * @return {Promise<JWPage>}
   */
  async readPage(pageURI) {
    const cloud = this.serviceInjection.status.getCloud();
    let pageData;
    try {
      // クラウドからページデータ取得.
      pageData = await cloud.getPage(pageURI);
    } catch (err) {
      throw err;
    }
    this.serviceInjection.status.displayState$.next(`readPage ${pageURI}`);
    return pageData;
  }
  /**
   * ページデータを書き込む.
   * @param {JWPage} jwPage
   */
  async writePage(jwPage) {
    const cloud = this.serviceInjection.status.getCloud();
    const pageData = jwPage;
    // null 判定で新規か更新か判断して保存.
    if (pageData.cloudObject) {
      // 更新.
      await cloud.putPage(pageData);
    } else {
      // 新規作成.
      await cloud.postPage(pageData);
    }
    this.serviceInjection.status.displayState$.next(
      `writePage ${pageData.pageURI}`
    );
  }
  /**
   * @return {Promise<Array<{path:string, updateDate:string}>>}
   */
  async readPageHistory() {
    const cloud = this.serviceInjection.status.getCloud();
    return await cloud.getPageHistory();
  }
}
