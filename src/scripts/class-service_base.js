// @ts-check
/** @typedef {import("./").ComponentsManager} ComponentsManager */
/** @typedef {import("./").ServiceManager} ServiceManager */

/**
 * @class
 */
export class ServiceBase {
  /**
   * @param {{componentsManager: ComponentsManager, serviceManager: ServiceManager}} referenceObject
   */
  constructor(referenceObject) {
    /** @type {ComponentsManager}*/
    this.componentsManager = referenceObject.componentsManager;
    this.serviceManager = referenceObject.serviceManager;

    /** @type {Object<string, ServiceBase>} */
    this.serviceInjection = {};

    /**
     * @type {Object}
     */
    this.decoration = {};
    this.decorator();

    // サービスを解決する.
    this._inject().then(() => {
      // 依存しているサービスが全て起動したら初期化処理を呼ぶ.
      this.onStart();
    });
  }
  /**
   * 依存解決用のサービス名.
   * @abstract
   */
  get [Symbol.toStringTag]() {
    return 'PleaseOverrideServiceName';
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
  /** @abstract */
  onCreate() {} // onInit

  /** @abstract */
  onStart() {} // didDraw

  /** @abstract */
  onResume() {}
  /** @abstract */
  onPause() {}
  /** @abstract */
  onStop() {}
  /** @abstract */
  onDestroy() {}
  /** @abstract */
  onRestart() {}
}
