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
    });
  }
}
