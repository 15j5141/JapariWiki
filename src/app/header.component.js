// @ts-check
import ComponentBase from '../scripts/class-component_base.js';
import ApplicationService from './application.service.js';
import { StatusService } from './status.service.js';
import ModelsService from './models.service.js';
import WikiService from './wiki.service.js';

/**
 * @class
 */
export default class HeaderComponent extends ComponentBase {
  /**
   * @override
   */
  decorator() {
    /** @type {{status: StatusService, application: ApplicationService, models: ModelsService, wiki: WikiService}} */
    this.serviceInjection = {
      status: StatusService.prototype,
      application: ApplicationService.prototype,
      models: ModelsService.prototype,
      wiki: WikiService.prototype,
    };
  }
  /**
   * @override
   */
  static get decoration() {
    return {
      templateUrl: './header.component.html',
      styleUrls: [],
      selector: '#header',
    };
  }

  /**
   * @override
   */
  async onInit() {
    this.serviceInjection.wiki.page$.subscribe(page => {
      this.renderer.html$.next({
        selector: 'span#header-page_name',
        value: `<a data-page="${page.pageURI}" class="ajaxLoad none_decoration">${page.pageURI}</a>`,
        type: 'html',
      });
    });
  }
  /**
   * @override
   */
  onLoad() {
    const self = this;
    const $ = this.$;
    $(function() {
      // 「編集」ボタンを押したら.
      $(self.element).on('click', '#ajaxLoad_edit', function(event) {
        event.preventDefault();
        // 最新ステータス取得する.
        const status = self.refObj.status;
        status.load();
        // 現在のページ URI を取得する.
        const pageURI = status.getPageURI();
        // 編集画面起動.
        self.serviceInjection.application
          .openEditor(pageURI)
          .then(result => {
            console.log(result);
            // 編集したページを表示する.
            self.serviceInjection.application.openWiki(pageURI);
          })
          .catch(err => {
            console.log(err);
          });
        return false;
      });
      // メニューのリンクからもページを移動できるようにする.
      $(self.element).on('click', 'a.ajaxLoad', function(e) {
        // ページ名を取得する.
        const pageName = $(event.target).data('page');
        // ページを移動する.
        self.serviceInjection.application.openWiki(pageName);
        return false;
      });
      $(self.element).on('click', '#ajaxLoad_upload', function(event) {
        event.preventDefault();
        // 起動.
        self.serviceInjection.application.toggleUploader();
        return false;
      });
    });
  }
}
