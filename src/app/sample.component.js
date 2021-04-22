// @ts-check
import ComponentBase from '../scripts/class-component_base.js';
import { IndexService } from './index.service.js';
import { ModelsService } from './models.service.js';
import { StatusService } from './status.service.js';
import { WikiService } from './wiki.service.js';
/**
 * コンポーネントのサンプルコード.
 * @class
 */
export class SampleComponent extends ComponentBase {
  /**
   * @override
   */
  get decoration() {
    return {
      templateUrl: './template.component.html',
      styleUrls: [],
      selector: 'component-sample',
    };
  }
  /**
   * @override
   */
  decorator() {
    /* ----- サービスのインジェクション. ----- */
    /** @type {{status: StatusService, models: ModelsService, wiki: WikiService, index: IndexService}} */
    this.serviceInjection = {
      status: StatusService.prototype,
      models: ModelsService.prototype,
      wiki: WikiService.prototype,
      index: IndexService.prototype,
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
  async onStart() {}
}
