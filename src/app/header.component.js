// @ts-check
import ComponentBase from '../scripts/class-component_base.js';
import { StatusService } from './status.service.js';
import { ModelsService } from './models.service.js';
import { WikiService } from './wiki.service.js';
import { IndexService } from './index.service.js';
import { filter, map } from 'rxjs/operators';
import { UploaderService } from './uploader.service.js';
import env from '../.env.json';
/**
 * @class
 */
export class HeaderComponent extends ComponentBase {
  /**
   * @override
   */
  decorator() {
    /** @type {{status: StatusService, models: ModelsService, wiki: WikiService, index: IndexService, uploader: UploaderService}} */
    this.serviceInjection = {
      status: StatusService.prototype,
      models: ModelsService.prototype,
      wiki: WikiService.prototype,
      index: IndexService.prototype,
      uploader: UploaderService.prototype,
    };
  }
  /**
   * @override
   */
  get decoration() {
    return {
      templateUrl: './header.component.html',
      styleUrls: [],
      selector: 'component-header',
    };
  }

  /**
   * @override
   */
  async onInit() {}
  /**
   * @override
   */
  async onStart() {
    // サイト名を表示する.
    this.renderer.html$.next({
      selector: '#header-site_name',
      value: `${env.JW_SITE_NAME}`,
      type: 'html',
    });

    /**
     * ヘッダーのページ名表記を更新する.
     * @param {string} pageURI
     */
    const updatePageNameOnHeader = pageURI => {
      this.renderer.html$.next({
        selector: 'span#header-page_name',
        value: `<a data-page="${pageURI}" class="ajaxLoad none_decoration">${pageURI}</a>`,
        type: 'html',
      });
    };
    // ページデータ読込完了時に発火する.
    this.serviceInjection.wiki.pulledJWPage$
      .pipe(
        filter(page => page != null),
        map(page => page.pageURI)
      )
      .subscribe(updatePageNameOnHeader);
    // アプリ読込によるページ遷移時に発火する.
    this.serviceInjection.index.siteHistory$
      .pipe(
        filter(page => page != null),
        map(state => state.pageURI)
      )
      .subscribe(updatePageNameOnHeader);
  }
  /**
   * @override
   */
  onLoad() {
    const self = this;
    const statusObj = this.serviceInjection.status._status;
    const $ = this.$;
    $(function() {
      // 「編集」ボタンを押したら.
      $(self.element).on('click', '#ajaxLoad_edit', function(event) {
        event.preventDefault();
        // 最新ステータス取得する.
        const status = statusObj;
        status.load();
        // 現在のページ URI を取得する.
        const pageURI = status.getPageURI();
        // 編集画面起動.
        self.serviceInjection.index.executeApp({
          appName: 'Editor',
          pageURI: pageURI,
        });
        return false;
      });

      // 「新規作成」ボタンを押したら.
      $(self.element).on('click', '.onclick_createPage', function(event) {
        event.preventDefault();
        // 最新ステータス取得する.
        const status = statusObj;
        status.load();

        /* 新規作成用のURIを取得する. */
        let path = status.getPageURI().split('/');
        const user = self.serviceInjection.status.getUser();
        if (path[1] === user.id) {
          // 現在のURIがユーザーのディレクトリ下なら利用する.
          path[path.length - 1] = 'untitled';
        } else {
          // それ以外は現在のユーザーIDからURIを設定する.
          path = ['', user.id, 'untitled'];
        }

        // 編集画面起動.
        self.serviceInjection.index.executeApp({
          appName: 'Editor',
          pageURI: path.join('/'),
        });
        return false;
      });

      // ヘッダーのリンクからもページを移動できるようにする.
      $(self.element).on('click', 'a.ajaxLoad', function(event) {
        // ページ名を取得する.
        const pageName = $(event.target).data('page');
        // ページを移動する.
        self.serviceInjection.index.executeApp({
          appName: 'WikiApp',
          pageURI: pageName,
        });
        return false;
      });
      $(self.element).on('click', '#ajaxLoad_upload', function(event) {
        event.preventDefault();
        // 起動.
        self.serviceInjection.uploader.toggleUploader();
        return false;
      });
    });
  }
}
