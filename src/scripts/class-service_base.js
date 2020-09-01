// @ts-check
/** @typedef {import("./class-components_manager").default} ComponentsManager */
/** @typedef {import("./class-service_manager").default} ServiceManager */

/**
 * @class
 */
export default class ServiceBase {
  /**
   * @param {{componentsManager: ComponentsManager, serviceManager: ServiceManager}} referenceObject
   */
  constructor(referenceObject) {
    /** @type {ComponentsManager}*/
    this.componentsManager = referenceObject.componentsManager;
    this.serviceManager = referenceObject.serviceManager;

    /**
     * @type {Object}
     */
    this.decoration = {};
    this.decorator();

    /** @type {Object<string, ServiceBase>} */
    this.serviceInjection = {};
  }
  /**
   * 疑似デコレーター.
   * @abstract
   */
  decorator() {}
  /**
   * this.injectionService の中身の参照を解決する.
   * @return {Promise<void>}
   */
  async _inject() {
    const self = this;
    // 全てのサービス解決まで待つ.
    await Promise.all([
      // this.injection にセットされたサービス一覧を取得する.
      ...Object.keys(self.serviceInjection).map(key => {
        return new Promise((resolve, reject) => {
          // サービスを serviceManager で解決する.
          self.serviceManager
            .getService(self.serviceInjection[key])
            .subscribe(service => {
              self.serviceInjection[key] = service;
              resolve();
            });
        });
      }),
    ]);
  }
  /** */
  open() {}
}
