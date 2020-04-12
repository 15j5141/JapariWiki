import CloudBase from './class-cloud_base.js';
import JWPage from './class-page.js';
// import config from './config.json';
/**
 * ニフクラクラス.
 * @class
 */
class CloudNCMB extends CloudBase {
  /** @override */
  constructor() {}
  /** @override */
  getPage(pageName) {
    throw new Error('Not Implemented');
  }
  /** @override */
  putPage(pageURI, pageData) {
    throw new Error('Not Implemented');
  }
  /** @override */
  deletePage(pageName, pageData) {
    throw new Error('Not Implemented');
  }
  /** @override */
  postPage(pageName, pageData) {
    throw new Error('Not Implemented');
  }
  /** @override */
  isLogin() {
    throw new Error('Not Implemented');
  }
  /** @override */
  signIn(id, pass) {
    throw new Error('Not Implemented');
  }
  /** @override */
  signUp(id, pass) {
    throw new Error('Not Implemented');
  }
  /** @override */
  signOut() {
    throw new Error('Not Implemented');
  }
}
export default CloudNCMB;
