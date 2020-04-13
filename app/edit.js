/**
 * @namespace
 * @requires ncmb.min.js
 */
const PageEdit = {
  /** @type {Object} */
  ncmb: {},
  /**
   * 実行.
   * @param {string} post
   */
  exec: function(post) {
    if (post == null) {
      return;
    }
    if (post.text != null) {
      this.editText(post.page, post.text);
    } else {
      this.editPage(post.page);
    }
  },
  /**
   *
   * @param {string} text
   * @param {string} [page]
   */
  editText: function(text, page) {},
  /**
   *
   * @param {string} page
   */
  editPage: function(page) {
    const page_ = page; // 文字エンコード.
  },
  /**
   * ページを保存する.
   * @param {string} page
   * @param {string} text
   * @param {string} [author]
   */
  writePage: function(page, text, author) {
    const Page = this.ncmb.DataStore('Page');
    const dbPage = new Page();

    dbPage
      .set('path', page)
      .set('text', text)
      .set('author', author)
      .save()
      .then(function(dbPage) {
        // 保存後の処理
      })
      .catch(function(err) {
        // エラー処理
      });
  },
  readPage: function(page) {
    const Page = this.ncmb.DataStore('Page');
    const dbPage = new Page();
    // 受信.
    Page.equalTo('path', page)
      .fetch()
      .then(function(result) {
        console.log(result.text);
      })
      .catch(function(err) {
        console.log(err);
      });
  },
};
