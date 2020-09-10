// @ts-check
import CloudNCMB from '../scripts/class-cloud_ncmb.js';
import ComponentBase from '../scripts/class-component_base.js';
import { StatusService } from './status.service.js';

/**
 * @class
 */
export default class SideMainComponent extends ComponentBase {
  /**
   * @override
   */
  decorator() {
    /** @type {StatusService}*/
    this.statusService;

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
      templateUrl: './side_main.component.html',
      styleUrls: [],
      selector: '#side-main',
    };
  }

  /**
   * @override
   */
  async onInit() {}
  /**
   * @override
   */
  async onRender() {
    await super.onRender();
    // FixMe Page からお知らせを取得する.
    this.$element.find('#side-site_notice').html('お知らせはありません。');
    // FixMe ユーザー名を表示する.
    const user = this.serviceInjection.status.getUser();
    this.$element.find('#user_id').text(user.id);
  }
}
