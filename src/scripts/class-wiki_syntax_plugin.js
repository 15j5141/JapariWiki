/* eslint-disable new-cap */
// @ts-check
import CloudNCMB from './class-cloud_ncmb.js';
import SyntaxPluginBase from './class-syntax_plugin_base.js';
/**
 * Wiki 構文解析用プラグインクラス.
 * @class
 */
class WikiSyntaxPlugin extends SyntaxPluginBase {
  /**
   * @param {string} text
   */
  constructor(text) {
    super(text);
    this._cloud = new CloudNCMB();
    /** 簡易的に取得したファイルへのリンクのディレクトリ部分. */
    this.uploadedImageLink = 'up/';
    (async () => {
      this.uploadedImageLink = (await this._cloud.getFileLink('CONST')).replace(
        /CONST/,
        ''
      );
    })();
  }
  /**
   * 編集後の保存前の処理. コメントID割り当て等.
   * @param {string} rawText
   * @return {Promise<string>}
   */
  async checkBeforeSavingPage(rawText) {
    const resultText = rawText;
    // 新規コメント文法検出.(1個だけ)
    // fixme 同時に複数の新規コメントフォーム設置
    // fixme コメントidの重複確認
    return await WikiSyntaxPlugin.checkNewCommentForm(resultText).catch(err => {
      throw err;
    });
  }
  /**
   * ページ読込後の処理. 構文確認等.
   * @param {string} rawText
   * @return {Promise<string>}
   */
  async checkAfterLoadingPage(rawText) {
    let result = rawText;
    result = await this.checkComment(result);
    result = this.replaceSyntax(result);
    return result;
  }

