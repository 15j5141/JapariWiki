// @ts-check
import CloudNCMB from '../scripts/class-cloud_ncmb.js';
import ComponentBase from '../scripts/class-component_base.js';

/**
 * @class
 */
export default class SiteNoticeComponent extends ComponentBase {
  /**
   * @override
   */
  decorator() {
    this.decoration.templateUrl = '../text/site_Notice.txt';
  }
  /**
   * @override
   */
  async onInit() {
    this._cloud = new CloudNCMB();
  }
}
