// @ts-check
import ServiceBase from '../scripts/class-service_base.js';
import CloudNCMB from '../scripts/class-cloud_ncmb.js';
import JWStatus from '../scripts/jw-status.js';
/** @typedef {import("../scripts/class-cloud_base").default} CloudBase */

/**
 * ユーザー名やログイン状況等を管理する.
 * @class
 */
export class StatusService extends ServiceBase {
  /** @override */
  decorator() {
    /* ----- デコレータセット. ----- */
    /* ----- プロパティ宣言. ----- */
    this.cloud = new CloudNCMB();
    this.status = new JWStatus();
    this.user = this.status._status.user;

    /* ----- コンポーネント取得. ----- */
  }
  /**
   * @return {CloudBase}
   */
  getCloud() {
    return this.cloud;
  }
  /**
   * @return {{id:string, name:string}}
   */
  getUser() {
    return this.user;
  }
  /**
   * @param {{id:string, name:string}} user
   */
  setUser(user) {
    this.user = user;
  }
}
