import config from './config.json';
import JWPage from "./class-page";
class Cloud { // 要継承.
    constructor() {
        // this.appKey = '';
        // this.clientKey = '';
        this.instance = null;
    }
    /**
     * 指定ページデータを取得.
     * @param {string} pageName 
     * @returns {Promise}
     */
    getPage(pageName) { throw new Error('Not Implemented'); }
    /**
     * 指定ページデータを保存.
     * @async
     * @param {string} pageName 
     * @param {JWPage} pageClass 
     * @returns {Promise}
     */
    setPage(pageName, pageClass) { throw new Error('Not Implemented'); }
    /**
     * 指定ページデータを新規保存.
     * @async
     * @param {string} pageName 
     * @param {JWPage} pageClass 
     * @returns {Promise}
     */
    createPage(pageName, pageClass) { throw new Error('Not Implemented'); }
    /**
     * @async
     * @returns {Promise}
     */
    isLogin() { throw new Error('Not Implemented'); }
    /**
     * ログインする.
     * @async
     * @param {*} id 
     * @param {*} pass 
     * @returns {Promise}
     */
    signin(id, pass) { throw new Error('Not Implemented'); }
    /**
     * アカウントを登録する.
     * @async
     * @param {*} id 
     * @param {*} pass 
     * @returns {Promise}
     */
    signup(id, pass) { throw new Error('Not Implemented'); }
    /**
     * ログアウトする.
     * @async 
     * @returns {Promise}
     */
    signout() { throw new Error('Not Implemented'); }
}
class Nifty extends Cloud {
    constructor() {
        super();
        const ncmb = config['clouds']['ncmb'];
        this.appKey = ncmb.appKey || '';
        this.clientKey = ncmb.clientKey || '';
        this.instance = this;
        this.ncmb = new window.NCMB(this.appKey, this.clientKey);
    }
    getPage(pageName) {
        return new Promise((resolve, reject) => {
            const ncPage = this.ncmb.DataStore('Page');
            // 受信.
            ncPage.equalTo('path', pageName).fetch()
                .then(function(result) {
                    // $('#app_wiki-body').html(result.text);
                    resolve(new JWPage(pageName, result.text));
                })
                .catch(function(err) {
                    reject(err);
                });
        });
    }
}
class JWPHP extends Cloud {
    constructor() {
        super();
        const jwphp = config['clouds']['jwphp'];
        this.appKey = jwphp.appKey || '';
        this.clientKey = jwphp.clientKey || '';
        this.instance = this;
        // this.ajax = new window.$.ajax;
    }
    getPage(pageName) {
        return new Promise((resolve, reject) => {
            $.ajax({
                url: "ajax_load.php?page=" + encodeURIComponent(pageName),
                cache: false,
                // 成功時処理.
                success: function(data, status, xhr) {
                    resolve(data);
                },
                // エラー時処理.
                error: function(err, status, xhr) {
                    if (xhr.status === 201) {
                        $.ajax({
                            url: "ajax_edit.php?page=" + encodeURIComponent(pageName),
                            cache: false,
                            success: function(html) {
                                $("#content_add").html(html);
                                $("#content_add").append(xhr.location);
                            }
                        });
                    } else {
                        reject();
                    }

                }
            }); /* $.ajax */

        });
    }
    createPage(pageName, pageClass) {

    }
}
export default Nifty;