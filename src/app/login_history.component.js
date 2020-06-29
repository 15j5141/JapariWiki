// @ts-check
import CloudNCMB from '../scripts/class-cloud_ncmb.js';
import ComponentBase from '../scripts/class-component_base.js';

/**
 * @class
 */
export default class LoginHistoryComponent extends ComponentBase {
  /**
   * @override
   */
  decorator() {
    this.decoration.templateUrl = '../text/site_menu.txt';
    this.html = '';
  }
  /**
   * @override
   */
  async onInit() {
    this._cloud = new CloudNCMB();
    this.html = await this._cloud.getLoginHistory();
  }
  /**
   * @override
   */
  async onRender() {
    this.renderer.setHTML(this.html);
  }
}
