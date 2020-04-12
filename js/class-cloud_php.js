import CloudBase from './class-cloud_base.js';
/**
 * PHPクラウドクラス.
 * @class
 */
class CloudPHP extends CloudBase {
  /** */
  constructor() {
    super();
    const jwphp = config['clouds']['jwphp'];
    this.appKey = jwphp.appKey || '';
    this.clientKey = jwphp.clientKey || '';
    this.instance = this;
    // this.ajax = new window.$.ajax;
  }
  /**
   *
   * @param {*} pageName
   * @return {*}
   */
  getPage(pageName) {
    return new Promise((resolve, reject) => {
      $.ajax({
        url: 'ajax_load.php?page=' + encodeURIComponent(pageName),
        cache: false,
        // 成功時処理.
        success: function(data, status, xhr) {
          resolve(data);
        },
        // エラー時処理.
        error: function(err, status, xhr) {
          if (xhr.status === 201) {
            $.ajax({
              url: 'ajax_edit.php?page=' + encodeURIComponent(pageName),
              cache: false,
              success: function(html) {
                $('#content_add').html(html);
                $('#content_add').append(xhr.location);
              },
            });
          } else {
            reject(err);
          }
        },
      }); /* $.ajax */
    });
  }
  /**
   *
   * @param {*} pageName
   * @param {*} pageData
   */
  createPage(pageName, pageData) {}
}
export default PHPCloud;
