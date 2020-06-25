/**
 * ツール群.
 * @class
 */
class JWUtil {
  /**
   * @return {Object}
   */
  static get URLQuery() {
    // URLからクエリを抽出.
    const query = {};
    location.search
      .substring(1)
      .split('&')
      .forEach(q => {
        const obj = q.split('=');
        if (obj.length !== 2) {
          return;
        }
        query[obj[0]] = obj[1];
      });
    return query;
  }
  /**
   * @param {Object} query
   */
  static set URLQuery(query) {
    // URLからクエリを抽出.
    const result = Object.keys(query)
      .map(key => key + '=' + query[key])
      .join('&');
    // URLを構築.
    const url =
      location.origin + location.pathname + '?' + result + location.hash;
    // URLを置換.
    history.replaceState(null, '', url);
  }
  /**
   *
   * @param {*} key
   * @param {*} value
   */
  static setURLQuery(key, value) {
    const obj = JWUtil.URLQuery;
    if (value == null) {
      // undefinedでもtrue.
      delete obj[key];
    } else {
      obj[key] = value;
    }
    JWUtil.URLQuery = obj;
  }
  static getURLQuery(key) {
    return JWUtil.URLQuery[key];
  }
}
export default JWUtil;
