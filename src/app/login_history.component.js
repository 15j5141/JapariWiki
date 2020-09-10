// @ts-check
import CloudNCMB from '../scripts/class-cloud_ncmb.js';
import ComponentBase from '../scripts/class-component_base.js';
import { StatusService } from './status.service.js';

/**
 * @class
 */
export default class LoginHistoryComponent extends ComponentBase {
  /**
   * @override
   */
  decorator() {
    this.html = '';
    /* ----- サービスのインジェクション. ----- */
    /** @type {{status: StatusService}} */
    this.serviceInjection = {
      status: StatusService.prototype,
    };
  }
  /**
   * @override
   */
  static get decoration() {
    return {
      templateUrl: '../text/site_menu.txt',
      styleUrls: [],
      selector: '#side-login_history',
    };
  }

  /**
   * @override
   */
  async onInit() {
    const cloud = this.serviceInjection.status.getCloud();
    this.html = await cloud.getLoginHistory().catch(e => {
      if (e.message === 'JWCloud:Unauthorized') {
        return '';
      }
    });
  }
  /**
   * @override
   */
  async onRender() {
    this.renderer.setHTML(this.html);
  }
}
