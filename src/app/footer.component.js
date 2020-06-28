import ComponentBase from '../scripts/class-component_base.js';
/**
 * @class
 */
export default class FooterComponent extends ComponentBase {
  /**
   * @override
   */
  decorator() {
    this.decoration.templateUrl = './footer.component.html';
    this.decoration.styleUrls = [];
  }
  /**
   * @override
   */
  async onInit() {}
}
