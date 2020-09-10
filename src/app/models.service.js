// @ts-check
import ServiceBase from '../scripts/class-service_base.js';
import JWPage from '../scripts/class-page.js';
import { StatusService } from './status.service.js';
import ApplicationService from './application.service.js';
/** @typedef {import('../scripts/class-cloud_base.js').JWFile} JWFile*/
/**
 * @class
 */
export default class ModelsService extends ServiceBase {
  /**
   * @override
   */
  decorator() {
    /* ----- デコレータセット. ----- */

    /* ----- プロパティ宣言. ----- */
    /** @type {Array<JWPage>}*/
    this.jwPages = [];

    /* ----- サービスのインジェクション. ----- */
    /** @type {{status: StatusService, application: ApplicationService}} */
    this.serviceInjection = {
      status: StatusService.prototype,
      application: ApplicationService.prototype,
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
  }
}
