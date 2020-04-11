import JWUtil from "./class-util";

/**
 * サイトの状態を保持.
 * リロード等されたときに再現するために必要.
 */
export class JWStatus {
    constructor() {
        // セッションストレージから読み込む. 無ければ初期値.
        this.status = {
            ...JWStatus.status_origin, // オリジナル.
            ...this.load(), // sessionStorage.
            ...JWUtil.URLQuery // URL.
        };
    }
    static get status_origin() {
        return {
            page: '',
        };
    }
    /**
     * URLから読み取る.
     * @returns {Object}
     */
    static get() { return JWUtil.URLQuery; }
    /**
     * URLへ書き込む.
     * @param {Object} query 
     */
    static set(query) { JWUtil.URLQuery = query; }
    /**
     * sessionStorageからステータス情報を読み込む.
     */
    static load() {
        const json = sessionStorage.getItem('JW_status');
        const status = JSON.parse(json);
        return status;
    }
    /**
     * sessionStorageへステータス情報を書き込む.
     * @param {string} json 
     */
    static save(status) {
        const json = JSON.stringify(status);
        sessionStorage.setItem('JW_status', json);
    }
    getPageName() {
        return this.status.page;
    }
}

export default JWStatus;
