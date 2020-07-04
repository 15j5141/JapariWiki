/* eslint-disable new-cap */
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
      APPLICATION_ID: 'Q5BkzYpYGt0sshPj',
    };
    this.appKey = ncmb.appKey || '';
    this.clientKey = ncmb.clientKey || '';
    this.APPLICATION_ID = ncmb.APPLICATION_ID;
    this.instance = this;
    this.ncmb = new this.NCMB(this.appKey, this.clientKey);

    // カレントユーザー情報の取得
    const currentUser = this.ncmb.User.getCurrentUser();
    if (currentUser) {
      // console.log('ログイン中のユーザー: ' + currentUser.get('userName'));
    } else {
      console.log('未ログインまたは取得に失敗');
    }
  }
  /** NCMB */
  get NCMB() {
    return window.top.NCMB;
  }
  /**
   * @override
   * @return {Promise<JWPage>}
   */
  async getPage(pageURI) {
    const ncPage = this.ncmb.DataStore('Page');
    // 受信.
    return await ncPage
      .equalTo('path', pageURI)
      .fetch()
      .then(function(result) {
        if (!result.objectId) {
          throw new Error('Page:NotFound');
        }
        const newPage = new JWPage(pageURI, result.text);
        newPage.cloudObject = result;
        return newPage;
      })
      .catch(function(err) {
        /** @type {Error} */ const e = err;
        const obj = e.message.match(/^cannot GET .+ \((\d+)\)$/);
        if (obj && obj[1] == '401') {
          throw new Error('JWCloud:Unauthorized');
        } else {
          throw err;
        }
      });
  }
  /**
   * @override
   */
  async putPage(pageData) {
    if (pageData.pageURI == null) {
      throw new Error('err');
    }
    /** NCMB 用クラス. */
    let page = null;
    if (pageData.cloudObject) {
      // クラウドから取得したページデータなら直接更新する.
      page = pageData.cloudObject;
    } else {
      // 上書きするページデータのクラウド上の ID が不明なら検索する.
      const ncPage = this.ncmb.DataStore('Page');
      page = await ncPage.equalTo('path', pageData.pageURI).fetch();
    }
    console.log('b:', page);

    // ページデータが正しいか確認.
    if (page.objectId) {
      // 更新.
      return await page
        .set('author', pageData.authorObject.id)
        .set('path', pageData.pageURI)
        .set('text', pageData.rawText)
        .update()
        .catch(err => {
          /** @type {Error} */ const e = err;
          const obj = e.message.match(/^cannot GET .+ \((\d+)\)$/);
          if (obj && obj[1] == '401') {
            throw new Error('JWCloud:Unauthorized');
          } else {
            throw err;
          }
        });
    } else {
      // クラウドになければ新規作成にする.
      return await this.postPage(pageData);
    }
  }
  /** @override */
  async deletePage(pageData) {
    const ncPage = this.ncmb.DataStore('Page');
    // 受信.
    return await ncPage
      .equalTo('path', pageData.pageURI)
      .fetch()
      .delete()
      .catch(function(err) {
        /** @type {Error} */ const e = err;
        const obj = e.message.match(/^cannot GET .+ \((\d+)\)$/);
        if (obj && obj[1] == '401') {
          throw new Error('JWCloud:Unauthorized');
        } else {
          throw err;
        }
      });
  }
  /**
   * @override
   * @param {JWPage} pageData
   * @return {Promise}
   */
  async postPage(pageData) {
    // NCMB 用クラス生成.
    const page = new (this.ncmb.DataStore('Page'))();
    const acl = new this.ncmb.Acl();
    // ゲストは見えないようにする.
    // acl.setRoleReadAccess('normal', true).setPublicReadAccess(false);
    // 保存.
    return await page
      .set('acl', acl) // 権限設定.
      .set('author', pageData.authorObject.id)
      .set('path', pageData.pageURI)
      .set('text', pageData.rawText)
      .save()
      .then(result => {
        return result;
      })
      .catch(err => {
        /** @type {Error} */ const e = err;
        const obj = e.message.match(/^cannot GET .+ \((\d+)\)$/);
        if (obj && obj[1] == '401') {
          throw new Error('JWCloud:Unauthorized');
        } else {
          throw err;
        }
      });
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
      /** @type {Error} */ const e = err;
      const obj = e.message.match(/^cannot GET .+ \((\d+)\)$/);
      if (obj && obj[1] == '401') {
        throw new Error('JWCloud:Unauthorized');
      } else {
        throw err;
      }
    }
  }
  /** @override */
  async signUp(id, pass) {
    // Userインスタンスの生成
    const user = new this.ncmb.User();
    user.set('userName', id).set('password', pass);
    // 新規登録処理
    return await user.signUpByAccount().catch(function(err) {
      /** @type {Error} */ const e = err;
      const obj = e.message.match(/^cannot GET .+ \((\d+)\)$/);
      if (obj && obj[1] == '401') {
        throw new Error('JWCloud:Unauthorized');
      } else {
        throw err;
      }
    });
  }
  /** @override */
  async signOut() {
    return await this.ncmb.User.logout().catch(err => {
      /** @type {Error} */ const e = err;
      const obj = e.message.match(/^cannot GET .+ \((\d+)\)$/);
      if (obj && obj[1] == '401') {
        throw new Error('JWCloud:Unauthorized');
      } else {
        throw err;
      }
    });
    // message: "This user doesn't login."
  }
  /**
   * @override
   * @param {string} fileName
   */
  async getFileLink(fileName) {
    return (
      'https://mbaas.api.nifcloud.com/2013-09-01/applications/' +
      this.APPLICATION_ID +
      '/publicFiles/' +
      fileName.replace(/[^a-zA-Z0-9_.]/g, '')
    );
  }
  /**
   * @override
   * @param {string} partFileName
   * @return {Promise<Array<string>>}
   */
  async getFileNames(partFileName) {
    const f = this.ncmb.File.order('createDate', true);

    // 部分一致で検索できるようにクエリを微調整する.
    f._where = { fileName: { $regex: partFileName } };

    // 取得する.
    return await f
      .fetchAll()
      .then(function(fileObjects) {
        // ファイル名のみの配列にして返す.
        return fileObjects.map(fileObject => fileObject.fileName);
      })
      .catch(function(err) {
        /** @type {Error} */ const e = err;
        const obj = e.message.match(/^cannot GET .+ \((\d+)\)$/);
        if (obj && obj[1] == '401') {
          throw new Error('JWCloud:Unauthorized');
        } else {
          throw err;
        }
      });
  }
  /**
   * @override
   */
  async getLoginHistory() {
    const ncLL = this.ncmb.DataStore('LoginLog');
    // 受信.
    return await ncLL
      .order('createDate', true) // 降順.
      .limit(50)
      .fetchAll()
      .then(function(results) {
        let html = '';
        if (results.length === 0) {
          console.log(results);
          html = 'LoginLog:NotFound';
          return html;
        }
        for (let i = 0; i < results.length; i++) {
          const object = results[i];
          html +=
            object.get('createDate') +
            ';' +
            object.get('status') +
            ';' +
            object.get('userName') +
            '<br />\n';
        }
        return html;
      })
      .catch(function(err) {
        /** @type {Error} */ const e = err;
        const obj = e.message.match(/^cannot GET .+ \((\d+)\)$/);
        if (obj && obj[1] == '401') {
          throw new Error('JWCloud:Unauthorized');
        } else {
          throw err;
        }
      });
  }
  /**
   * @override
   */
  async addLoginHistory(status, userName) {
    const LoginLog = this.ncmb.DataStore('LoginLog');
    const instanceLL = new LoginLog();

    return instanceLL
      .set('status', status) // success or failure.
      .set('userName', userName)
      .save()
      .then(function(loginLog) {
        console.log(loginLog);
        return true;
      })
      .catch(function(err) {
        /** @type {Error} */ const e = err;
        const obj = e.message.match(/^cannot GET .+ \((\d+)\)$/);
        if (obj && obj[1] == '401') {
          throw new Error('JWCloud:Unauthorized');
        } else {
          throw err;
        }
      });
  }
}
export default CloudNCMB;
