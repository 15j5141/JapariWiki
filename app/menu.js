// @ts-check
import ComponentBase from '../js/class-component_base';
import PageRenderer from '../js/class-page_renderer';
import CloudNCMB from '../js/class-cloud_ncmb';

/**
 * @class
 */
export default class MenuComponent extends ComponentBase {
  /**
   * @override
   */
  decorator() {
    this.decoration.templateUrl = null;
    this.renderer = new PageRenderer(this.refObj.selector, '/site_/SideMenu');
  }
  /**
   * @override
   */
  async onInit() {
    this._cloud = new CloudNCMB();
  }
}
