// @ts-check
import ComponentBase from '../scripts/class-component_base.js';
import ApplicationService from './application.service.js';

/**
 * @class
 */
export default class HeaderComponent extends ComponentBase {
  /**
   * @override
   */
  decorator() {
    this.decoration.templateUrl = './header.component.html';
    this.decoration.styleUrls = [];
    /** @type {{application: ApplicationService}} */
    this.serviceInjection = {
      application: ApplicationService.prototype,
    };
  }
  /**
   * @override
   */
  async onInit() {
    console.log(this.element);
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
        self.applicationService
          .openEditor(pageURI)
          .then(result => {
            console.log(result);
            // 編集したページを表示する.
            self.applicationService.openWiki(pageURI);
          })
          .catch(err => {
            console.log(err);
          });
        return false;
      });
      $(self.element).on('click', 'a.ajaxLoad', function(e) {
        const pageName = $(event.target).data('page');
        self.serviceInjection.application.openWiki(pageName);
        return false;
      });
    });
  }
}
