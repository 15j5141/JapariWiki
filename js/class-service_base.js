// @ts-check
import ComponentBase from './class-component_base.js';

/**
 * @class
 */
export default class ServiceBase {
  /** */
  constructor() {
    /**
     * @type {Object<string, ComponentBase>}
     */
    this.components = {};
  }
  /**
   * 管理するコンポーネントを追加する.
   * @param {string} id
   * @param {ComponentBase} component
   */
  addComponent(id, component) {
    this.components[id] = component;
  }
  /** */
  open() {}
}
