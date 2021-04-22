// @ts-check
/** @typedef {import("./class-service_base").ServiceBase} ServiceBase */
import { Observable } from 'rxjs';
import { ReplaySubject } from 'rxjs';
import { find } from 'rxjs/operators';

/**
 * 全サービス管理用.
 * @class
 */
export default class ServiceManager {
  /** */
  constructor() {
    // 追加後に購読しても拾えるように ReplaySubject で処理する.
    /** @type {ReplaySubject<any>} */
    this.services$ = new ReplaySubject();
  }
  /**
   * サービスを登録する.
   * @param {ServiceBase} service
   */
  register(service) {
    // ストリームに追加する.
    this.services$.next(service);
  }
  /**
   * 登録済みのサービスから取得する.
   * @template T
   * @param {T} serviceClassPrototype
   * @return {Observable<T>}
   * @example getService(XxxService.prototype)
   */
  getService(serviceClassPrototype) {
    return this.services$.pipe(
      // 検索する.
      find(
        service => service.toString() === serviceClassPrototype.toString()
        // constructor.name はminifyされると怪しい.
        // instanceof はlib/jwと内蔵jwとでclassがminifyによって一致しない.
      )
    );
  }
}
