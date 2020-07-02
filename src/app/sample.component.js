// @ts-check
import ComponentBase from '../scripts/class-component_base.js';
import ApplicationService from './application.service.js';
import { StatusService } from './status.service.js';
/**
 * コンポーネントのサンプルコード.
 * @class
 */
export class SampleComponent extends ComponentBase {
  /**
   * @override
   */
  static get decoration() {
    return {
      templateUrl: './template.component.html',
      styleUrls: [],
      selector: '#side-custom_menu',
    };
  }
  /**
   * @override
   */
  decorator() {
    /* ----- サービスのインジェクション. ----- */
    /** @type {{status: StatusService, application: ApplicationService}} */
    this.serviceInjection = {
      status: StatusService.prototype,
      application: ApplicationService.prototype,
    };

    /* ----- プロパティ宣言. ----- */
  }
  /**
   * @override
   */
  async onInit() {}
  /**
   * @override
   */
  async onRender() {}
}
