// @ts-check
import { ComponentBase } from '../scripts';
import { ModelsService, StatusService, WikiService } from './services';
/**
 * デバッグ情報表示用コンポーネント.
 * @class
 */
export class DebugWindowComponent extends ComponentBase {
  /**
   * @override
   */
  decorator() {
    /** @type {{status: StatusService, models: ModelsService, wiki: WikiService}} */
    this.serviceInjection = {
      status: StatusService.prototype,
      models: ModelsService.prototype,
      wiki: WikiService.prototype,
    };

    this.json = {};
  }
  /**
   * @override
   */
  get decoration() {
    return {
      selector: '#debug_window',
      templateUrl: './debug_window.component.html',
      styleUrls: [],
    };
  }

  /**
   * @override
   */
  async onInit() {}
  /**
   * @override
   */
  onStart() {
    const services = this.serviceInjection;

    // 購読して変更を検知する.
    services.status.user$.subscribe(user => {
      this.debug({ user$: user });
    });
    services.status.status$.subscribe(status => {
      this.debug({
        'status$._status': status._status,
      });
    });
    services.wiki.pageURI$.subscribe(pageURI => {
      this.debug({ pageURI$: pageURI });
    });
    services.status.displayState$.subscribe(displayState => {
      this.renderer.html$.next({
        selector: 'div.debug_info__now',
        type: 'html',
        value: displayState,
      });
    });
  }
  /**
   *
   * @param {Object} _json
   */
  debug(_json) {
    /* ログに追記する. */
    const date = new Date();
    const time =
      date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds();
    this.renderer.html$.next({
      selector: 'div.debug_info__log',
      type: 'prepend',
      value: time + '>' + Object.keys(_json).join(',') + '<br>',
    });

    /* 最新のオブジェクトを描画する. */
    this.json = { ...this.json, ..._json };
    const output =
      '<pre>' +
      JSON.stringify(this.json, null, 4)
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;') +
      '</pre>';
    this.renderer.html$.next({
      selector: 'div.debug_info__main',
      type: 'html',
      value: output,
    });
  }
}
