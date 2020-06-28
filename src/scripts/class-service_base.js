// @ts-check
/** @typedef {import("./class-components_manager").default} ComponentsManager */

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
  /** */
  open() {}
}
