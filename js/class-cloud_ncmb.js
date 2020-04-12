import CloudBase from './class-cloud_base.js';
import JWPage from './class-page.js';
// import config from './config.json';
/**
 * ニフクラクラス.
 * @class
 */
class CloudNCMB extends CloudBase {
  /** @override */
  constructor() {
    super();
    const ncmb = {
      name: 'ncmb',
      appKey:
        '73214ee5293b310aba334aaf6b58cb41cb89873a1eb88ab505fa7d48dcc2b911',
      clientKey:
        '79d3a32839ef780c0fe16236d8efc7bdd338312ec1d969945346a181ffc9442f',
      instance: null,
    };
    this.appKey = ncmb.appKey || '';
    this.clientKey = ncmb.clientKey || '';
    this.instance = this;
    this.ncmb = new window.NCMB(this.appKey, this.clientKey);
    console.log(this.ncmb);

    // カレントユーザー情報の取得
    const currentUser = this.ncmb.User.getCurrentUser();
    if (currentUser) {
      console.log('ログイン中のユーザー: ' + currentUser.get('userName'));
    } else {
      console.log('未ログインまたは取得に失敗');
    }
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
    // カレントユーザー情報の取得
    const currentUser = this.ncmb.User.getCurrentUser();
    return Boolean(currentUser);
  }
  /** @override */
  async signIn(id, pass) {
    // ログイン用インスタンス作成.
    const user = new this.ncmb.User({
      userName: id,
      password: pass,
    });
    // 非同期でログイン処理.
    try {
      return await this.ncmb.User.login(user);
    } catch (err) {
      console.log(err);
      throw err; // エラー.
    }
  }
  /** @override */
  async signUp(id, pass) {
    // Userインスタンスの生成
    const user = new ncmb.User();
    user.set('userName', id).set('password', pass);
    // 新規登録処理
    return await user.signUpByAccount().catch(function(err) {
      // エラー処理.
      throw err;
    });
  }
  /** @override */
  async signOut() {
    return await this.ncmb.User.logout();
    // message: "This user doesn't login."
  }
}
export default CloudNCMB;
