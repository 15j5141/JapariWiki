/**
 * @namespace
 */
let PageEdit = {
    /**
     * 実行.
     * @param {string} post 
     */
    exec: function(post) {
        if (post == null) { return; }
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
    editText: function(text, page) {

    },
    /**
     * 
     * @param {string} page 
     */
    editPage: function(page) {
        const page_ = page; // 文字エンコード.
    }
}