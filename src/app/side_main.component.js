// @ts-check
import ComponentBase from '../scripts/class-component_base.js';
import { StatusService } from './status.service.js';
import { filter } from 'rxjs/operators';

/**
 * @class
 */
export default class SideMainComponent extends ComponentBase {
  /**
   * @override
   */
  decorator() {
    /** @type {StatusService}*/
    this.statusService;

    /** @type {{status: StatusService}} */
    this.serviceInjection = {
      status: StatusService.prototype,
    };
  }
  /**
   * @override
   */
  get decoration() {
    return {
      templateUrl: './side_main.component.html',
      styleUrls: [],
      selector: 'component-side_main',
    };
  }

  /**
   * @override
   */
  async onInit() {}
  /**
   * @override
   */
  async onRender() {
    await super.onRender();
    // FixMe Page からお知らせを取得する.
    this.$element.find('#side-site_notice').html('お知らせはありません。');
  }
  /**
   * @override
   */
  onStart() {
    // 初期描画時にデータバインディングを予約する.
    this.serviceInjection.status.user$
      .pipe(filter(user => user !== null)) // 初期値は無視する.
      .subscribe(user => {
        this.renderer.html$.next({ selector: '#user_id', value: user.id });
      });
  }
}
