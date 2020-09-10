// @ts-check
/**
 * ページデータの構造体.
 */
class JWPage {
  /**
   * @param {string} pageURI ページ名
   * @param {string} rawText 生のテキスト
   * @param {Object} authorObject 所有者や編集可能者情報
   */
  constructor(pageURI, rawText, authorObject) {
    this.pageURI = pageURI || 'notitle';
    this.rawText = rawText;
    this.authorObject = {
      id: 'id',
      editable: {},
      ...authorObject,
    };
    /** クラウドで処理するのに必要な DB の id 等を含んだ JSON オブジェクト. */
    this.cloudObject = null;
    this.error = {};
  }
  /**
   * 絶対パスか.
   * @param {string} uri
   * @return {boolean}
   */
  static isAbsoluteURI(uri) {
    // uri.startsWith('/')
    return uri.indexOf('/') === 0;
  }
}

export default JWPage;
