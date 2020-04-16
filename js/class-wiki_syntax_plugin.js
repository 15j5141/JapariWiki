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
  }
  /**
   * 編集後の保存前の処理. コメントID割り当て等.
   * @param {string} rawText
   * @return {Promise<void>}
   */
  async checkBeforeSavingPage(rawText) {
    const resultText = rawText;
    // 新規コメント文法検出.(1個だけ)
    // fixme 同時に複数の新規コメントフォーム設置
    // fixme コメントidの重複確認
    return await WikiSyntaxPlugin.checkBSP_NewCommentForm(resultText).catch(
      err => {
        throw err;
      }
    );
  }
  /**
   * ページ読込後の処理. 構文確認等.
   * @param {string} rawText
   * @return {Promise<string>}
   */
  async checkAfterLoadingPage(rawText) {
    let result = rawText;
    WikiSyntaxPlugin.checkALP_Comment(result); // 実質未使用.
    result = await this.checkComment(result);
    result = WikiSyntaxPlugin.replaceSyntax(result);
    return result;
  }

  /**
   * 新しい#comment(null)に適当な米idを割り当てる.
   * Promiseじゃなくていい.
   * @param {string} rawText
   * @return {Promise<string>}
   */
  static async checkBSP_NewCommentForm(rawText) {
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
   * 実質未使用
   * AfterLoadingPageでのコメント処理.
   * @param {string} text
   * @return {string}
   */
  static checkALP_Comment(text) {
    const regexp = /#comment\(([a-zA-Z0-9]{6,10})\)/g;
    return text;
  }
  /**
   * コメントフォームの差し替え.
   * @param {string} rawText
   * @return {Promise<string>}
   */
  async checkComment(rawText) {
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
    const cforms = await Promise.all(promises).catch(err => {
      throw err;
    });
    // 並列で各コメントの受信, cforms=commentForms
    console.info('all fullfilled, v cforms v');
    console.log(cforms);
    // 0件コメントがあっても扱いやすいようにコメントフォームの数分の連想配列作成する.
    for (let i = 0; i < cforms.length; i++) {
      commentLists[cforms[i].commentObjectId] = cforms[i].data;
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
              `<li>${WikiSyntaxPlugin.replaceSyntax(
                v.contributor
              )}: ${WikiSyntaxPlugin.replaceSyntax(v.content)}</li>`
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
    const moji =
      'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    let i = 0;
    while (i < length) {
      result += moji[Math.floor(Math.random() * moji.length)];
      i++;
    }
    return result;
  }

  /**
   * 置換方式の構文チェック.
   * @param {string} str
   * @return {string}
   */
  static replaceSyntax(str) {
    const syntaxes = [];
    let result = str;
    // &image()
    syntaxes.push([
      /&image\((\w+\.\w+)\)/g,
      '<img src="up/$1" class="tag" style="width:200px;" />',
    ]);
    syntaxes.push([
      /&image\((\w+\.\w+),([0-9]*),([0-9]*)\)/g,
      '<img src="up/$1" class="tag" style="width:$2px;height:$3px;" />',
    ]);
    syntaxes.push([
      /&img\((https?:\/\/.+)\)/g,
      '<img src="$1" class="tag" style="width:200px;" />',
    ]);
    // &size(){}, &color(){}
    syntaxes.push([
      /&size\((\d+)\)\{(.*)\}/g,
      '<span style="font-size:$1px">$2</span>',
    ]);
    syntaxes.push([
      /&color\((#[0-9A-F]{6})\)\{(.*)\}/g,
      '<span style="color:$1">$2</span>',
    ]);
    // ブロック
    syntaxes.push([/#hr\s*/g, '<hr>']);
    // リンク
    syntaxes.push([
      /\[\[(.+)::(.+)]]/g,
      '<a value="$2" href="$2" class="ajaxLoad">$1</a>',
    ]);
    syntaxes.push([
      /\[\[(.+)]]/g,
      '<a value="$1" href="$1" class="ajaxLoad">$1</a>',
    ]);
    // その他
    syntaxes.push([/^\/\/.*$/gm, '']); // 「//」以降をコメントアウト.
    syntaxes.push([/^#.*$/gm, '']); // 「#」以降をコメントアウト.動作が怪しいので廃止.
    // syntaxs.push([/\/\*(.|\s)*?\*\//g, '']); // 「/**/」内をコメントアウト. 「.」は改行には一致しない.
    syntaxes.push([/\/\*\/?([^\/]|[^*]\/|\r|\n)*\*\//g, '']); // 「/**/」内をコメントアウト.詳細は不明...
    // syntaxs.push([/(\/\/.*\r?\n)*/g, '']);
    for (let i = 0; i < syntaxes.length; i++) {
      result = result.replace(syntaxes[i][0], syntaxes[i][1]);
    }
    return result;
  }
  /**
   * 構文解析実行.
   * @return {Promise<string>}
   */
  async run() {}
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
   * @return {Promise<void>}
   */
  async getComment(id) {
    const Comment = this._cloud.ncmb.DataStore('Comment');
    // Commentデータストアに接続.
    const comment = await Comment.equalTo('commentObjectId', id)
      .order('createDate', true)
      .fetchAll()
      .catch(err => {
        console.log(err);
        throw err;
      });

    console.log('Successfully retrieved ' + comment.length + ' scores.');
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
