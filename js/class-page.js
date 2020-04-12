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
    this.rawText = rawText || '';
    this.authorObject = {
      ...{ authorId: {}, editable: {} },
      ...authorObject,
    };
  }
  /**
   * 絶対パスか.
   * @param {string} uri
   * @return {boolean}
   */
  static isAbsoluteURI(uri) {
    return uri.indexOf('/') === 0;
  }
}

export default JWPage;
