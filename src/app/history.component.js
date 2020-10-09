// @ts-check
import ComponentBase from '../scripts/class-component_base.js';
import { StatusService } from './status.service.js';
import ApplicationService from './application.service.js';
import ModelsService from './models.service.js';
import { filter } from 'rxjs/operators';

/**
 * @class
 */
export default class HistoryComponent extends ComponentBase {
  /**
   * @override
   */
  decorator() {
    /* ----- サービスのインジェクション. ----- */
    /** @type {{status: StatusService, application: ApplicationService, models: ModelsService}} */
    this.serviceInjection = {
      status: StatusService.prototype,
      application: ApplicationService.prototype,
      models: ModelsService.prototype,
    };

    /* ----- プロパティ宣言. ----- */
  }
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
    this.status = this.serviceInjection.status;
  }
  /** @override */
  async onRender() {}
  /** @override */
  onLoad() {}
  /**
   * @override
   */
  onStart() {
    // 初期描画時にデータバインディングを予約する.
    this.serviceInjection.status.user$
      .pipe(filter(user => user !== null)) // 初期値は無視する.
      .subscribe(user => {
        this.serviceInjection.models.readPageHistory().then(history => {
          const html = history
            .map(h => {
              return `<div>${h.updateDate}<br><a data-page="${h.path}">${h.path}</a></div>`;
            })
            .join('\n');
          this.renderer.html$.next({ selector: '', value: html });
        });
      });
  }
}
