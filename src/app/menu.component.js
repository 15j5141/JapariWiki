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
    const $ = this.$;
    $(function() {
      // メニューのリンクからもページを移動できるようにする.
      $(self.refObj.selector).on('click', 'a.ajaxLoad', e => {
        // ページ名を取得する.
        const pageName = $(e.target).data('page');
        // ページを移動する.
        self.serviceInjection.application.openWiki(pageName);
        return false; // <a>を無効化.
      });
    });
  }
}
