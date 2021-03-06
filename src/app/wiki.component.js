// @ts-check
import { PageRenderer, ComponentBase } from '../scripts';
import {
  StatusService,
  ModelsService,
  WikiService,
  IndexService,
} from './services';
import { atComponent } from '../scripts/decorations';
import MarkdownIt from 'markdown-it';
const markdown = new MarkdownIt({ breaks: true });

// デコレーションする.
const Component = atComponent({
  selector: '#app-wiki',
  templateUrl: './wiki.component.html',
  styleUrls: [],
  styles: [],
})();

/**
 * @class
 */
export class WikiApp extends Component {
  /**
   * @override
   */
  decorator() {
    this.renderer = new PageRenderer(this.element, null);

    /* ----- サービスのインジェクション. ----- */
    /** @type {{status: StatusService, models: ModelsService, wiki: WikiService, index: IndexService}} */
    this.serviceInjection = {
      status: StatusService.prototype,
      models: ModelsService.prototype,
      wiki: WikiService.prototype,
      index: IndexService.prototype,
    };
  }

  /**
   * @override
   */
  async onInit() {
    /** リンク連打対策用. */
    this.doneAjax = true;

    // ページデータ読込完了時に表示を書き換える.
    const subscribe = () => {
      this.serviceInjection.wiki.pulledJWPage$.subscribe(
        jwPage => {
          console.log('page$-onNext', jwPage);
          // クリック制限を解除.
          this.doneAjax = true;

          // 受信してものを構文解析して描画する.
          if (/\.md$/.test(jwPage.pageURI.toLowerCase())) {
            // Markdownで描画する.
            this.drawByMarkdown(jwPage.rawText);
          } else {
            // 拡張子が無ければJWの構文で描画する.
            this.renderer.html$.next({ value: jwPage.rawText });
          }
        },
        e => {
          console.log('page$-onErr', e);
        },
        () => console.log('page$-onComp')
      );
    };
    subscribe();

    // ページ移動の瞬間に読み込み画面を表示する.
    this.serviceInjection.wiki.pageURI$.subscribe(uri => {
      console.log('pageURI$-onNext', uri);
      // 読み込み中であることを明示.
      this.renderer.cls();
      // await this.loadTemplate();
      this.renderer.println('Start Loading...');
      // 受信する.
      this.renderer.println('Downloading ' + uri + ' .');
    });

    // トップページ読み込みを発火する.
    // const uri = (history.state && history.state.pageURI) || '/FrontPage';
    // this.serviceInjection.wiki.pageURI$.next(uri);
  }
  /**
   * @override
   */
  async onRender() {
    const statusObj = this.serviceInjection.status._status;
    // 最新のステータス取得.
    statusObj.load();
    // ページ名取得.
    // const pageURI = statusObj.getPageURI();

    this.renderer.cls();
  }
  /**
   * Wikiデータ取得()
   * @param {string} uri
   * @return {Promise<string>}
   */
  async getPageHTML(uri) {
    let html;
    const models = this.serviceInjection.models;
    try {
      // クラウドからページデータ取得.
      const pageData = await models.readPage(uri);
      html = pageData.rawText;
    } catch (err) {
      if (err.message === 'Page:NotFound') {
        // ページが存在しなければエラーページを返す.
        html = 'ページがありません。<br>新規作成<br>' + uri;
      } else {
        // それ以外のエラー.
        html = '通信エラーです。' + err.message;
      }
    }
    return html;
  }
  /**
   * ページを移動.
   * @param {string} pageURI
   */
  async move(pageURI = null) {
    const statusObj = this.serviceInjection.status._status;
    // パスを解決.
    const uri = this.serviceInjection.wiki.resolveURI(pageURI);
    statusObj.setPageURI(uri);
    // FixMe パスを解決できなければエラー?
    statusObj.save();

    // ページ上までスクロール.
    this.scroll2Top();

    // ページの読み込みを開始する.
    this.serviceInjection.index.executeApp({
      appName: 'WikiApp',
      pageURI: uri,
    });
  }
  /**
   * @override
   */
  onLoad() {
    const self = this;
    const $ = this.$;
    const statusObj = this.serviceInjection.status._status;
    $(function() {
      // <a class="ajaxLoad">をクリックしたら. Wiki内ページリンクを踏んだら.
      $(self.element).on('click', 'a.ajaxLoad', function(event) {
        event.preventDefault(); // 標準ページ移動を無効化.
        /* 連打対策 */
        if (self.doneAjax) {
          self.doneAjax = false;
          // ページを更新.
          (async () => {
            // ページ名を取得する.
            const pageName = $(event.target).data('page');
            // ページを移動する.
            await self.move(pageName);
            // クリック制限を解除.
            self.doneAjax = true;
          })();
        } /* /if */
        return false; // <a>を無効化.
      });
    });
  }
  /**
   * ページ上部へスクロールする.
   */
  scroll2Top() {
    this.$('html,body').animate({ scrollTop: 0 }, 100, 'swing');
  }
  /**
   * MarkdownでHTMLを書き換える.
   * @param {string} rawText
   */
  drawByMarkdown(rawText) {
    // convert markdown to HTML.
    const html = markdown.render(rawText);
    this.$element.html(html);
  }
}
