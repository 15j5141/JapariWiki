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
    ids.forEach(id => commentLists[id] = '');

    // コメントフォームだけ置換. 1件以上コメントがあれば下でコメント一覧を入れる.
    let promises = ids.map(id => ncmbC.getComment(Comment, id)); // idsからPromise作成.
    Promise.all(promises).then(function(cforms) { // 並列で各コメントの受信, cforms=commentForms
      console.info('all fullfilled, v cforms v');
      console.log(cforms);
      // 0件コメントがあっても扱いやすいようにコメントフォームの数分の連想配列作成する.
      for (var i = 0; i < cforms.length; i++) {
        commentLists[cforms[i][0].commentObjectId] = cforms[i];
      }
      // 構文置換
      Object.keys(commentLists).forEach(function(key) {
        let html = '<div style="background-color:#ccc;">' +
          '<form class="CommentForm" data-objid="' + key + '" style="margin:0px;"><p>' +
          '<input type="text" name="content" size="25" value="" placeholder="コメント本文" />' +
          '<input type="text" name="contributor" size="10" value="" placeholder="名前" />' +
          '<input type="submit" value="投稿" />' +
          '</p></form>' +
          '<ul>' +
          // 取得したコメントデータをhtml化する.
          commentLists[key].map(v => `<li>${v.contributor}: ${v.content}</li>`).reduce((c0, c1) => c0 + c1) + /*1件も無ければここが空になる*/
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
          resolve(results);
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