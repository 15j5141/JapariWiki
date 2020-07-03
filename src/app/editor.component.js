// @ts-check
import JWPage from '../scripts/class-page.js';
import WikiSyntaxPlugin from '../scripts/class-wiki_syntax_plugin.js';
import ComponentBase from '../scripts/class-component_base.js';
import { StatusService } from './status.service.js';
import ApplicationService from './application.service.js';

/**
 * @class
 */
export default class EditorApp extends ComponentBase {
  /** @override */
  decorator() {
    /* ----- サービスのインジェクション. ----- */
    /** @type {{status: StatusService, application: ApplicationService}} */
    this.serviceInjection = {
      status: StatusService.prototype,
      application: ApplicationService.prototype,
    };
  }
  /**
   * @override
   */
  static get decoration() {
    return {
      selector: '#app-editor',
      templateUrl: './editor.component.html',
      styleUrls: [],
    };
  }

  /** @override */
  async onInit() {
    this.serviceInjection.application.editorApp = this;
    /** リンク連打対策用. */
    this.doneAjax = true;
    this._isEdited = false;
    /** @type {string} */
    this._editedResult = null;
  }
  /** @override */
  async onRender() {
    this.renderer.setHTML(await this.templateHTML);
  }
  /**
   * 編集画面表示.
   * @param {JWPage} page
   * @return {Promise<JWPage>} page
   */
  async editingPage(page) {
    const page_ = page; // 文字エンコード.
    // 基本的な HTML を描画する.
    await this.draw();

    // イベント登録等.
    await this.htmlScript(page_);

    let timerId;
    // 保存ボタンが押されるまで待機.
    const isSuccess = await new Promise((resolve, reject) => {
      timerId = setInterval(() => {
        // 編集結果に中身が入るまで Promise を解決させない.
        if (this._isEdited) {
          clearInterval(timerId);
          if (this._editedResult == null) {
            // 結果が null なら異常終了と判断する.
            resolve(false);
          }
          resolve(true);
        }
      }, 500);
    });
    if (!isSuccess) throw new Error('Editor:Cancel');

    // 編集結果をセット.
    page_.rawText = this._editedResult;

    return page_;
    // throw new Error('Editor:Cancel');
  }
  /**
   *  イベント登録等.
   * @param {JWPage} page
   */
  async htmlScript(page) {
    const self = this;
    const $ = this.$;
    let oldValue = '';
    const syntax = new WikiSyntaxPlugin(page.rawText);

    const ajaxEditView = {
      form: {
        _page_name: '',
        get page_name() {
          this._page_name = '' + $('#ajax_edit__form__page-name').val();
          return this._page_name;
        },
        /** @param {string} param ページ名 */
        set page_name(param) {
          this._page_name = param;
          $('#ajax_edit__form__page-name').val('' + param);
        },
      },
      init: function() {
        // ページ名表示.
        this.form.page_name = JapariWiki.status.wiki.page;
      },
    };

    // ページ名を表示.
    $('#ajax_edit__form__page-name').val(page.pageURI);
    // 編集内容セット.
    $('#ajax_edit__textarea').val(page.rawText);

    /* ---------- イベント登録. ---------- */
    // 一定時間ごとに編集内容を確認して変化があればプレビューを更新する.
    const changeTimerId = setInterval(async function() {
      /** @type {string} 編集中の内容 */
      const newEditingText = '' + $('#ajax_edit__textarea').val();
      // 編集エリアが消えたら == 閉じたらタイマーを削除.
      if (newEditingText == null) {
        clearInterval(changeTimerId);
        return;
      }
      // 変化があったらpreviewを更新
      if (oldValue !== newEditingText) {
        // 構文解析.
        const html = WikiSyntaxPlugin.replaceSyntax(newEditingText);
        // プレビューに反映.
        $('#ajax_edit__preview').html(html);
        // 内容を退避.
        oldValue = newEditingText;
      }
    }, 1000);
    // 保存ボタン.
    $(document).on('submit', '#ajax_edit', event => {
      console.log('submit');

      event.preventDefault(); // 本来のPOSTを打ち消すおまじない
      if (changeTimerId != null) {
        clearInterval(changeTimerId);
      }
      // 送信ボタン無効化
      $('#app_edit-submit').prop('disabled', 'true');
      // 編集枠無効化
      $('#ajax_edit__textarea').prop('readonly', 'true');

      /** @type {string} 編集後の内容 */
      const newEditedText = '' + $('#ajax_edit__textarea').val();
      // 保存前構文解析を実行.
      syntax.checkBeforeSavingPage(newEditedText).then(result => {
        this._editedResult = result;
        this._isEdited = true;
      });
    });

    return;
  }
  /**
   * エディタアプリを開く.
   * @param {string} pageURI
   * @return {Promise<boolean>}
   */
  async open(pageURI) {
    const cloud = this.serviceInjection.status.getCloud();
    this._isEdited = false;
    this._editedResult = null;
    // 履歴に追加する. FixMe エディタであることを履歴にも反映する.
    this.pushState(pageURI);
    // ページ読み込み.
    let pageData = await cloud.getPage(pageURI).catch(err => {
      if (err.message === 'Page:NotFound') {
        // ページがなければ新規作成して処理続行.
        return new JWPage(pageURI, '', {});
      } else {
        throw err;
      }
    });
    // 編集画面を読み込む.
    pageData = await this.editingPage(pageData).catch(err => {
      if (err.text === 'Editor:Cancel') {
        return null;
      } else {
        throw err;
      }
    });
    this.renderer.setHTML('保存中...');
    console.log('edited:', pageData);

    if (!pageData) {
      // null なら編集アプリ中断終了.
      return false;
    }

    // null 判定で新規か更新か判断して保存.
    if (pageData.cloudObject) {
      // 更新.
      await cloud.putPage(pageData);
    } else {
      // 新規作成.
      await cloud.postPage(pageData);
    }
    // 編集アプリ正常終了.
    return true;
  }
  /**
   * 強制的にエディタを終了する.
   */
  forceClose() {
    this._isEdited = false;
  }
}