// @ts-check
import CloudNCMB from '../scripts/class-cloud_ncmb.js';
import ComponentBase from '../scripts/class-component_base.js';

/**
 * @class
 */
export default class HistoryComponent extends ComponentBase {
  /**
   * @override
   */
  decorator() {}
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
    this._cloud = new CloudNCMB();
  }
}
