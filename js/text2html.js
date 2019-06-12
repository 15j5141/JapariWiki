// require ncmb.min.js
function checkBeforeSavingPage(rawText, ncmb) { // 編集後の保存前の確認.
  return new Promise(function(resolve, reject) {
    var resultText = rawText;
    // 新規コメント文法検出.(1個だけ)
    // fixme 同時に複数の新規コメントフォーム設置
    // fixme コメントidの重複確認
    checkBSP_NewCommentForm(resultText).then(
      result => {
        return checkBSP_NewCommentForm(result);
      }
    ).then(result => {
      resolve(result);
    }).catch(err => {
      console.log(err);
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
    // commenterでログイン.
    let user = new ncmb.User({
      userName: 'commenter',
      password: 'commenter'
    });
    //user
    //ncmb.User.login(user).then(function(user) {
    var Comment = ncmb.DataStore("Comment");
    var comment = new Comment();
    let match;
    let ids = [];
    // コメントのobjIDのみ取り出し
    while ((match = regexp.exec(resultText)) !== null) {
      ids.push(getComment(Comment, match[1]));
    }
    //return
    Promise.all(ids).then(function(cforms) { // 並列で各コメントの受信, cforms=commentForms
      console.info('all fullfilled, v cforms v');
      console.log(cforms);
      // 構文置換
      for (var i = 0; i < cforms.length; i++) {
        resultText = resultText.replace('#comment(' + cforms[i][0].commentObjectId + ')', // plzme ここでは配列だけ作って返した先でhtml化したほうがいいかも.
          '<div style="background-color:#ccc;">' +
          '<form class="CommentForm" action_="javascript:void(0);" data-objid="' + cforms[i][0].commentObjectId + '" style="margin:0px;"><p"><input type="text" name="content" size="20" value="" placeholder="コメント本文" /><input type="submit" value="投稿" /></p></form>' +
          '<ul>' +
          cforms[i].map(v => `<li>${v.contributor}: ${v.content}</li>`).reduce((c0, c1) => c0 + c1) +
          '</ul>' + '</div>'
        );
      }
      //return user.logout();
    }).then(function() {
      resolve(resultText);
    }).catch(function(err) {
      console.log(err);
      reject(err);
    });
  });
}
// コメント受信
function getComment(commentClass, id) {
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

function setComment(CommentClass, comObj, content, contributor) {
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