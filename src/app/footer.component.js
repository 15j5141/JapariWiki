// @ts-check
import { ComponentBase } from '../scripts';
/**
 * @class
 */
export class FooterComponent extends ComponentBase {
  /**
   * @override
   */
  decorator() {}
  /**
   * @override
   */
  get decoration() {
    return {
      selector: 'component-footer',
      templateUrl: './footer.component.html',
      styleUrls: [],
    };
  }

  /**
   * @override
   */
  async onInit() {}
}
