// @ts-check
import ComponentBase from '../scripts/class-component_base.js';
import ApplicationService from './application.service.js';
import { StatusService } from './status.service.js';
/**
 * 画像アップロード用のコンポーネント.
 * @class
 */
export class UploaderComponent extends ComponentBase {
  /**
   * @override
   */
  static get decoration() {
    return {
      templateUrl: './uploader.component.html',
      styleUrls: ['./uploader.component.css'],
      selector: '#app-uploader',
    };
  }
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
    /** コンポーネント起動時に1度だけ処理する為のフラグ */
    this.isUploaderLoaded = false;
  }
  /**
   * @override
   */
  async onInit() {
    this.status = this.serviceInjection.status;
    this.application = this.serviceInjection.application;
    // サービスにコンポーネントを登録する.
    this.application.uploaderApp = this;
  }
  /**
   * @override
   */
  async onRender() {
    await super.onRender();
  }
  /** @override */
  onLoad() {
    const $ = this.$;
    const self = this;

    /* ---------- イベント登録. ---------- */
    // 画像をアップロードする.
    $('#form_upload').on('submit', function(event) {
      event.preventDefault(); // FORM を無効化する.
    });
  }
  /** @override */
  show() {
    if (!this.isUploaderLoaded) {
      this.isUploaderLoaded = true;
      this.loadImages();
    }
    this.$element.removeClass('app-uploader--hide');
    this.$element.addClass('app-uploader--show');
  }
  /** @override */
  hide() {
    this.$element.removeClass('app-uploader--show');
    this.$element.addClass('app-uploader--hide');
  }
  /** */
  async open() {
    this.show();
  }
  /** */
  async close() {
    this.hide();
  }
  /**
   * コンポーネント内で画像を読み込む.
   */
  async loadImages() {
    const self = this;

    this.$element.find('.uploaded_images').html('読み込み中...');

    // 画像一覧を取得する.
    const cloud = self.status.getCloud();
    const partFileName = self.status.getUser().id;

    // ファイル名一覧を取得する.
    const fileNames = await cloud.getFileNames(partFileName + '_');
    console.log(fileNames);

    // ファイルリンク一覧を取得する.
    const fileLinks = await Promise.all(
      fileNames.map(fileName => cloud.getFileLink(fileName))
    );
    console.log(fileLinks);

    // HTML を生成する.
    let html = '<ul class="uploaded_list">';
    for (let i = 0; i < fileNames.length; i++) {
      html += '<li class="uploaded_list">';
      html += `<img class="uploaded_list" src="${fileLinks[i]}" /><br />`;
      html += `<input type="text" value="&image(${fileNames[i]})" readonly />`;
      html += '</li>';
    }
    html += '</ul>';

    // HTML をセットする.
    this.$element.find('.uploaded_images').html(html);
  }
}
