import JWPage from './class-page.js';
/**
 * クラウドの継承元クラス.
 */
class CloudBase {
  /** */
  constructor() {}
  /**
   * ページデータを取得する.
   * @abstract
   * @param {string} pageURI
   * @return {Promise<JWPage>}
   */
  getPage(pageURI) {
    throw new Error('Not Implemented');
  }
  /**
   * ページデータを上書き保存する.
   * @abstract
   * @param {JWPage} pageData
   * @return {Promise<void>}
   */
  putPage(pageData) {
    throw new Error('Not Implemented');
  }
  /**
   * ページデータを削除する.
   * @abstract
   * @param {JWPage} pageData
   * @return {Promise}
   */
  deletePage(pageData) {
    throw new Error('Not Implemented');
  }
  /**
   * ページデータを新規保存する.
   * @abstract
   * @param {JWPage} pageData
   * @return {Promise}
   */
  postPage(pageData) {
    throw new Error('Not Implemented');
  }
  /**
   * 現在のログイン状況を取得する.
   * @abstract
   * @return {Promise}
   */
  isLogin() {
    throw new Error('Not Implemented');
  }
  /**
   * ログインする.
   * @abstract
   * @param {*} id
   * @param {*} pass
   * @return {Promise}
   */
  signIn(id, pass) {
    throw new Error('Not Implemented');
  }
  /**
   * アカウントを登録する.
   * @abstract
   * @param {*} id
   * @param {*} pass
   * @return {Promise}
   */
  signUp(id, pass) {
    throw new Error('Not Implemented');
  }
  /**
   * ログアウトする.
   * @abstract
   * @return {Promise}
   */
  signOut() {
    throw new Error('Not Implemented');
  }
}

export default CloudBase;