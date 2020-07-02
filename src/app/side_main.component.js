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
    super.onRender();
    const $elem = this.$(this.element);
    // FixMe Page からお知らせを取得する.
    $elem.find('#side-site_notice').html('お知らせはありません。');
    // FixMe ユーザー名を表示する.
    $elem.find('#user_id').text(this.serviceInjection.status.getUser().id);
  }
}
