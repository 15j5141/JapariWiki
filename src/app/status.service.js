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
    /** @type {JWStatus} Wiki 状態管理変数. */
    this._status = null;
    /** @type {BehaviorSubject<JWStatus>} */
    this.status$ = new BehaviorSubject(new JWStatus());
    this.user$ = new BehaviorSubject({ id: 'id', name: 'name' });
    this.status$.subscribe(status => {
      this._status = status;
      // 更新されたステータス情報からユーザ情報を伝播させる.
      this.user$.next(status._status.user);
    });


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
    // ステータスオブジェクトを取得する.
    return this.status$.getValue()._status.user;
  }
  /**
   * @param {{id:string, name:string}} user
   */
  setUser(user) {
    // ステータスオブジェクトを取得する.
    const status = this.status$.getValue();
    // ユーザー情報を含めて反映する.
    status._status.user = user;
    this.status$.next(status);
  }
}
