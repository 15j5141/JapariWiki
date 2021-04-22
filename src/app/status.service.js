// @ts-check
import ServiceBase from '../scripts/class-service_base.js';
import CloudNCMB from '../scripts/class-cloud_ncmb.js';
import JWStatus from '../scripts/jw-status.js';
import { BehaviorSubject } from 'rxjs';
/** @typedef {import("../scripts/class-cloud_base").default} CloudBase */
/** @typedef {import("../scripts/class-cloud_base").JWUser} JWUser */

/**
 * ユーザー名やログイン状況等を管理する.
 * @class
 */
export class StatusService extends ServiceBase {
  /** @override */
  get [Symbol.toStringTag]() {
    return 'StatusService';
  }
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
    /** @type {BehaviorSubject<JWUser>} */
    this.user$ = new BehaviorSubject(null);
    // ステータス情報の更新を伝える.
    this.status$.subscribe(status => {
      this._status = status;
      // 更新されたステータス情報からユーザ情報を伝播させる.
      this.user$.next(status._status.user);
    });
    /** @type {BehaviorSubject<string>} 画面に表示する状態文字列(1行). */
    this.displayState$ = new BehaviorSubject(null);

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
    return this.user$.getValue();
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
