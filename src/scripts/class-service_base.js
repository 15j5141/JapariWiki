// @ts-check
import ComponentBase from './class-component_base.js';
import ComponentsManager from './class-components_manager.js';

/**
 * @class
 */
export default class ServiceBase {
  /**
   * @param {{componentsManager: ComponentsManager}} referenceObject
   */
  constructor(referenceObject) {
    /** @type {ComponentsManager}*/
    this.componentsManager = referenceObject.componentsManager;

    /**
     * @type {Object}
     */
    this.decoration = {};
    this.decorator();
  }
  /**
   * 疑似デコレーター.
   * @abstract
   */
  decorator() {}
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
