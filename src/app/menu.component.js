// @ts-check
import ComponentBase from '../scripts/class-component_base.js';
import PageRenderer from '../scripts/class-page_renderer.js';
import ApplicationService from './application.service.js';

/**
 * @class
 */
export default class MenuComponent extends ComponentBase {
  /**
   * @override
   */
  decorator() {
    this.decoration.templateUrl = null;
    this.renderer = new PageRenderer(this.refObj.selector, '/site_/SideMenu');
    /** @type {{application: ApplicationService}} */
    this.serviceInjection = {
      application: ApplicationService.prototype,
    };
  }
  /**
   * @override
   */
  async onInit() {}
  /**
   * @override
   */
  onLoad() {
    const self = this;
    self.$(function($) {
      // メニューのリンクからもページを移動できるようにする.
      $(self.refObj.selector).on('click', 'a.ajaxLoad', e => {
        e.preventDefault(); // 標準ページ移動を無効化.
        /* 連打対策 */
        if (self.doneAjax) {
          self.doneAjax = false;

          // ページ上までスクロール.
          // top.scroll2Top();

          // ページを更新.
          (async () => {
            // <a data-page="ページ名">を取得.
            const pageName = $(e.target).data('page');
            await self.serviceInjection.application
              .openWiki(pageName)
              .catch(err => {
                console.error(err);
              });
            // クリック制限を解除.
            self.doneAjax = true;
          })();
        } /* /if */
        return false; // <a>を無効化.
      });
    });
  }
}
