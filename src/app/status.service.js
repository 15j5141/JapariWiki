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
    this._cloud = new CloudNCMB();
    this._status = new JWStatus();
    this._user = this._status._status.user;

    /* ----- コンポーネント取得. ----- */
  }
  /**
   * @return {CloudBase}
   */
  getCloud() {
    return this._cloud;
  }
  /**
   * @return {{id:string, name:string}}
   */
  getUser() {
    return this._user;
  }
  /**
   * @param {{id:string, name:string}} user
   */
  setUser(user) {
    this._user = user;
  }
}
