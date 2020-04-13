import JWPage from './class-page.js';

/**
 * サイトの状態を保持.
 * リロード等されたときに再現するために必要.
 */
class JWStatus {
  /** */
  constructor() {
    // 初期値.
    this.statusDefault = {
      pageURI: '/FrontPage',
      app: 'wiki',
    };
    this._status = this.statusDefault;
    // セッションストレージから読み込む. 無ければ初期値.
    this.load();
    this.save();
  }
  /**
   * sessionStorageからステータス情報を読み込む.
   */
  load() {
    // セッションストレージからステータスを読み込み.
    const json = sessionStorage.getItem('JW_Status');

    // セッションストレージに無ければデフォルト値を参照.
    const session = JSON.parse(json) || this.statusDefault;
    // URL クエリから読み込み.
    const params = new URLSearchParams(window.location.search);

    // セッションストレージと URL クエリの内容を結合.
    const status = {
      pageURI: params.get('pageURI') || session.pageURI,
      app: params.get('app') || session.app,
    };
    this._status = status;
  }
  /**
   * sessionStorageへステータス情報を書き込む.
   * @param {string} status
   */
  save() {
    // 安全の為保存する値を手動指定.
    const json = JSON.stringify({
      pageURI: this._status.pageURI,
      app: this._status.app,
    });
    // セッションストレージへ書き込み.
    sessionStorage.setItem('JW_Status', json);
  }
  /** */
  setURL() {
    // 現在のページ閲覧履歴がなければ.
    if (history.state !== this.getPageURI()) {
      // URL 生成.
      const url = new URL(window.location.href);
      url.searchParams.set('pageURI', this._status.pageURI);
      url.searchParams.set('app', this._status.app);
      // 履歴に登録.
      window.history.pushState(this.getPageURI(), '', url.href);
    }
  }
  /**
   * ページ URI を取得.
   * @return {string}
   */
  getPageURI() {
    return this._status.pageURI;
  }
  /**
   * ページ URI を記録.
   * @param {string} pageURI
   */
  setPageURI(pageURI) {
    this._status.pageURI = this.resolveURI(pageURI);
  }
  /**
   * 相対パスを絶対パスに解決.
   * @param {string} pageURI
   * @return {string}
   */
  resolveURI(pageURI) {
    if (JWPage.isAbsoluteURI(pageURI)) {
      // 絶対パスならそのまま.
      return pageURI;
    } else {
      // 相対パスなら現在のページ URI から解決.
      // 現在のページ URI を取得.
      const paths = this.getPageURI().split('/');
      // ページ名に当たる部分を書き換え.
      paths[paths.length - 1] = pageURI;
      // 配列を結合.
      return paths.join('/');
    }
  }
}

export default JWStatus;
