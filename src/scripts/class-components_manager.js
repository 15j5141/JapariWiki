import { ReplaySubject, Observable } from 'rxjs';
import { filter } from 'rxjs/operators';
import ServiceBase from './class-service_base.js';
import ComponentBase from './class-component_base.js';

/**
 * 全サービス管理用.
 * @class
 */
export default class ComponentsManager {
  /** */
  constructor() {
    // 追加後に購読しても拾えるように ReplaySubject で処理する.
    /** @type {ReplaySubject<ServiceBase>} */
    this.components$ = new ReplaySubject();
  }
  /**
   * サービスを登録する.
   * @param {ComponentBase} component
   */
  register(component) {
    // ストリームに追加する.
    this.components$.next(component);
  }
  /**
   * 登録済みのコンポーネントから取得する.
   * @template T
   * @param {T} componentClassPrototype
   * @return {Observable<T>}
   * @example getComponents(XxxComponent.prototype)
   */
  getComponents(componentClassPrototype) {
    return this.components$.pipe(
      // 検索する.
      filter(
        service =>
          service.constructor.name === componentClassPrototype.constructor.name
      )
    );
  }
}
