// @ts-check
import ComponentBase from '../scripts/class-component_base.js';
import ApplicationService from './application.service.js';
/**
 * コンポーネントのサンプルコード.
 * @class
 */
export class SampleComponent extends ComponentBase {
  /**
   * @override
   */
  decorator() {
    /* ----- デコレータセット. ----- */
    this.decoration.templateUrl = './template.component.html';
    this.decoration.styleUrls = [];

    /* ----- サービスのインジェクション. ----- */
    /** @type {{application: ApplicationService}} */
    this.serviceInjection = {
      application: ApplicationService.prototype,
    };

    /* ----- プロパティ宣言. ----- */
  }
  /**
   * @override
   */
  async onInit() {}
  /**
   * @override
   */
  async onRender() {}
}
