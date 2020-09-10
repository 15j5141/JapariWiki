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
    /** クラウド管理変数. */
    this._cloud = new CloudNCMB();
    /** Wiki 状態管理変数. */
    this._status = new JWStatus();

    /* ----- コンポーネント取得. ----- */
  }
  /**
   * クラウド管理変数を取得する.
   * @return {CloudBase}
   */
  getCloud() {
    return this._cloud;
  }
  /**
   * Wiki 状態管理を取得する.
   * @return {{id:string, name:string}}
   */
  getUser() {
    return this._status._status.user;
  }
  /**
   * @param {{id:string, name:string}} user
   */
  setUser(user) {
    this._user = user;
  }
}
