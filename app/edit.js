import AppBase from '../js/class-app_base.js';
import CloudNCMB from '../js/class-cloud_ncmb.js';
import Renderer from '../js/class-renderer.js';
import JWPage from '../js/class-page.js';
import WikiSyntaxPlugin from '../js/class-wiki_syntax_plugin.js';

/**
 * @class
 */
class EditorApp extends AppBase {
  /** @override */
  constructor(selector) {
    super(selector);
    /** @type {Renderer} */
    this._renderer = new EditorRenderer(selector);
    this._cloud = new CloudNCMB();
    /**
     *  このエディタアプリで描画時に扱う HTML データ. Promise 完了済みか確認して取得する.
     * @type {Promise<string>}
     */
    this.htmlByFetch = fetch('app/edit.html').then(data => {
      return data.text();
    });
    this._isEdited = false;
    this._editedResult = null;
  }
  /** @override */
  async onRender() {
    this._renderer.update();
    const html = await this.htmlByFetch;
    this._renderer.setHTML(html);
  }
  /**
   * 編集画面表示.
   * @param {JWPage} page
   * @return {Promise<JWPage>} page
   */
  async editingPage(page) {
    const page_ = page; // 文字エンコード.
    // 基本的な HTML を描画する.
    await this.onRender();

    // イベント登録等.
    await this.htmlScript(page_);

    let timerId;
    // 保存ボタンが押されるまで待機.
    await new Promise((resolve, reject) => {
      timerId = setInterval(() => {
        // 編集結果に中身が入るまで Promise を解決させない.
        if (this._isEdited) {
          clearInterval(timerId);
          resolve();
        }
      }, 500);
    });

    // 編集結果をセット.
    page_.rawText = this._editedResult;
    console.log(this._editedResult);

    return page_;
    // throw new Error('Editor:Cancel');
  }
  /**
   *  イベント登録等.
   * @param {JWPage} page
   */
  async htmlScript(page) {
    let oldValue = '';
    const syntax = new WikiSyntaxPlugin(page.rawText);

    const ajaxEditView = {
      form: {
        _page_name: '',
        get page_name() {
          this._page_name = $('#ajax_edit__form__page-name').val();
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
    top.$('#ajax_edit__form__page-name').val(page.pageURI);
    // 編集内容セット.
    top.$('#ajax_edit__textarea').val(page.rawText);

    /* ---------- イベント登録. ---------- */
    // 一定時間ごとに編集内容を確認して変化があればプレビューを更新する.
    const changeTimerId = setInterval(async function() {
      // 現在の編集内容を取得.
      const newEditedText = $('#ajax_edit__textarea').val();
      // 編集エリアが消えたら == 閉じたらタイマーを削除.
      if (newEditedText == null) {
        clearInterval(changeTimerId);
      }
      // 変化があったらpreviewを更新
      if (oldValue !== newEditedText) {
        // 構文解析.
        const html = WikiSyntaxPlugin.replaceSyntax(newEditedText);
        // プレビューに反映.
        top.$('#ajax_edit__preview').html(html);
        // 内容を退避.
        oldValue = newEditedText;
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

      // 編集内容取得.
      const newEditedText = $('#ajax_edit__textarea').val();
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
   */
  async open(pageURI) {
    this._isEdited = false;
    this._editedResult = null;
    // ページ読み込み.
    let pageData = await this._cloud.getPage(pageURI).catch(err => {
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
    this._renderer.setHTML('保存中...');
    console.log('edited:', pageData);

    if (!pageData) {
      // null なら編集アプリ中断終了.
      return false;
    }

    // null 判定で新規か更新か判断して保存.
    if (pageData.cloudObject) {
      console.log('a:', pageData.cloudObject);
      // 更新.
      return await this._cloud.putPage(pageData);
    } else {
      // 新規作成.
      await this._cloud.postPage(pageData);
    }
    // 編集アプリ正常終了.
    return true;
  }
}
/**
 * エディタ用の描画クラス.
 * @class
 */
class EditorRenderer extends Renderer {
  /**
   * @override
   * @param {string} html
   */
  update(html) {}
}
export default EditorApp;
