// require ncmb.min.js
function checkBeforeSavingPage(rawText) { // 編集後の保存前の確認.
  return new Promise(function(resolve, reject) {
    var resultText = rawText;
    // 新規コメント文法検出.(1個だけ)
    // fixme 同時に複数の新規コメントフォーム設置
    // fixme コメントidの重複確認
    checkBSP_NewCommentForm(resultText).then(result => {
      resolve(result);
    }).catch(err => {
      resolve(err);
    });
  });
}
// 新しい#comment(null)に適当な米idを割り当てる.Promiseじゃなくていい
function checkBSP_NewCommentForm(rawText) {
  return new Promise(function(resolve, reject) {
    var resultText = rawText;
    if (/#comment\(\s*\)/.test(rawText)) {
      resultText = resultText.replace(/#comment\(\s*\)/g, function(s) {
        var comObj = rndStr(10);
        return '#comment(' + comObj + ')';
      });
    }
    resolve(resultText);
  });
}

function checkAfterLodingPage(rawText, ncmb) { // 読込後の構文.
  return new Promise(function(resolve, reject) {
    let result = rawText;
    checkALP_Comment(result);
    checkComment(result, ncmb).then(function(result) {
      console.log('ok');
    }).then(function(result) {
      resolve(result);
    });
  });
}

function checkALP_Comment(text) {
  let regexp = /#comment\(([a-zA-Z0-9]{6,10})\)/g;
  return text;
}


function checkComment(rawText, ncmb) { // コメントフォームの差し替え
  return new Promise(function(resolve, reject) {
    // 初期化
    var resultText = rawText;
    var regexp = /#comment\(([a-zA-Z0-9]{6,10})\)/g;
    let ncmbC = new NCMBComment();
    var Comment = ncmb.DataStore("Comment");
    var comment = new Comment();
    let match;
    let ids = []; // コメントオブジェID

    // コメントのcommentObjctIDのみ本文から取り出す.
    while ((match = regexp.exec(resultText)) !== null) {
      ids.push(match[1]);
    }

    // コメント取得結果を入れる連想配列を用意する.
    let commentLists = {}; // idでの連想配列でコメント一覧.
    ids.forEach(id => commentLists[id] = []); // 念の為arrayで初期化.

    // コメントフォームだけ置換. 1件以上コメントがあれば下でコメント一覧を入れる.
    let promises = ids.map(id => ncmbC.getComment(Comment, id)); // idsからPromise作成.
    Promise.all(promises).then(function(cforms) { // 並列で各コメントの受信, cforms=commentForms
      console.info('all fullfilled, v cforms v');
      console.log(cforms);
      // 0件コメントがあっても扱いやすいようにコメントフォームの数分の連想配列作成する.
      for (var i = 0; i < cforms.length; i++) {
        commentLists[cforms[i].commentObjectId] = cforms[i].data;
      }
      // 構文置換
      Object.keys(commentLists).forEach(function(key) {
        let html = '<div class="WikiSyntax_Comment">' +
          '<form class="CommentForm" data-objid="' + key + '">' +
          '<input type="text" name="content" size="25" value="" placeholder="コメント本文" />' +
          '<input type="text" name="contributor" size="10" value="" placeholder="名前" />' +
          '<input type="submit" value="投稿" />' +
          '</form>' +
          '<ul>' +
          // 取得したコメントデータをhtml化する.
          commentLists[key].map(v => `<li>${replaceSyntax(v.contributor)}: ${replaceSyntax(v.content)}</li>`).reduce((c0, c1) => c0 + c1, '') + /*1件も無ければここが空になる*/
          '</ul>' + '</div>';
        resultText = resultText.replace('#comment(' + key + ')', html);
      });
    }).then(function() {
      resolve(resultText);
    }).catch(function(err) {
      console.log(err);
      reject(err);
    });
  });
}
// lengthの長さのランダムな文字列を生成
function rndStr(length) {
  var moji = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  var result = '';
  var i = 0;
  while (i < length) {
    result += moji[Math.floor(Math.random() * moji.length)];
    i++;
  }
  return result;
}

function replaceSyntax(str) {
  let syntaxs = [];
  let result = str;
  // &image()
  syntaxs.push([/&image\((\w+\.\w+)\)/g, '<img src="up/$1" class="tag" style="width:200px;" />']);
  syntaxs.push([/&image\((\w+\.\w+),([0-9]*),([0-9]*)\)/g, '<img src="up/$1" class="tag" style="width:$2px;height:$3px;" />']);
  syntaxs.push([/&img\((https?:\/\/.+)\)/g, '<img src="$1" class="tag" style="width:200px;" />']);
  // &size(){}, &color(){}
  syntaxs.push([/&size\((\d+)\)\{(.*)\}/g, '<span style="font-size:$1px">$2</span>']);
  syntaxs.push([/&color\((#[0-9A-F]{6})\)\{(.*)\}/g, '<span style="color:$1">$2</span>']);
  // ブロック
  syntaxs.push([/#hr\s*/g, '<hr>']);
  // リンク
  syntaxs.push([/\[\[(.+)::(.+)]]/g, '<a value="$2" href="$2" class="ajaxLoad">$1</a>']);
  syntaxs.push([/\[\[(.+)]]/g, '<a value="$1" href="$1" class="ajaxLoad">$1</a>']);
  // その他
  syntaxs.push([/\s+\/\/.*$/gm, '']); // 「//」以降を消す.
  syntaxs.push([/\s+#.*$/gm, '']); // 「#」以降を消す.動作が怪しいので廃止.
  for (let i = 0; i < syntaxs.length; i++) {
    result = result.replace(syntaxs[i][0], syntaxs[i][1]);
  }
  return result;
}
class NCMBComment {
  // コメント受信
  getComment(commentClass, id) {
    return new Promise((resolve, reject) => {
      // Commentデータストアに接続.
      commentClass.equalTo("commentObjectId", id)
        .order("createDate", true)
        .fetchAll() // 受信
        .then(function(results) {
          console.log("Successfully retrieved " + results.length + " scores.");
          resolve({
            commentObjectId: id,
            data: results
          });
        })
        .catch(function(err) {
          console.log(err);
          reject(err);
        });
    });
  }

  setComment(CommentClass, comObj, content, contributor) {
    return new Promise((resolve, reject) => {
      //var Comment = ncmb.DataStore("Comment");
      var comment = new CommentClass();
      comment
        .set("commentObjectId", comObj) // コメントID
        .set("content", content) // 内容
        .set("contributor", contributor) // 投稿者
        .save() // データストアに接続.
        .then(function(obj) {
          resolve(obj)
        })
        .catch(function(err) {
          reject(err);
        });
    });
  }
}