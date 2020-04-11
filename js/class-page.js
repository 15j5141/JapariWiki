import { } from "./class";

class Editor {
    constructor() {
        this.edittingText = '';
    }
}
/**
 * ページデータの構造体.
 */
class Page {
    /**
     * @param {string} pageName ページ名
     * @param {string} rawText 生のテキスト
     * @param {Object} authorObject 所有者や編集可能者情報
     */
    constructor(pageName, rawText, authorObject) {
        this.pageName = pageName || 'notitle';
        this.rawText = rawText || '';
        this.authorObject = {
            ...{ authorId: {}, editable: {} },
            ...authorObject
        };
    }
}

export default Page;