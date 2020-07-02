// @ts-check
import ComponentBase from '../scripts/class-component_base.js';
/**
 * @class
 */
export default class FooterComponent extends ComponentBase {
  /**
   * @override
   */
  decorator() {}
  /**
   * @override
   */
  static get decoration() {
    return {
      selector: '#footer',
      templateUrl: './footer.component.html',
      styleUrls: [],
    };
  }

  /**
   * @override
   */
  async onInit() {}
}
