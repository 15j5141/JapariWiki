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
    this.decoration.templateUrl = './side_main.component.html';
    /** @type {StatusService}*/
    this.statusService;
    this.refObj.serviceManager
      .getService(StatusService.prototype)
      .subscribe(service => {
        this.statusService = service;
      });
  }
  /**
   * @override
   */
  async onInit() {
    this._cloud = new CloudNCMB();
  }
  /**
   * @override
   */
  async onRender() {
    super.onRender();
    const $elem = this.$(this.element);
    // FixMe Page からお知らせを取得する.
    $elem.find('#side-site_notice').html('お知らせはありません。');
    // FixMe ユーザー名を表示する.
    $elem.find('#user_id').text(this.statusService.user.id);
  }
}
