import ComponentBase from '../js/class-component_base.js';
/**
 * @class
 */
export default class FooterComponent extends ComponentBase {
  /**
   * @override
   */
  decorator() {
    this.decoration.templateUrl = './footer.html';
    this.decoration.styleUrls = [];
  }
  /**
   * @override
   */
  async onInit() {}
}
