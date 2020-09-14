// @ts-check
/** @typedef {import("./class-page").default} JWPage */
/**
 * @typedef {Object} JWFile
 * @property {Object=} acl
 * @property {string!} filename "aaa.png"
 * @property {string=} createDate "2020-04-18T15:15:23.424Z"
 * @property {number=} fileSize 741758
 * @property {string=} mimeType "image/png"
 * @property {string=} updateDate "2020-04-18T15:15:23.424Z"
 * @property {File=} rawFile
 */
/**
 * @typedef {Object} JWUser ユーザ情報
 * @property {string!} id "id"
 * @property {string!} name "name"
 * @property {string=} createDate "2020-04-18T15:15:23.424Z"
 * @property {string=} updateDate "2020-04-18T15:15:23.424Z"
 */
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
   * @return {Promise<JWUser>}
   */
  async isLogin() {
    throw new Error('Not Implemented');
  }
  /**
   * ログインする.
   * @abstract
   * @param {*} id
   * @param {*} pass
   * @return {Promise<JWUser>}
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
  /**
   * ファイル取得.
   * @deprecated
   * @abstract
   * @param {JWFile} file
   */
  async getFile(file) {
    throw new Error('Not Implemented');
  }
  /**
   * ファイルを保存.
   * @abstract
   * @param {JWFile} file
   * @return {Promise<boolean>}
   */
  async postFile(file) {
    throw new Error('Not Implemented');
  }
  /**
   * ファイルを更新.
   * @abstract
   * @param {JWFile} file
   * @return {Promise<boolean>}
   */
  async putFile(file) {
    throw new Error('Not Implemented');
  }
  /**
   * ファイルを削除.
   * @abstract
   * @param {JWFile} file
   * @return {Promise<boolean>}
   */
  async deleteFile(file) {
    throw new Error('Not Implemented');
  }
  /**
   * ファイルのパブリックなパスを取得する.
   * @abstract
   * @param {string} fileName
   * @return {Promise<string>}
   */
  async getFileLink(fileName) {
    throw new Error('Not Implemented');
  }
  /**
   * ファイル名を部分一致で検索する.
   * @abstract
   * @param {string} partFileName
   * @return {Promise<Array<string>>}
   */
  async getFileNames(partFileName) {
    throw new Error('Not Implemented');
  }
  /**
   * ログイン履歴を取得する.
   * @abstract
   * @return {Promise<string>}
   */
  async getLoginHistory() {
    throw new Error('Not Implemented');
  }
  /**
   * ログイン履歴を追加する. 成否を返す.
   * @abstract
   * @param {string} status
   * @param {string} userName
   * @return {Promise<boolean>}
   */
  async addLoginHistory(status, userName) {
    throw new Error('Not Implemented');
  }
}

export default CloudBase;
