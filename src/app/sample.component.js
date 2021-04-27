// @ts-check
import { ComponentBase } from '../scripts';
import { IndexService } from './services';
import { ModelsService } from './services';
import { StatusService } from './services';
import { WikiService } from './services';
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
