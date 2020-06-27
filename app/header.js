// @ts-check
import ComponentBase from '../js/class-component_base.js';
/**
 * @class
 */
export default class HeaderComponent extends ComponentBase {
  /**
   * @override
   */
  decorator() {
    this.decoration.templateUrl = './header.html';
    this.decoration.styleUrls = [];
  }
  /**
   * @override
   */
  async onInit() {
    console.log(this.element);
  }
}
