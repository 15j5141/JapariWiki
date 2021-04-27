// @ts-check
import { ComponentBase, PageRenderer } from '../scripts';
import { IndexService } from './services';

/**
 * @class
 */
export class MenuComponent extends ComponentBase {
  /**
   * @override
   */
  decorator() {
    this.renderer = new PageRenderer(this.element, '/site_/SideMenu');
    /** @type {{index: IndexService}} */
    this.serviceInjection = {
      index: IndexService.prototype,
    };
  }
  /**
   * @override
   */
  get decoration() {
    return {
      templateUrl: null,
      styleUrls: [],
      selector: '#side-custom_menu',
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
      $(self.element).on('click', 'a.ajaxLoad', e => {
        // ページ名を取得する.
        const pageName = $(e.target).data('page');
        // ページを移動する.
        self.serviceInjection.index.executeApp({
          appName: 'WikiApp',
          pageURI: pageName,
        });
        return false; // <a>を無効化.
      });
    });
  }
}
