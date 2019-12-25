class Util {
    /**
     * @returns {Object}
     */
    static get URLQuery() {
        // URLからクエリを抽出.
        const query = {};
        location.search.substring(1).split('&').forEach(q => {
            const obj = q.split('=');
            query[obj[0]] = obj[1];
        });
        return query;
    }
    /**
     * @param {Object} query
     */
    static set URLQuery(query) {
        // URLからクエリを抽出.
        const result = Object.keys(query).map(key => key + '=' + query[key]).join('&');
        location.search = '?' + result;
    }
    static setURLQuery(key, value) {
        const obj = Util.URLQuery;
        if (value === null) {
            delete obj[key];
        } else {
            obj[key] = value;
        }
        Util.URLQuery = obj;
    }
    static getURLQuery(key) {
        return Util.URLQuery[key];
    }
}
export default Util;