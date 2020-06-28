// @ts-check
import { ReplaySubject } from 'rxjs';
import { filter } from 'rxjs/operators';
/** @typedef {import('rxjs').Observable} Observable */
/** @typedef {import('./class-component_base.js').default} ComponentBase */

/**
 * 全サービス管理用.
 * @class
 */
export default class ComponentsManager {
  /** */
  constructor() {
    // 追加後に購読しても拾えるように ReplaySubject で処理する.
    /** @type {ReplaySubject<any>} */
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
