// @ts-check
/**
 * @fileoverview ルートコンポーネントへの一括読込を担う.
 */
import ComponentBase from '../scripts/class-component_base.js';
import ApplicationService from './application.service.js';
import { StatusService } from './status.service.js';

/**
 * コンポーネントのサンプルコード.
 * @class
 */
export class AppComponent extends ComponentBase {
  /**
   * @override
   */
  decorator() {
    /* ----- サービスのインジェクション. ----- */
    /** @type {{status: StatusService, application: ApplicationService}} */
    this.serviceInjection = {
      status: StatusService.prototype,
      application: ApplicationService.prototype,
    };

    /* ----- プロパティ宣言. ----- */

    /** History API 使用の可否. */
    this.isCanBeHistory =
      history && history.pushState && history.state !== undefined;
  }
  /**
   * @override
   */
  static get decoration() {
    return {
      templateUrl: './app.component.html',
      styleUrls: ['../styles/style.css'],
      selector: '#app-root',
    };
  }
  /**
   * @override
   */
  async onInit() {
    this.status = this.serviceInjection.status._status;
    this.cloud = this.serviceInjection.status.getCloud();
  }
  /**
   * @override
   */
  async onRender() {
    // ログインセッション切れを確認する.
    this.renderer.setHTML('認証確認中...');
    console.log('check:', await this.cloud.isLogin());
    const status = this.serviceInjection.status;
    // Fixme ログイン確認処理を移動して, this.cloud への参照をなくす.
    const userObj = this.cloud.ncmb.User.getCurrentUser();
    status.setUser({ id: userObj.userName, name: userObj.userName });

    // 描画する.
    this.renderer.setHTML(await this.templateHTML);
  }
  /**
   * @override
   */
  onLoad() {
    const self = this;
    const $ = this.$;
    $(function() {
      $(document).on('click', '#ajaxLoad_upload_', function(event) {
        event.preventDefault();
        // キーボード操作などにより、オーバーレイが多重起動するのを防止する
        $(event.target).blur(); // ボタンからフォーカスを外す
        if ($('#modal-overlay')[0]) return false;
        // 新しくモーダルウィンドウを起動しない

        // オーバーレイ用のHTMLコードを、[body]内の最後に生成する
        $('body').append('<div id="modal-overlay"></div>');
        $('#modal-overlay').append('<div id="modal-content"></div>');
        // FixMe ajaxLoad('#modal-content', 'ajax_upload.php');
        // [$modal-overlay]をフェードインさせる
        $('#modal-overlay').fadeIn('slow');

        return false;
      });

      $(document).on('click', '#modal-overlay_', function(event) {
        // [#modal-overlay]と[#modal-close]をフェードアウトする
        if ($(event.target).is('#modal-overlay')) {
          $('#modal-close,#modal-overlay').fadeOut('slow', function() {
            // フェードアウト後、[#modal-overlay]をHTML(DOM)上から削除
            $('#modal-overlay').remove();
          });
        }
      });

      if (history.state == null) {
        // 履歴情報がなければ(Wikiを開いた時)現ページ名で上書き.
        history.replaceState('' + self.status.getPageURI(), null, null);
      }
    });
  }
}
