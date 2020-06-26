// @ts-check
import CloudNCMB from '../js/class-cloud_ncmb.js';
import ComponentBase from '../js/class-component_base.js';

/**
 * @class
 */
export default class HistoryComponent extends ComponentBase {
  /**
   * @override
   */
  decorator() {
    super.decorator();
    this.decoration.templateUrl = '../text/site_menu.txt';
  }
  /**
   * @override
   */
  async onInit() {
    this._cloud = new CloudNCMB();
  }
}
