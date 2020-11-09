// @ts-check
import { filter } from 'rxjs/operators';
import { atComponent } from '../scripts/decorations';
import { StatusService } from './status.service.js';
import UploaderService from './uploader.service.js';

/**
 * 画像アップロード用のコンポーネント.
 * @class
 */
export class UploaderComponent extends atComponent({
  templateUrl: './uploader.component.html',
  styleUrls: ['./uploader.component.css'],
  selector: '#app-uploader',
})() {
  /**
   * @override
   */
  decorator() {
    /* ----- サービスのインジェクション. ----- */
    /** @type {{status: StatusService, uploader:UploaderService}} */
    this.serviceInjection = {
      status: StatusService.prototype,
      uploader: UploaderService.prototype,
    };

    /* ----- プロパティ宣言. ----- */
    /** コンポーネント起動時に1度だけ処理する為のフラグ */
    this.isUploaderLoaded = false;
    /** @type {boolean} アップロードコンポーネントが表示中かどうか. */
    this.isOpen = false;
  }
  /**
   * @override
   */
  async onInit() {
    this.status = this.serviceInjection.status;

    // コンポーネント開閉の為のイベントを登録する.
    const event$ = this.serviceInjection.uploader.event$.pipe(
      filter(e => e != null)
    );
    event$.pipe(filter(e => e === 'open')).subscribe(e => this.open());
    event$.pipe(filter(e => e === 'close')).subscribe(e => this.close());
    event$.pipe(filter(e => e === 'toggle')).subscribe(e => {
      if (this.isOpen) {
        this.close();
      } else {
        this.open();
      }
    });
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
    // 「ファイルを送信」ボタンを押したら.
    $(self.$element).on('submit', '#form_upload', function(event) {
      event.preventDefault(); // FORM を無効化する.

      /** @type {HTMLInputElement} */
      const fileForm = $(event.target)
        .find('input[type="file"]')
        .get(0);
      // 順にアップロード処理を行う.
      (async () => {
        for (let i = 0; i < fileForm.files.length; i++) {
          const file = fileForm.files[i];
          let resultHTML = '';
          // ファイル情報を表示する.
          resultHTML += 'name:' + file.name + ' ,size:' + file.size + '<br />';
          // ファイルの正当性を確認する.
          if (file.size > 1024 * 1024 * 10) {
            resultHTML += 'error: ファイルが大きい.<br />';
            continue;
          }
          // 画像をアップロードする.
          const result = await self.uploadImage(file);
          if (result) {
            /** 大丈夫だった時. */
            resultHTML +=
              'completed: uploaded file name is ' + result + '<br />';
            const link = await self.status.getCloud().getFileLink(result);
            // アップロード済みの一覧に画像を挿入する.
            let html = '';
            html += '<li class="uploaded_list">';
            html += `<img class="uploaded_list" src="${link}" /><br />`;
            html += `<input type="text" value="&image(${result})" readonly />`;
            html += '</li>';
            self.$element.find('.uploaded_images ul').prepend(html);
          } else {
            /** ダメだった時. */
            resultHTML += 'error: なんかダメ.<br />';
          }
          // 結果をログとして表示する.
          self.$element.find('.uploaded_log').append(resultHTML);
        }
      })();
      return false;
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
    this.isOpen = true;
    this.show();
  }
  /** */
  async close() {
    this.isOpen = false;
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

    // ファイルリンク一覧を取得する.
    const fileLinks = await Promise.all(
      fileNames.map(fileName => cloud.getFileLink(fileName))
    );

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
  /**
   * アップロード処理.
   * @param {File} fileData
   * @return {Promise<string>}
   */
  async uploadImage(fileData) {
    const self = this;
    const cloud = self.status.getCloud();
    /** 拡張子の判定結果. */
    const extended = fileData.name
      .toLowerCase()
      .match(/\.(jpg|jpeg|png|bmp|gif|webp|apng)$/);
    const fileName =
      this.status.getUser().id +
      '_' +
      Math.random()
        .toString(36)
        .substring(2) +
      (extended.length != 0 ? extended[0] : '');

    if (!fileData) return false;
    console.log({
      filename: fileName,
      rawFile: fileData,
    });

    if (
      await cloud.postFile({
        filename: fileName,
        rawFile: fileData,
      })
    ) {
      return fileName;
    } else {
      return null;
    }
  }
}
