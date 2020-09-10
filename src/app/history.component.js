// @ts-check
import CloudNCMB from '../scripts/class-cloud_ncmb.js';
import ComponentBase from '../scripts/class-component_base.js';
import { StatusService } from './status.service.js';
import ApplicationService from './application.service.js';

/**
 * @class
 */
export default class HistoryComponent extends ComponentBase {
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
  static get decoration() {
    return {
      templateUrl: '../text/site_menu.txt',
      styleUrls: [],
      selector: '#side-edited_history',
    };
  }

  /**
   * @override
   */
  async onInit() {
    this.status = this.serviceInjection.status;
  }
  /** @override */
  async onRender() {
    const cloud = this.status.getCloud();
  }
  /** @override */
  onLoad() {}
}
