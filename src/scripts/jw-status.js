// @ts-check
import { JWPage } from './';

/**
 * サイトの状態を保持.
 * リロード等されたときに再現するために必要.
 */
export class JWStatus {
  /** */
  constructor() {
    // 初期値.
    this.statusDefault = {
      app: {
        pageURI: '/FrontPage',
        appName: 'WikiApp',
      },
      user: {
        id: 'id',
        name: 'name',
      },
    };
    this._status = this.statusDefault;
    // セッションストレージから読み込む. 無ければ初期値.
    this.load();
    this.save();
  }
  /**
   * ステータス情報を読み込む.
   * 次の順に取得を試みる.
   * "URLのクエリ > window.HistoryAPI > sessionStorage > デフォルト".

   */
  load() {
    // セッションストレージからステータスを読み込み.
    const json = sessionStorage.getItem('JW_Status');

    // セッションストレージに無ければデフォルト値を参照.
    const session = { ...this.statusDefault, ...JSON.parse(json) };

    /** URL のクエリ確認用 */
    const url = new URL(window.location.href);
    /** URL クエリ */
    const params = url.searchParams;

    // セッションストレージと URL クエリの内容を結合.
    this._status.user = session.user;
    this._status.app = {
      pageURI: this.resolveURI(
        params.get('pageURI') ||
          (window.history.state && window.history.state.pageURI) ||
          session.app.pageURI
      ),
      appName:
        params.get('appName') ||
        (window.history.state && window.history.state.appName) ||
        session.app.appName,
    };

    // URL にクエリがある場合取り除く.
    params.delete('appName');
    params.delete('pageURI');
    // URL を書き換え.
    window.history.replaceState(
      this._status.app,
      this._status.app.appName + ': ' + this._status.app.pageURI,
      url.href
    );
  }
  /**
   * sessionStorageへステータス情報を書き込む.
   */
  save() {
    // 安全の為保存する値を手動指定.
    const json = JSON.stringify(this._status);
    // セッションストレージへ書き込み.
    sessionStorage.setItem('JW_Status', json);
  }
  /**
   * ページ URI を取得.
   * @return {string}
   */
  getPageURI() {
    return this._status.app.pageURI;
  }
  /**
   * ページ URI を記録.
   * @param {string} pageURI
   */
  setPageURI(pageURI) {
    this._status.app.pageURI = this.resolveURI(pageURI);
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
  /**
   * クラウドのログイン済みインスタンス？
   * @return {*}
   */
  getSign() {
    // cloud.signIn();
    return null;
  }
}
