/**
 * サイトの状態を保持.
 * リロード等されたときに再現するために必要.
 */
class JWStatus {
  /** */
  constructor() {
    // 初期値.
    this.statusDefault = {
      pageURI: 'FrontPage',
      app: 'wiki',
    };
    this._status = this.statusDefault;
    // セッションストレージから読み込む. 無ければ初期値.
    this.load();
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
    sessionStorage.setItem('JW_status', json);
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
    this._status.pageURI = uri;
  }
}

export default JWStatus;