  /**
   * 新しい#comment(null)に適当な米idを割り当てる.
   * Promiseじゃなくていい.
   * @param {string} rawText
   * @return {Promise<string>}
   */
  static async checkNewCommentForm(rawText) {
    let resultText = rawText;
    if (/#comment\(\s*\)/.test(rawText)) {
      resultText = resultText.replace(/#comment\(\s*\)/g, function(s) {
        const comObj = WikiSyntaxPlugin.rndStr(10);
        return '#comment(' + comObj + ')';
      });
    }
    return resultText;
  }
  /**
   * コメントフォームの差し替え.
   * @param {string} rawText
   * @return {Promise<string>}
   */
  async checkComment(rawText) {
    const self = this;
    // 初期化
    let resultText = rawText;
    const regexp = /#comment\(([a-zA-Z0-9]{6,10})\)/g;
    const ncmbC = new NCMBComment();
    let match;
    const ids = []; // コメントオブジェID

    // コメントのcommentObjectIDのみ本文から取り出す.
    while ((match = regexp.exec(resultText)) !== null) {
      ids.push(match[1]);
    }

    // コメント取得結果を入れる連想配列を用意する.
    const commentLists = {}; // idでの連想配列でコメント一覧.
    ids.forEach(id => (commentLists[id] = [])); // 念の為arrayで初期化.

    // コメントフォームだけ置換. 1件以上コメントがあれば下でコメント一覧を入れる.
    const promises = ids.map(id => ncmbC.getComment(id)); // idsからPromise作成.
    // 並列で各コメントの受信.
    const commentForms = await Promise.all(promises).catch(err => {
      throw err;
    });
    // 0件コメントがあっても扱いやすいようにコメントフォームの数分の連想配列作成する.
    for (let i = 0; i < commentForms.length; i++) {
      commentLists[commentForms[i].commentObjectId] = commentForms[i].data;
    }
    // 構文置換
    Object.keys(commentLists).forEach(function(key) {
      const html =
        '<div class="WikiSyntax_Comment">' +
        '<form class="CommentForm" data-objid="' +
        key +
        '">' +
        '<input type="text" name="content" size="25" value="" placeholder="コメント本文" />' +
        '<input type="text" name="contributor" size="10" value="" placeholder="名前" />' +
        '<input type="submit" value="投稿" />' +
        '</form>' +
        '<ul>' +
        // 取得したコメントデータをhtml化する.
        commentLists[key]
          .map(
            v =>
              `<li>${self.replaceSyntax(v.contributor)}: ${self.replaceSyntax(
                v.content
              )}</li>`
          )
          .reduce((c0, c1) => c0 + c1, '') /* 1件も無ければここが空になる*/ +
        '</ul>' +
        '</div>';
      resultText = resultText.replace('#comment(' + key + ')', html);
    });
    return resultText;
  }

  /**
   * lengthの長さのランダムな文字列を生成.
   * @param {number} length
   * @return {string}
   */
  static rndStr(length) {
    const character =
      'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    let i = 0;
    while (i < length) {
      result += character[Math.floor(Math.random() * character.length)];
      i++;
    }
    return result;
  }

  /**
   * 置換方式の構文チェック.
   * @param {string} str
   * @return {string}
   */
  replaceSyntax(str) {
    /** @type {Array<Array<RegExp|string|function|any>>} */
    const syntaxes = [];
    let result = str;
    // &image(xxxx.jpg)
    syntaxes.push([
      /&image\((\w+\.\w+)\)/g,
      '<img src="' +
        this.uploadedImageLink +
        '$1" class="tag" style="max-width:360px;" />',
    ]);
    // &image(xxxx.jpg,200,100)
    syntaxes.push([
      /&image\((\w+\.\w+),([0-9]*),([0-9]*)\)/g,
      '<img src="' +
        this.uploadedImageLink +
        '$1" class="tag" style="width:$2px;height:$3px;" />',
    ]);
    // &img(https://domain.com/aaa/bbb/ccc.jpg)
    syntaxes.push([
      /&img\((https?:\/\/.+)\)/g,
      '<img src="$1" class="tag" style="width:200px;" />',
    ]);
    // &size(64){message}
    syntaxes.push([
      /&size\((\d+)\)\{(.*)\}/g,
      '<span style="font-size:$1px">$2</span>',
    ]);
    // &color(#FF0000){message}
    syntaxes.push([
      /&color\((#[0-9A-F]{6})\)\{(.*)\}/g,
      '<span style="color:$1">$2</span>',
    ]);
    // 名前付き別タブで開く. [[message::https://domain/aaa]]
    syntaxes.push([
      /\[\[(.+?)::(https?:\/\/.+?)]]/g,
      '<a value="$2" href="$2" target=" _blank">$1</a>',
    ]);
    // Wikiページリンク. [[表示名::ページ名]]
    syntaxes.push([
      /\[\[(.+?)::(.+)]]/g,
      '<a data-page="$2" href="?pageURI=$2" class="ajaxLoad">$1</a>',
    ]);
    // 名前付きWikiページリンク. [[ページ名]]
    syntaxes.push([
      /\[\[(.+?)]]/g,
      '<a data-page="$1" href="?pageURI=$1" class="ajaxLoad">$1</a>',
    ]);
    // ページ内リンク. [[#za0a0a0a]]
    syntaxes.push([
      /\[\[#([a-z][a-f0-9]{7})]]/g,
      '<a class="page_pos" value="$1" href="#$1">$1</a>',
    ]);
    // 名前付きページ内リンク. [[message::#za0a0a0a]]
    syntaxes.push([
      /\[\[(.+?)::#([a-z][a-f0-9]{7})]]/g,
      '<a class="page_pos" value="$2" href="#$2">$1</a>',
    ]);
    // 打消し線.
    syntaxes.push([/%%(.+?)%%/g, '<s>$1</s>']);
    // イタリック体.
    syntaxes.push([/'''(.+?)'''/g, '<i>$1</i>']);
    // 強調.
    syntaxes.push([/''(.+?)''/g, '<strong>$1</strong>']);

    // ブロック.
    // 水平線. #hr
    syntaxes.push([/#hr\s*/g, '<hr>']);

    //
    syntaxes.push([/#code((.|\s)+?)#end/g, '<code>$1</code>']);

    // その他
    syntaxes.push([/(^|[^:])\/\/.*/g, '__NewLine__']); // 「//」以降をコメントアウト.
    // syntaxes.push([/(?<!https:)(?<!http:)#.*/g, '__NewLine__']); // 「#」以降をコメントアウト.動作が怪しいので廃止.
    // syntaxes.push([/\/\*(.|\s)*?\*\//g, '']); // 「/**/」内をコメントアウト. 「.」は改行には一致しない.
    // syntaxes.push([/\/\*\/?([^\/]|[^*]\/|\r|\n)*\*\//g, '']); // 「/**/」内をコメントアウト.詳細は不明...
    syntaxes.push([/\/\*[\s\S]*?\*\//g, '']); // a79c210bae23a29d4ff1 from Qiita.

    // ***title [#za0b2c5d]
    syntaxes.push([
      /^\*\*\*(.*) \[#([a-z][a-f0-9]{7})\](.*)$/gm,
      '<p class="Asta3" id="$2">$1</p>__NewLine__',
    ]);
    syntaxes.push([
      /^\*\*(.*) \[#([a-z][a-f0-9]{7})\](.*)$/gm,
      '<p class="Asta2" id="$2">$1</p>__NewLine__',
    ]);
    syntaxes.push([
      /^\*(.*) \[#([a-z][a-f0-9]{7})\](.*)$/gm,
      '<p class="Asta1" id="$2">$1</p>__NewLine__',
    ]);
    // ***title
    syntaxes.push([/^\*\*\*(.*)$/gm, '<p class="asta3">$1</p>__NewLine__']);
    syntaxes.push([/^\*\*(.*)$/gm, '<p class="asta2">$1</p>__NewLine__']);
    syntaxes.push([/^\*(.*)$/gm, '<p class="asta1">$1</p>__NewLine__']);

    // リスト
    syntaxes.push([
      /^---(.+)$/gm,
      '<ul><ul><ul type="square"><li>$1</li></ul></ul></ul>__NewLine__',
    ]);
    syntaxes.push([
      /^--(.+)$/gm,
      '<ul><ul type="circle"><li>$1</li></ul></ul>__NewLine__',
    ]);
    syntaxes.push([/^-(.+)$/gm, '<ul type="disc"><li>$1</li></ul>__NewLine__']);

    syntaxes.push([
      /^\|(.*\|)[^|\n]*$/gm,
      (...matches) => {
        const result = matches[1].replace(/(.*?)\|/g, '<td>$1</td>');
        return '<table><tr>' + result + '</tr></table>__NewLine__';
      },
    ]);

    // &countdown(2000/01/01,day)
    syntaxes.push([
      /&countdown\((\d{4}\/[0-1]?\d\/[0-3]?\d)(,day)?\)/g,
      (...matches) => {
        const date = new Date(matches[1]);
        const delta = (date.getTime() - Date.now()) / 1000 / 60 / 60 / 24;
        if (-1.0 < delta && delta < 1.0) {
          return '今';
        }
        return '' + delta;
      },
    ]);
    // 未実装. &new(text,2000/12/31)
    syntaxes.push([
      /&new\((text,)?(\d{4}\/[0-1]?\d\/[0-3]?\d).*?\)/g,
      (...matches) => {
        const date = new Date(matches[2]);
        const delta = (date.getTime() - Date.now()) / 1000 / 60 / 60 / 24;
        if (delta > 7.0 && delta < 0.0) {
          return '[未実装構文]';
        }
        return '[未実装構文]';
      },
    ]);

    // 未実装. 目次機能.
    syntaxes.push([
      /^#contents\(page=(.*)\)$\n/gm,
      '[未実装構文]',
      // '<div class="page_index">目次（予定）</div>',
    ]);

    // 一斉処理.
    for (let i = 0; i < syntaxes.length; i++) {
      result = result.replace(syntaxes[i][0], syntaxes[i][1]);
    }

    // ブロック構文に余分な改行をしないように改行コード除去.
    result = result.replace(/__NewLine__\r?\n/g, '');
    // 何らかの理由で残った __NewLine__ を除去.
    result = result.replace('__NewLine__', '');
    // 改行コードを <br> に置換.
    result = result.replace(/\r?\n/g, '<br>');
    return result;
  }
}

/**
 * NCMBでのコメント関係の処理.
 * @class
 */
class NCMBComment {
  /** */
  constructor() {
    this._cloud = new CloudNCMB();
  }
  /**
   * コメント受信.
   * @param {string} id
   * @return {Promise<{ commentObjectId: string, data: any }>}
   */
  async getComment(id) {
    const Comment = this._cloud.ncmb.DataStore('Comment');
    // Commentデータストアに接続.
    /** @type {Array<any>} */
    const comment = await Comment.equalTo('commentObjectId', id)
      .order('createDate', true)
      .fetchAll()
      .catch(err => {
        console.log(err);
        throw err;
      });

    return { commentObjectId: id, data: comment };
  }

  /**
   * 新規コメントを投稿.
   * @param {string} comObj コメントオブジェクトID
   * @param {string} content 内容
   * @param {string} contributor 投稿者
   * @return {Promise<void>}
   */
  async setComment(comObj, content, contributor) {
    const Comment = this._cloud.ncmb.DataStore('Comment');
    const comment = new Comment();
    const result = await comment
      .set('commentObjectId', comObj) // コメントID
      .set('content', content) // 内容
      .set('contributor', contributor) // 投稿者
      .save() // データストアに接続.
      .catch(err => {
        throw err;
      });
    return result;
  }
}

export default WikiSyntaxPlugin;
