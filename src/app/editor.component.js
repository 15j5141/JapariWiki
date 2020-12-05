// @ts-check
import JWPage from '../scripts/class-page.js';
import ComponentBase from '../scripts/class-component_base.js';
import { StatusService } from './status.service.js';
import ModelsService from './models.service.js';
import EditorService from './editor.service.js';
import IndexService from './index.service.js';
import { debounceTime, filter, map } from 'rxjs/operators';
import { BehaviorSubject } from 'rxjs';

/**
 * @class
 */
export default class EditorApp extends ComponentBase {
  /** @override */
  decorator() {
    /* ----- サービスのインジェクション. ----- */
    /** @type {{status: StatusService, models: ModelsService, editor: EditorService, index: IndexService}} */
    this.serviceInjection = {
      status: StatusService.prototype,
      models: ModelsService.prototype,
      editor: EditorService.prototype,
      index: IndexService.prototype,
    };
  }
  /**
   * @override
   */
  get decoration() {
    return {
      selector: '#app-editor',
      templateUrl: './editor.component.html',
      styleUrls: ['./editor.component.css'],
    };
  }

  /** @override */
  async onInit() {
    const self = this;
    /** リンク連打対策用. */
    this.doneAjax = true;
    /** @type {JWPage} 現在編集中のページデータが入る. */
    this._pageData = null;
    /** バインディング一覧. */
    this.binds = {
      get $pageName() {
        return self.$element.find('#ajax_edit__form__page-name');
      },
      get $submit() {
        return self.$element.find('#app_edit-submit');
      },
      get $cancel() {
        return self.$element.find('input.btn-cancel');
      },
      get $textarea() {
        return self.$element.find('#ajax_edit__textarea');
      },
      get $preview() {
        return self.$element.find('#ajax_edit__preview');
      },
      preview$: new BehaviorSubject(null),
      get $form() {
        return self.$element.find('#ajax_edit');
      },
    };
    // 変換処理をしてプレビュー表示する.
    this.binds.preview$
      .pipe(
        filter(v => v != null),
        debounceTime(500) // 連続してくるのを抑制する.
      )
      .subscribe(rawText => {
        const html = rawText;
        // 構文解析する.
        html = this.serviceInjection.editor.replaceSyntax(html);
        // プレビューに反映する.
        this.binds.$preview.html(html);
      });

    /** アプリ呼び出しの検知用. */
    const calledMe$ = this.serviceInjection.index.siteHistory$.pipe(
      filter(state => {
        // エディタが開いている場合は閉じる.
        self.forceClose();
        return state && state.appName === 'Editor';
      }),
      map(state => state.pageURI)
    );

    // 編集画面が呼ばれたときエディタを開く.
    calledMe$.subscribe(pageURI => {
      if (pageURI == null) {
        // キャンセルする.
        return;
      }
      // 開く処理.
      this.open(pageURI);
    });
  }
  /** @override */
  async onRender() {
    this.renderer.setHTML(await this.templateHTML);
  }
  /** @override */
  async onLoad() {
    const $ = this.$;
    const self = this;
    const binds = self.binds;

    /* ----- エディタ操作. ----- */
    binds.$textarea.on('keyup click', event => {
      const text = '' + binds.$textarea.val();
      self.binds.preview$.next(text);
    });

    /* ----- キャンセルボタン. ----- */
    binds.$cancel.on('click', event => {
      self.forceClose();
      // 編集したページを表示する.
      self.serviceInjection.index.executeApp({
        appName: 'WikiApp',
        pageURI: this._pageData.pageURI,
      });
      return false;
    });

    /* ----- 保存ボタン. ----- */
    binds.$form.on('submit', event => {
      event.preventDefault(); // 本来のイベントを抑制する.
      // 送信ボタン無効化
      binds.$submit.prop('disabled', true);
      // 編集枠無効化
      binds.$textarea.prop('disabled', true);

      /** @type {string} 編集後の内容 */
      const editedText = '' + binds.$textarea.val();
      const pageData = self._pageData;
      (async function() {
        // 保存前構文解析を実行.
        pageData.rawText = await self.serviceInjection.editor.checkBeforeSavingPage(
          editedText
        );

        // 保存する.
        self.serviceInjection.status.displayState$.next('保存中...');
        await self.serviceInjection.editor.writePage(pageData);

        // 編集アプリ正常終了.
        self.forceClose();

        // 編集したページを表示する.
        self.serviceInjection.index.executeApp({
          appName: 'WikiApp',
          pageURI: pageData.pageURI,
        });
      })();

      return false;
    });
  }
  /** @override */
  show() {
    this.$element.removeClass('app-editor--hide');
    this.$element.addClass('app-editor--show');
  }
  /** @override */
  hide() {
    this.$element.removeClass('app-editor--show');
    this.$element.addClass('app-editor--hide');
  }
  /**
   * 編集画面表示.
   * @param {JWPage} page
   * @return {Promise<JWPage>} page
   */
  async editingPage(page) {
    const page_ = page; // 文字エンコード.
    const binds = this.binds;

    // ページ名を表示.
    binds.$pageName.val(page.pageURI);
    // 編集内容セット.
    binds.$textarea.val(page.rawText);

    // プレビューを表示する.
    this.binds.preview$.next(page.rawText);
    // 送信ボタン有効にする.
    binds.$submit.prop('disabled', false);
    // 編集枠有効にする.
    binds.$textarea.prop('disabled', false);
    return page_;
  }
  /**
   * エディタアプリを開く.
   * @param {string} pageURI
   * @return {Promise<boolean>}
   */
  async open(pageURI) {
    const editor = this.serviceInjection.editor;
    this.show();
    // ページ読み込み.
    this._pageData = await editor.readPage(pageURI);

    // 編集画面を読み込む.
    await this.editingPage(this._pageData).catch(err => {
      if (err.text === 'Editor:Cancel') {
        return null;
      } else {
        throw err;
      }
    });

    return true;
  }
  /**
   * 強制的にエディタを終了する.
   */
  forceClose() {
    this.hide();
  }
}
